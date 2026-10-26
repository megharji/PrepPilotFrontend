import { useCallback, useEffect, useRef, useState } from "react";

// Web Speech API ke types TS DOM lib me nahi hain, isliye sirf jitna chahiye utna
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getRecognitionCtor = (): SpeechRecognitionCtor | undefined => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

// Mic se bolke answer dena (Chrome/Edge me chalta hai)
export const useSpeechInput = (onText: (text: string) => void) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onTextRef = useRef(onText);
  const supported = typeof window !== "undefined" && !!getRecognitionCtor();

  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recognitionRef.current) return;

    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) onTextRef.current(result[0].transcript.trim());
      }
    };
    rec.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    rec.onerror = () => rec.stop();

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { supported, listening, start, stop };
};

// Interviewer ka sawaal bol ke sunana
// onEnd: line poori bol li (ya bol hi nahi paye) tab. Interview ki aakhri line ke baad hi aage badhte hain.
export const speak = (text: string, onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
