import { STORAGE_KEYS, moods } from './constants.js';
import { dateKey, todayKey } from './date.js';

export function blankEntry(iso) {
  return {
    date: iso,
    title: '',
    leftText: '',
    rightText: '',
    photo: { L: null, R: null },
    mood: { L: null, R: null },
    positions: {},
  };
}

export function normalizeEntry(entry, iso) {
  return {
    ...blankEntry(iso),
    ...entry,
    photo: {
      L: entry.photo?.L ?? entry.photoL ?? null,
      R: entry.photo?.R ?? entry.photoR ?? null,
    },
    mood: {
      L: entry.mood?.L ?? entry.moodL ?? null,
      R: entry.mood?.R ?? entry.moodR ?? null,
    },
    positions: {
      photoL: entry.positions?.photoL ?? entry.photoLpos ?? null,
      photoR: entry.positions?.photoR ?? entry.photoRpos ?? null,
      moodL: entry.positions?.moodL ?? entry.moodLpos ?? null,
      moodR: entry.positions?.moodR ?? entry.moodRpos ?? null,
    },
  };
}

export function loadEntries() {
  const raw = localStorage.getItem(STORAGE_KEYS.entries) ?? localStorage.getItem(STORAGE_KEYS.legacyEntries);
  const parsed = raw ? JSON.parse(raw) : {};
  return Object.fromEntries(Object.entries(parsed).map(([iso, entry]) => [iso, normalizeEntry(entry, iso)]));
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
}

export function seedEntries(entries) {
  const today = todayKey();
  const withToday = entries[today] ? entries : { ...entries, [today]: blankEntry(today) };
  const hasPastEntries = Object.keys(withToday).some((key) => key < today);
  if (hasPastEntries) {
    // If the user already has past entries, still add demo April entries if missing.
    try {
      const now = new Date();
      const year = now.getFullYear();
      const aprilDays = [5, 12, 25];
      aprilDays.forEach((d) => {
        const iso = dateKey(new Date(year, 3, d));
        if (!withToday[iso]) {
          withToday[iso] = {
            ...blankEntry(iso),
            date: iso,
            title: `April ${d} — a note`,
            leftText: `A small entry from April ${d}. Felt like spring.`,
            rightText: `Remembering the walk and the light.`,
          };
        }
      });
    } catch (e) {
      // noop
    }
    return withToday;
  }

  const seeded = [
    {
      offset: 1,
      title: 'a slow kind of tuesday',
      leftText:
        'woke up before my alarm and just lay there for a while. the light through the curtains was doing that thing where it looks like everything is underwater. made oatmeal and forgot about it until it was cold. ate it cold anyway.\n\ni have been thinking about how i never finish things. not in a dramatic way. half read books. a plant i keep meaning to repot. this sentence.',
      rightText:
        'took a different route home. there is a house on Birch Lane with a window box of marigolds that i have been meaning to notice properly for weeks. i noticed them today. they were very orange.\n\ncalled mum in the evening. she told me about a bird that has been coming to her garden every morning. a robin, she thinks. or maybe a thrush.\n\nslept okay.',
      mood: { L: moods[5], R: null },
    },
    {
      offset: 3,
      title: 'something shifted today',
      leftText:
        'it is strange how a single conversation can rearrange the furniture of a whole week. we talked for almost two hours. i did not mean to say half the things i said but they came out anyway and none of them were wrong.\n\nbought a coffee from the cart outside the library. the man who runs it remembered my order. small things like that stick to you.',
      rightText:
        'went back to the cafe where i used to write. the corner table was free. sat there for an hour with my notebook and wrote actual sentences, not just lists.\n\nthe city felt smaller today. like something had been let out of it. or maybe out of me.\n\nlistened to the same album three times on the walk home. did not get tired of it.',
      mood: { L: moods[4], R: moods[3] },
    },
    {
      offset: 5,
      title: 'rain all day',
      leftText:
        'it rained from before i woke up to after i went to sleep. one of those days that feels like it has a lid on it. stayed in, made soup, watched the window.\n\nread a lot. or tried to. my attention kept sliding off the page like water off a coat. ended up just lying on the floor for a while which is apparently what i needed.',
      rightText:
        'there is a specific quality to rain at night. the sound of it on the window is like someone trying to get your attention very gently and then giving up. i find it comforting.\n\nwrote some things down that i had been carrying around in my head. they looked smaller on paper. that was a relief.\n\ngoing to sleep early. not sad about it.',
      mood: { L: moods[1], R: moods[7] },
    },
  ].reduce((acc, seed) => {
    const date = new Date();
    date.setDate(date.getDate() - seed.offset);
    const iso = dateKey(date);
    acc[iso] = { ...blankEntry(iso), ...seed, date: iso };
    delete acc[iso].offset;
    return acc;
  }, withToday);

  // Add a few sample entries in April to demonstrate the accordion grouping.
  // Add them into the seeded result so they appear regardless of existing entries.
  try {
    const now = new Date();
    const year = now.getFullYear();
    const aprilDays = [5, 12, 25];
    aprilDays.forEach((d) => {
      const iso = dateKey(new Date(year, 3, d)); // month index 3 = April
      if (!seeded[iso]) {
        seeded[iso] = {
          ...blankEntry(iso),
          date: iso,
          title: `April ${d} — a note`,
          leftText: `A small entry from April ${d}. Felt like spring.`,
          rightText: `Remembering the walk and the light.`,
        };
      }
    });
  } catch (e) {
    // noop — seeding should not throw in normal environments
  }

  return seeded;
}
