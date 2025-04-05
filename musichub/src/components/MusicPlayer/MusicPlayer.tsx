import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Lock } from 'lucide-react';
import './MusicPlayer.css';

interface MusicPlayerProps {
  songUrl: string;
  songTitle: string;
  artistName: string;
  coverImage: string;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  songUrl, 
  songTitle, 
  artistName, 
  coverImage, 
  onClose 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullDuration, setFullDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(0); // Dynamic preview duration
  const previewPercentage = 25; // Preview is 25% of the song
  const progressRef = useRef<HTMLDivElement>(null);
  const previewTimerRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const [volume, setVolume] = useState(1.0); // Default volume to 100%
  const [prevVolume, setPrevVolume] = useState(1.0); // Store previous volume when muting
  const volumeFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-play when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Auto-play failed:", error);
        setIsPlaying(false);
      });
      audioRef.current.volume = volume; // Set initial volume
      setIsPlaying(true);
    }
    
    return () => {
      // Clear any existing timers
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [songUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Force checking the current position at a higher frequency
    const checkInterval = setInterval(() => {
      if (!isSeekingRef.current && previewDuration > 0 && audio.currentTime >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = 0;
        setCurrentTime(0);
      }
    }, 50); // Check every 50ms - more reliable than timeupdate event

    const updateTime = () => {
      const currentAudioTime = audio.currentTime;
      setCurrentTime(currentAudioTime);
      
      // Double-check preview limit enforcement
      if (!isSeekingRef.current && previewDuration > 0 && currentAudioTime >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = 0;
        setCurrentTime(0);
      }
    };

    const handleLoadedMetadata = () => {
      // Calculate preview duration as 25% of the full duration
      const fullDur = audio.duration;
      const previewDur = fullDur * (previewPercentage / 100);
      
      setFullDuration(fullDur);
      setPreviewDuration(previewDur);
      setDuration(previewDur);

      // Set a direct event handler on the audio element
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      // Set up preview timeout if needed
      if (isPlaying && previewDur > 0) {
        const timeUntilPreviewEnds = (previewDur - audio.currentTime) * 1000;
        if (timeUntilPreviewEnds > 0) {
          previewTimerRef.current = window.setTimeout(() => {
            audio.pause();
            setIsPlaying(false);
            audio.currentTime = 0;
            setCurrentTime(0);
          }, timeUntilPreviewEnds);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleSeeking = () => {
      isSeekingRef.current = true;
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      // Enforce preview limit after seeking
      if (previewDuration > 0 && audio.currentTime >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = 0;
        setCurrentTime(0);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('seeking', handleSeeking);
    audio.addEventListener('seeked', handleSeeked);
    
    const handlePlay = () => {
      // If already past preview limit, reset position
      if (previewDuration > 0 && audio.currentTime >= previewDuration) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      
      // Reset and set preview timeout
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
      
      if (previewDuration > 0) {
        const timeUntilPreviewEnds = (previewDuration - audio.currentTime) * 1000;
        if (timeUntilPreviewEnds > 0) {
          previewTimerRef.current = window.setTimeout(() => {
            audio.pause();
            setIsPlaying(false);
            audio.currentTime = 0;
            setCurrentTime(0);
          }, timeUntilPreviewEnds);
        }
      }
    };
    
    audio.addEventListener('play', handlePlay);

    return () => {
      clearInterval(checkInterval);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('seeking', handleSeeking);
      audio.removeEventListener('seeked', handleSeeked);
      
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, [previewPercentage, isPlaying, previewDuration]);

  // Update progress bar width for smooth animation
  useEffect(() => {
    if (progressRef.current && fullDuration > 0) {
      const percentage = (currentTime / fullDuration) * 100;
      progressRef.current.style.width = `${Math.min(percentage, previewPercentage)}%`;
    }
  }, [currentTime, fullDuration, previewPercentage]);

  // Update audio volume and volume fill when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
    // Update volume fill width based on current volume
    if (volumeFillRef.current) {
      volumeFillRef.current.style.width = `${volume * 100}%`;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        pauseAudio();
      } else {
        if (currentTime >= previewDuration) {
          // If we're at the preview limit, restart from beginning
          audioRef.current.currentTime = 0;
          setCurrentTime(0);
        }
        audioRef.current.play().catch(e => console.error("Play failed:", e));
        setIsPlaying(true);
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      // Clear the preview timer when manually paused
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (!isMuted) {
        // When muting, store current volume for later
        setPrevVolume(volume);
        setVolume(0);
      } else {
        // When unmuting, restore previous volume
        setVolume(prevVolume);
      }
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // If volume is set to 0, consider it as muted
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.muted = true;
      }
    } 
    // If volume is changed from 0 to something else, unmute
    else if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    isSeekingRef.current = true;
    
    // If seeking past preview limit, reset to beginning and pause
    if (newTime > previewDuration) {
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        pauseAudio();
      }
      isSeekingRef.current = false;
      return;
    }
    
    // Otherwise handle seeking normally
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      
      // Reset preview timer after seeking
      if (isPlaying && previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
        const timeUntilPreviewEnds = (previewDuration - newTime) * 1000;
        if (timeUntilPreviewEnds > 0) {
          previewTimerRef.current = window.setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
              audioRef.current.currentTime = 0;
              setCurrentTime(0);
            }
          }, timeUntilPreviewEnds);
        }
      }
    }
    
    // Reset seeking state after a short delay to ensure it completes
    setTimeout(() => {
      isSeekingRef.current = false;
    }, 50);
  };

  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="music-player-container smooth-transition">
      <div className="music-player-content">
        <div className="music-player-cover">
          <img src={coverImage} alt={`${songTitle} cover`} />
        </div>
        
        <div className="music-player-info">
          <div className="music-player-text">
            <h3>{songTitle}</h3>
            <p>{artistName}</p>
          </div>
          
          <div className="music-player-controls">
            <button 
              onClick={togglePlay} 
              className="play-btn" 
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={currentTime >= previewDuration && isPlaying}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="progress-container">
              <div className="progress-wrapper">
                <div className="progress-track">
                  {/* Preview progress bar */}
                  <div 
                    ref={progressRef} 
                    className="progress-fill"
                  ></div>
                  
                  {/* Preview limit indicator */}
                  <div 
                    className="preview-limit-indicator"
                    style={{ left: `${previewPercentage}%` }}
                  >
                    <div className="preview-limit-line"></div>
                    <div className="preview-limit-label">Preview limit</div>
                  </div>
                  
                  {/* Locked portion overlay */}
                  <div 
                    className="locked-portion"
                    style={{ 
                      left: `${previewPercentage}%`, 
                      width: `${100 - previewPercentage}%` 
                    }}
                  >
                    <Lock size={12} className="lock-icon" />
                  </div>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={fullDuration || 100} // Use a default value until loaded
                  value={currentTime}
                  onChange={handleSeek}
                  className="progress-slider"
                  aria-label="Song progress"
                  step="any"
                />
              </div>
              
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span className="full-duration">
                  <span className="preview-time">{previewDuration > 0 ? formatTime(previewDuration) : '0:00'}</span>
                  {fullDuration > 0 && (
                    <span className="locked-time"> / {formatTime(fullDuration)}</span>
                  )}
                </span>
              </div>
            </div>
            
            <div className="volume-control">
              <button 
                onClick={toggleMute} 
                className="volume-btn" 
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              
              <div className="volume-slider-container">
                <div className="volume-track"></div>
                <div ref={volumeFillRef} className="volume-fill"></div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  aria-label="Volume control"
                />
              </div>
            </div>
          </div>
        </div>
        
        <button onClick={onClose} className="close-btn" aria-label="Close player">
          <X size={24} />
        </button>
      </div>
      
      <audio ref={audioRef} src={songUrl} preload="metadata" />
    </div>
  );
};

export default MusicPlayer;
