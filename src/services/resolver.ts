import { CategoryKey } from '../core/categories.js';

const CATEGORY_TO_PATHS: Record<CategoryKey, string[]> = {
  images: [
    '/sdcard/DCIM/Camera',
    '/sdcard/DCIM/Screenshots',
    '/sdcard/Pictures'
  ],

  videos: [
    '/sdcard/DCIM/Camera',
    '/sdcard/Movies'
  ],

  downloads: [
    '/sdcard/Download'
  ],

  documents: [
    '/sdcard/Documents'
  ],

  audio: [
    '/sdcard/Music',
    '/sdcard/Recordings'
  ],

  apps: [] // handled separately
};

export const resolvePaths = (
  categories: CategoryKey[],
  apps: string[] = [] // ✅ default makes CLI safe
): string[] => {

  const paths = new Set<string>();

  // -------------------
  // Resolve categories
  // -------------------
  for (const category of categories) {

    // safety check (prevents runtime crash if mismatch)
    if (!CATEGORY_TO_PATHS[category]) continue;

    for (const p of CATEGORY_TO_PATHS[category]) {
      paths.add(p);
    }
  }

  // -------------------
  // Resolve apps
  // -------------------
  for (const app of apps) {

    // basic validation
    if (!app || typeof app !== 'string') continue;

    paths.add(`/sdcard/Android/media/${app}`);
  }

  return Array.from(paths);
};