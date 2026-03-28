export type CategoryKey =
  | 'images'
  | 'videos'
  | 'downloads'
  | 'documents'
  | 'audio'
  | 'apps';

export const DATA_CATEGORIES = [
  { key: 'images', label: 'Images (Camera, Screenshots, WhatsApp)' },
  { key: 'videos', label: 'Videos (Camera, WhatsApp)' },
  { key: 'downloads', label: 'Downloads' },
  { key: 'documents', label: 'Documents' },
  { key: 'audio', label: 'Audio / Recordings' },
  { key: 'apps', label: 'Apps (WhatsApp, Scanner, Notes, etc.)' }
];