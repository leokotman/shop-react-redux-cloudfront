/** Typed errors for failed HTTP responses (replaces axios error typing in react-query). */
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

function getAuthHeaders(): Record<string, string> {
  try {
    if (typeof localStorage?.getItem !== "function") {
      return {};
    }
    const token = localStorage.getItem("authorization_token");
    return token ? { Authorization: `Basic ${token}` } : {};
  } catch {
    return {};
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let body: unknown = text;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    throw new HttpError(`HTTP ${res.status}`, res.status, body);
  }
  if (!text) {
    return undefined as unknown as T;
  }
  return JSON.parse(text) as T;
}

export async function httpGet<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, method: "GET" });
  return handleResponse<T>(res);
}

export async function httpGetAuthorized<T>(url: string): Promise<T> {
  return httpGet<T>(url, { headers: getAuthHeaders() });
}

export async function httpPutJson<TBody, TRes = unknown>(
  url: string,
  body: TBody,
  withAuthorization = false
): Promise<TRes> {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(withAuthorization ? getAuthHeaders() : {}),
    },
    body: JSON.stringify(body),
  });
  return handleResponse<TRes>(res);
}

export async function httpDelete(
  url: string,
  withAuthorization = false
): Promise<void> {
  const res = await fetch(url, {
    method: "DELETE",
    headers: withAuthorization ? getAuthHeaders() : {},
  });
  await handleResponse<void>(res);
}
