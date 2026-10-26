import { useCallback, useEffect, useRef, useState } from "react";

export interface Recording {
  blob: Blob;
  durationSec: number;
  // Backend/Groq ko file ka naam extension ke saath chahiye
  filename: string;
}

// Browser jo support kare, pehla wala (Chrome/Edge webm, Firefox ogg, Safari mp4)
const PREFERRED_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];

const pickMimeType = () =>
  typeof MediaRecorder === "undefined"
    ? ""
    : (PREFERRED_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? "");

const extensionFor = (mime: string) =>
  mime.includes("ogg") ? "ogg" : mime.includes("mp4") ? "m4a" : "webm";

// Ek jawab itne se lamba nahi (backend 10 MB leta hai, ye usse kaafi neeche hai); room is pe khud send karta hai
export const MAX_RECORDING_SEC = 10 * 60;

// Mic se jawab record karna (asli audio, text nahi). level: 0..1, live waveform ke liye.
// onMaxReached: MAX_RECORDING_SEC pura hone pe (room recording send kar deta hai)
export const useRecorder = (onMaxReached?: () => void) => {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopResolveRef = useRef<((r: Recording | null) => void) | null>(null);
  const onMaxRef = useRef(onMaxReached);
  const maxFiredRef = useRef(false);

  useEffect(() => {
    onMaxRef.current = onMaxReached;
  }, [onMaxReached]);

  const supported =
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";

  // Mic band, timer band, sab saaf
  const cleanup = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    timerRef.current = null;
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setLevel(0);
  }, []);

  const start = useCallback(async () => {
    if (!supported || recorderRef.current) return;
    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const denied = err instanceof DOMException && err.name === "NotAllowedError";
      setError(
        denied
          ? "Microphone access is blocked. Allow it from the address bar, or type your answer."
          : "No microphone found. Please connect one, or type your answer.",
      );
      return;
    }

    const mimeType = pickMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const type = recorder.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      const durationSec = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
      const resolve = stopResolveRef.current;
      stopResolveRef.current = null;
      cleanup();
      resolve?.(blob.size ? { blob, durationSec, filename: `answer.${extensionFor(type)}` } : null);
    };

    streamRef.current = stream;
    recorderRef.current = recorder;
    startedAtRef.current = Date.now();
    recorder.start();
    setRecording(true);
    setSeconds(0);

    // MAX_RECORDING_SEC pe room ko bata do, wo send karta hai (yahan rokne se recording kho jaati)
    maxFiredRef.current = false;
    timerRef.current = window.setInterval(() => {
      const sec = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setSeconds(sec);
      if (sec >= MAX_RECORDING_SEC && !maxFiredRef.current) {
        maxFiredRef.current = true;
        onMaxRef.current?.();
      }
    }, 250);

    // Live awaaz ka level (waveform ke liye). Na chale to bhi recording chalti rahe.
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = ctx;
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
        setLevel(Math.min(1, peak / 64));
        frameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // level sirf dikhawe ke liye hai
    }
  }, [supported, cleanup]);

  // Recording rok ke file do (null = kuch record nahi hua)
  const stop = useCallback(
    () =>
      new Promise<Recording | null>((resolve) => {
        const recorder = recorderRef.current;
        if (!recorder || recorder.state === "inactive") {
          resolve(null);
          return;
        }
        stopResolveRef.current = resolve;
        recorder.stop();
      }),
    [],
  );

  // Recording phenk do (send nahi)
  const cancel = useCallback(() => {
    stopResolveRef.current = null;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    chunksRef.current = [];
    cleanup();
  }, [cleanup]);

  // Page chhodne pe mic band
  useEffect(() => () => cancel(), [cancel]);

  return { supported, recording, seconds, level, error, start, stop, cancel, clearError: () => setError(null) };
};
