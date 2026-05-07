import { useEffect, useRef, useState } from 'react';
import { useDraggable } from '../hooks/useDraggable.js';
import { formatLong } from '../lib/date.js';

const sides = ['L', 'R'];

function Photo({ pageRef, photo, position, side, onMove }) {
  const ref = useRef(null);
  useDraggable(ref, pageRef, (next) => onMove(`photo${side}`, next));
  if (!photo) return null;

  return (
    <div className="photo-element" ref={ref} style={{ left: position?.left, top: position?.top }}>
      <div className="drag-hint">DRAG TO MOVE</div>
      <div className="photo-tape" />
      <div className="photo-frame">
        <div className="photo-inner">
          <img src={photo} alt="diary" />
        </div>
        <div className="photo-caption">a moment from today</div>
      </div>
    </div>
  );
}

function MoodSticker({ mood, pageRef, position, side, onMove }) {
  const ref = useRef(null);
  useDraggable(ref, pageRef, (next) => onMove(`mood${side}`, next));
  if (!mood) return null;

  return (
    <div className="mood-sticker" ref={ref} style={{ left: position?.left, top: position?.top }}>
      <div className="drag-hint">DRAG TO MOVE</div>
      <div className="mood-pill" style={{ background: mood.bg, color: mood.color, borderColor: `${mood.color}44` }}>
        <span>{mood.emoji}</span>
        <span>{mood.text}</span>
      </div>
    </div>
  );
}

function Page({ children, className, pageRef, pageNumber, side, entry, onMove }) {
  return (
    <section className={`page ${className}`} ref={pageRef}>
      <div className="page-content">{children}</div>
      <Photo
        pageRef={pageRef}
        photo={entry.photo[side]}
        position={entry.positions[`photo${side}`]}
        side={side}
        onMove={onMove}
      />
      <MoodSticker
        pageRef={pageRef}
        mood={entry.mood[side]}
        position={entry.positions[`mood${side}`]}
        side={side}
        onMove={onMove}
      />
      <div className="page-number">{pageNumber}</div>
    </section>
  );
}

export function Notebook({ entry, isFlipping, pageNumbers, onChange, onMove }) {
  const pageRefs = { L: useRef(null), R: useRef(null) };
  const [bindingCount, setBindingCount] = useState(8);

  useEffect(() => {
    const page = pageRefs.L.current;
    if (!page) return undefined;

    const updateBindingCount = () => {
      const height = page.getBoundingClientRect().height;
      setBindingCount(Math.max(9, Math.min(22, Math.round(height / 52))));
    };

    updateBindingCount();
    const observer = new ResizeObserver(updateBindingCount);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="book-area">
      <div className="desk-objects" aria-hidden="true" />
      <div className={`book ${isFlipping ? 'flipping' : ''}`}>
        <Page className="page-left" entry={entry} onMove={onMove} pageNumber={pageNumbers.left} pageRef={pageRefs.L} side="L">
          <div className="entry-date">{formatLong(entry.date)}</div>
          <div className="entry-title">
            <input
              value={entry.title}
              placeholder="give this day a title..."
              onChange={(event) => onChange({ title: event.target.value })}
            />
          </div>
          <textarea
            className="writing"
            value={entry.leftText}
            placeholder="start writing... this page is yours."
            onChange={(event) => onChange({ leftText: event.target.value })}
          />
        </Page>

        <div className="spine">
          <div className="spine-rings">
            {Array.from({ length: bindingCount }).map((_, index) => (
              <div className="ring-wrap" key={index}>
                <div className="ring" />
              </div>
            ))}
          </div>
        </div>

        <Page className="page-right" entry={entry} onMove={onMove} pageNumber={pageNumbers.right} pageRef={pageRefs.R} side="R">
          <textarea
            className="writing"
            value={entry.rightText}
            placeholder="...continue here."
            onChange={(event) => onChange({ rightText: event.target.value })}
          />
        </Page>
      </div>
    </div>
  );
}

export function HiddenPhotoInput({ targetSide, onLoad }) {
  return (
    <input
      hidden
      type="file"
      accept="image/*"
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onLoad(targetSide, reader.result);
        reader.readAsDataURL(file);
        event.target.value = '';
      }}
    />
  );
}

export { sides };
