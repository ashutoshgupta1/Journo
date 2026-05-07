import { useState } from 'react';
import { formatToolbarDate } from '../lib/date.js';

export function TitleBar({ title, theme, onTitleChange, onThemeToggle }) {
  const [draft, setDraft] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  function commit() {
    const next = draft.trim() || title;
    onTitleChange(next);
    setDraft(next);
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
          autoFocus
          maxLength={40}
          value={draft}
          onBlur={commit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
            if (event.key === 'Escape') setIsEditing(false);
          }}
        />
      )}

      <button className="theme-toggle" type="button" onClick={onThemeToggle}>
        <span className="toggle-icon">{theme === 'dark' ? '🌙' : '☀'}</span>
        {theme === 'dark' ? 'DARK' : 'LIGHT'}
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
          + PHOTO
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
          + STICKER
        </button>
        {activePicker === 'mood' && (
          <div className="picker mood-picker">
            {['L', 'R'].map((side) => (
              <div className="picker-section" key={side}>
                <div className="picker-label">{side === 'L' ? 'LEFT PAGE' : 'RIGHT PAGE'}</div>
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
        🔒 LOCK
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
        <span className="music-vol">VOL <span className="vol-slider" /></span>
      </div>
      <span className="status-saved">● SAVED</span>
    </footer>
  );
}
