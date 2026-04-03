/**
 * API base URLs (no trailing slash). Set via env before production builds — see `.env.example`.
 *
 * Where to get values:
 * - AWS Console → API Gateway → your API → Stages → copy **Invoke URL** (includes stage, e.g. `/dev`).
 * - Or from the Serverless / CDK / CloudFormation output of each backend service.
 *
 * Format: `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}`
 *
 * `VITE_API_BASE` sets all services to the same URL (single API Gateway). Otherwise set each
 * `VITE_API_*` if your course uses separate stacks for cart, order, import, and BFF/product.
 */
function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

const sharedBase = (
  import.meta.env.VITE_API_BASE as string | undefined
)?.trim();

function resolve(
  key:
    | "VITE_API_BFF"
    | "VITE_API_ORDER"
    | "VITE_API_CART"
    | "VITE_API_IMPORT"
    | "VITE_API_PRODUCT",
  devFallback: string,
  fallbackEnv?: "VITE_API_BFF"
): string {
  if (sharedBase) {
    return stripTrailingSlash(sharedBase);
  }
  const raw = (import.meta.env[key] as string | undefined)?.trim();
  if (raw) {
    return stripTrailingSlash(raw);
  }
  if (fallbackEnv) {
    const fb = (import.meta.env[fallbackEnv] as string | undefined)?.trim();
    if (fb) {
      return stripTrailingSlash(fb);
    }
  }
  if (import.meta.env.DEV) {
    return stripTrailingSlash(devFallback);
  }
  if (import.meta.env.PROD) {
    // eslint-disable-next-line no-console -- intentional build-time hint
    console.error(
      `[apiPaths] Missing ${key} or VITE_API_BASE. Add a .env.production (see .env.example) before npm run build.`
    );
  }
  return "https://missing-api-env.invalid";
}

const API_PATHS = {
  bff: resolve("VITE_API_BFF", "https://dev.api.local"),
  order: resolve("VITE_API_ORDER", "https://dev.api.local"),
  cart: resolve("VITE_API_CART", "https://dev.api.local"),
  import: resolve("VITE_API_IMPORT", "https://dev.api.local"),
  product: resolve("VITE_API_PRODUCT", "https://dev.api.local", "VITE_API_BFF"),
};

export default API_PATHS;
