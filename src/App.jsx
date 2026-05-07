import { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, TitleBar, Toolbar } from './components/Chrome.jsx';
import { LockScreen } from './components/LockScreen.jsx';
import { ConfirmDeleteModal, PasswordModal } from './components/Modal.jsx';
import { Notebook } from './components/Notebook.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { useAudio } from './hooks/useAudio.js';
import { useLocalStorageState } from './hooks/useLocalStorageState.js';
import { backdrops, moods, STORAGE_KEYS } from './lib/constants.js';
import { blankEntry, loadEntries, saveEntries, seedEntries } from './lib/entries.js';
import { formatLong, todayKey } from './lib/date.js';

export default function App() {
  const audio = useAudio();
  const fileRef = useRef(null);
  const flipTimer = useRef(null);
  const [entries, setEntries] = useState(() => seedEntries(loadEntries()));
  const [currentDate, setCurrentDate] = useState(todayKey());
  const [title, setTitle] = useLocalStorageState(STORAGE_KEYS.title, 'MY DIARY.exe');
  const [theme, setTheme] = useLocalStorageState(STORAGE_KEYS.theme, 'light');
  const [backdropId, setBackdropId] = useLocalStorageState(STORAGE_KEYS.background, 'plaid');
  const [activePicker, setActivePicker] = useState(null);
  const [photoTarget, setPhotoTarget] = useState('R');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lockModal, setLockModal] = useState(null);
  const [lockDraft, setLockDraft] = useState({ password: '', confirmPassword: '' });
  const [lockError, setLockError] = useState('');
  const [isLocked, setIsLocked] = useState(() => sessionStorage.getItem(STORAGE_KEYS.lockedSession) === '1');
  const [unlockDraft, setUnlockDraft] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const entry = entries[currentDate] ?? blankEntry(currentDate);
  const backdrop = backdrops.find((item) => item.id === backdropId) ?? backdrops[0];
  const pageNumbers = useMemo(() => {
    const ordered = Object.keys(entries).sort();
    const index = Math.max(0, ordered.indexOf(currentDate));
    return { left: index * 2 + 1, right: index * 2 + 2, total: ordered.length * 2 };
  }, [currentDate, entries]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    document.body.dataset.bg = backdrop.id;
    document.body.dataset.theme = theme === 'dark' ? 'dark' : '';
    if (theme !== 'dark') delete document.body.dataset.theme;
  }, [backdrop.id, theme]);

  function updateCurrentEntry(patch) {
    setEntries((current) => ({
      ...current,
      [currentDate]: { ...(current[currentDate] ?? blankEntry(currentDate)), ...patch },
    }));
  }

  function updateCurrentEntryDeep(key, value) {
    setEntries((current) => {
      const next = current[currentDate] ?? blankEntry(currentDate);
      return {
        ...current,
        [currentDate]: {
          ...next,
          [key]: { ...next[key], ...value },
        },
      };
    });
  }

  function animateFlip() {
    window.clearTimeout(flipTimer.current);
    setIsFlipping(false);
    requestAnimationFrame(() => {
      setIsFlipping(true);
      audio.playPageFlip();
      flipTimer.current = window.setTimeout(() => setIsFlipping(false), 700);
    });
  }

  function selectEntry(iso) {
    if (iso === currentDate || isLocked) return;
    animateFlip();
    setCurrentDate(iso);
  }

  function createTodayEntry() {
    const iso = todayKey();
    setEntries((current) => ({ ...current, [iso]: current[iso] ?? blankEntry(iso) }));
    setCurrentDate(iso);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setEntries((current) => {
      const next = { ...current };
      delete next[deleteTarget];
      const remaining = Object.keys(next).sort((a, b) => b.localeCompare(a));
      if (remaining.length === 0) {
        const today = todayKey();
        next[today] = blankEntry(today);
        setCurrentDate(today);
      } else if (deleteTarget === currentDate) {
        setCurrentDate(remaining[0]);
      }
      return next;
    });
    setDeleteTarget(null);
  }

  function setMood(side, mood) {
    updateCurrentEntryDeep('mood', { [side]: mood });
    setActivePicker(null);
  }

  function openPhoto(side) {
    setPhotoTarget(side);
    setActivePicker(null);
    fileRef.current?.click();
  }

  function loadPhoto(side, dataUrl) {
    updateCurrentEntryDeep('photo', { [side]: dataUrl });
  }

  function moveItem(key, position) {
    updateCurrentEntryDeep('positions', { [key]: position });
  }

  function cycleBackdrop() {
    const index = backdrops.findIndex((item) => item.id === backdrop.id);
    setBackdropId(backdrops[(index + 1) % backdrops.length].id);
  }

  function openLockModal() {
    setLockDraft({ password: '', confirmPassword: '' });
    setLockError('');
    setLockModal(localStorage.getItem(STORAGE_KEYS.lock) ? 'lock' : 'set');
  }

  function submitLock() {
    if (lockModal === 'set') {
      if (lockDraft.password.length < 4) {
        setLockError('MIN 4 CHARACTERS');
        return;
      }
      if (lockDraft.password !== lockDraft.confirmPassword) {
        setLockError("PASSWORDS DON'T MATCH");
        return;
      }
      localStorage.setItem(STORAGE_KEYS.lock, btoa(lockDraft.password));
    } else if (btoa(lockDraft.password) !== localStorage.getItem(STORAGE_KEYS.lock)) {
      setLockError('WRONG PASSWORD');
      return;
    }
    sessionStorage.setItem(STORAGE_KEYS.lockedSession, '1');
    setIsLocked(true);
    setLockModal(null);
  }

  function submitUnlock() {
    if (btoa(unlockDraft) !== localStorage.getItem(STORAGE_KEYS.lock)) {
      setUnlockError('WRONG PASSWORD — TRY AGAIN');
      setUnlockDraft('');
      return;
    }
    sessionStorage.removeItem(STORAGE_KEYS.lockedSession);
    setIsLocked(false);
    setUnlockDraft('');
    setUnlockError('');
  }

  return (
    <>
      <div className="window" onClick={(event) => event.target.closest('button') && audio.playClick()}>
        <TitleBar
          title={title}
          theme={theme}
          onTitleChange={setTitle}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
        <Toolbar
          activePicker={activePicker}
          backgroundLabel={backdrop.label}
          moods={moods}
          onBackdrop={cycleBackdrop}
          onLock={openLockModal}
          onPhotoTarget={openPhoto}
          onPicker={setActivePicker}
          onSetMood={setMood}
        />
        <main className="main">
          <Sidebar
            currentDate={currentDate}
            entries={entries}
            onCreate={createTodayEntry}
            onDelete={setDeleteTarget}
            onSelect={selectEntry}
          />
          <Notebook
            entry={entry}
            isFlipping={isFlipping}
            pageNumbers={pageNumbers}
            onChange={updateCurrentEntry}
            onMove={moveItem}
          />
        </main>
        <StatusBar
          isPlaying={audio.isPlaying}
          pageText={`page ${pageNumbers.left}-${pageNumbers.right} of ${pageNumbers.total}`}
          progress={audio.progress}
          trackName={audio.trackName}
          onScrub={audio.setProgress}
          onToggleMusic={audio.toggleMusic}
        />
      </div>

      <input
        hidden
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => loadPhoto(photoTarget, reader.result);
          reader.readAsDataURL(file);
          event.target.value = '';
        }}
      />

      {deleteTarget && (
        <ConfirmDeleteModal label={formatLong(deleteTarget)} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
      )}

      {lockModal && (
        <PasswordModal
          confirmPassword={lockDraft.confirmPassword}
          error={lockError}
          mode={lockModal}
          password={lockDraft.password}
          onCancel={() => setLockModal(null)}
          onChange={(patch) => setLockDraft((current) => ({ ...current, ...patch }))}
          onConfirm={submitLock}
        />
      )}

      {isLocked && (
        <LockScreen
          error={unlockError}
          password={unlockDraft}
          title={title}
          onChange={setUnlockDraft}
          onSubmit={submitUnlock}
        />
      )}
    </>
  );
}
