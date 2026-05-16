import { useEffect, useRef, useState } from 'react';
import { formatToolbarDate } from '../lib/date.js';

export function TitleBar({ title, theme, onTitleChange, onThemeToggle }) {
  const [draft, setDraft] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) return;
    setDraft(title);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isEditing, title]);

  function commit() {
    const next = draft.trim() || title;
    onTitleChange(next);
    setDraft(next);
    setIsEditing(false);
  }

  function cancel() {
    setDraft(title);
    setIsEditing(false);
  }

  return (
    <header className="title-bar">
      <span className="win-btn close" />
      <span className="win-btn min" />
      <span className="win-btn max" />

      <div className="title-bar-center" hidden={isEditing}>
        <span className="title-bar-text">{title}</span>
        <button className="title-edit-btn" type="button" title="Edit diary title" onClick={() => setIsEditing(true)}>
          ✎
        </button>
      </div>

      {isEditing && (
        <input
          className="title-bar-input"
          ref={inputRef}
          maxLength={40}
          value={draft}
          onBlur={commit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
            if (event.key === 'Escape') cancel();
          }}
        />
      )}

      <button className="theme-toggle" type="button" onClick={onThemeToggle}>
        <span className="toggle-icon">{theme === 'dark' ? '🌙' : '☀'}</span>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </button>
    </header>
  );
}

export function Toolbar({
  activePicker,
  backgroundLabel,
  onBackdrop,
  onLock,
  onPhotoTarget,
  onPicker,
  onSetMood,
  moods,
}) {
  return (
    <nav className="toolbar">
      <div className="pick-wrap">
        <button className="tb-btn" type="button" onClick={() => onPicker(activePicker === 'photo' ? null : 'photo')}>
          + Photo
        </button>
        {activePicker === 'photo' && (
          <div className="picker photo-picker">
            {['L', 'R'].map((side) => (
              <button className="picker-option wide" type="button" key={side} onClick={() => onPhotoTarget(side)}>
                📄 {side === 'L' ? 'Left' : 'Right'} page
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pick-wrap">
        <button className="tb-btn" type="button" onClick={() => onPicker(activePicker === 'mood' ? null : 'mood')}>
          + Sticker
        </button>
        {activePicker === 'mood' && (
          <div className="picker mood-picker">
            {['L', 'R'].map((side) => (
              <div className="picker-section" key={side}>
                <div className="picker-label">{side === 'L' ? 'Left Page' : 'Right Page'}</div>
                {moods.map((mood) => (
                  <button
                    className="picker-option"
                    type="button"
                    key={`${side}-${mood.text}`}
                    style={{ background: mood.bg, color: mood.color }}
                    onClick={() => onSetMood(side, mood)}
                  >
                    {mood.emoji} {mood.text}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <span className="tb-sep" />
      <button className="tb-btn" type="button" onClick={onLock}>
        🔒 Lock
      </button>
      <button className="tb-btn bg-toggle" type="button" onClick={onBackdrop}>
        ▧ {backgroundLabel}
      </button>
      <span className="tb-date">{formatToolbarDate()}</span>
    </nav>
  );
}

export function StatusBar({ isPlaying, pageText, progress, trackName, onScrub, onToggleMusic }) {
  const elapsed = Math.round(progress * 180);
  const time = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <footer className="status-bar">
      <span className="status-page">{pageText}</span>
      <div className="music-player">
        <span className="music-note">♫</span>
        <button className="play-btn" type="button" onClick={onToggleMusic}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className="music-track">{trackName}</span>
        <button
          className="music-scrubber"
          type="button"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            onScrub(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)));
          }}
          aria-label="Scrub music"
        >
          <span className="scrubber-fill" style={{ width: `${progress * 100}%` }} />
        </button>
        <span className="music-time">{time}</span>
        <span className="music-vol">Vol <span className="vol-slider" /></span>
      </div>
      <span className="status-saved">● Saved</span>
    </footer>
  );
}
