/// <reference types="vitest" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When set, all API bases use this URL (one API Gateway). */
  readonly VITE_API_BASE?: string;
  readonly VITE_API_BFF?: string;
  readonly VITE_API_ORDER?: string;
  readonly VITE_API_CART?: string;
  readonly VITE_API_IMPORT?: string;
  readonly VITE_API_PRODUCT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
