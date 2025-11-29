// Re-export all types from document.ts for backward compatibility
export {
  type DocumentType,
  type MergeField,
  type BackgroundKey,
  type BackgroundOption,
  type DocumentData,
  type MergeFieldUpdate,
  // Legacy aliases
  type NameTagField,
  type NameTagData,
  type NameTagBackgroundKey,
  type NameTagBackgroundOption,
  type NameTagFieldUpdate,
} from "./document";
