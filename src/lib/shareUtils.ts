import { StoreSchema } from '../types';

/**
 * Encodes a store schema into a URL-safe Base64 string.
 * Supports Chinese/unicode characters seamlessly.
 */
export function encodeSchema(schema: StoreSchema): string {
  try {
    const json = JSON.stringify(schema);
    // encodeURIComponent + unescape is a standard way to get a UTF-8 binary string for btoa
    const utf8Str = unescape(encodeURIComponent(json));
    const base64 = btoa(utf8Str);
    // Make it URL safe by replacing characters: '+' -> '-', '/' -> '_', and removing padding '='
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Failed to encode schema for sharing:", e);
    return '';
  }
}

/**
 * Decodes a URL-safe Base64 string back into a SToreSchema object.
 */
export function decodeSchema(encoded: string): StoreSchema | null {
  if (!encoded) return null;
  try {
    // Restore base64 standard characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Restore padding '='
    while (base64.length % 4) {
      base64 += '=';
    }
    const utf8Str = atob(base64);
    const json = decodeURIComponent(escape(utf8Str));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && parsed.shopName) {
      return parsed as StoreSchema;
    }
    return null;
  } catch (e) {
    console.error("Failed to decode shared schema from URL parameters:", e);
    return null;
  }
}

/**
 * Generates sharing URLs for a given schema.
 */
export interface ShareLinks {
  editUrl: string;       // Opens in AI editor workshop mode
  previewUrl: string;    // Opens in full-screen pure storefront mode
}

export function generateShareLinks(schema: StoreSchema): ShareLinks {
  const encoded = encodeSchema(schema);
  if (!encoded) {
    return { editUrl: window.location.href, previewUrl: window.location.href };
  }
  
  const origin = window.location.origin + window.location.pathname;
  return {
    editUrl: `${origin}?share=${encoded}&mode=edit`,
    previewUrl: `${origin}?share=${encoded}&mode=preview`
  };
}
