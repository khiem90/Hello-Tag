import { NameTagData, NameTagField } from "@/types/name-tag";

const TAG_STORAGE_KEY = "name-tag-studio:design";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidField = (field: unknown): field is NameTagField => {
  if (!isObject(field)) {
    return false;
  }
  return (
    typeof field.id === "string" &&
    typeof field.name === "string" &&
    typeof field.text === "string" &&
    typeof field.fontSize === "number" &&
    typeof field.color === "string" &&
    typeof field.x === "number" &&
    typeof field.y === "number" &&
    typeof field.visible === "boolean"
  );
};

const isValidTag = (tag: unknown): tag is NameTagData => {
  if (!isObject(tag) || !Array.isArray(tag.fields)) {
    return false;
  }
  if (
    typeof tag.accent !== "string" ||
    typeof tag.background !== "string" ||
    typeof tag.customBackground !== "string" ||
    (tag.textAlign !== "left" &&
      tag.textAlign !== "center" &&
      tag.textAlign !== "right")
  ) {
    return false;
  }
  return tag.fields.every(isValidField);
};

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage;
};

export const loadStoredTag = (): NameTagData | null => {
  try {
    const storage = getStorage();
    if (!storage) {
      return null;
    }
    const raw = storage.getItem(TAG_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!isValidTag(parsed)) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to read stored tag", error);
    return null;
  }
};

export const persistTag = (tag: NameTagData) => {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.setItem(TAG_STORAGE_KEY, JSON.stringify(tag));
  } catch (error) {
    console.error("Failed to persist tag", error);
  }
};

export const clearStoredTag = () => {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.removeItem(TAG_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear stored tag", error);
  }
};


