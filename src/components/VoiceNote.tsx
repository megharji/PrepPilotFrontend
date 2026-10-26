import { useEffect, useRef, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";

const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

// Chat me jawab ki recording: play/pause, progress, duration (WhatsApp voice note jaisa)
const VoiceNote = ({ url, durationSec }: { url: string; durationSec: number }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setPosition(audio.currentTime);
    const onEnd = () => {
      setPlaying(false);
      setPosition(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const progress = Math.min(100, (position / durationSec) * 100);

  return (
    <div className="voice-note">
      <button
        type="button"
        className="voice-note__btn"
        onClick={toggle}
        aria-label={playing ? "Pause recording" : "Play recording"}
      >
        {playing ? <FiPause /> : <FiPlay />}
      </button>
      <span className="voice-note__track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </span>
      <span className="voice-note__time">{formatTime(playing || position ? position : durationSec)}</span>
      <audio ref={audioRef} src={url} preload="metadata" />
    </div>
  );
};

export default VoiceNote;
