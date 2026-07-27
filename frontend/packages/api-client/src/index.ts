export type ApiClientOptions = {
  baseUrl?: string;
  token?: string;
};

export type ApiErrorPayload = {
  message: string;
  status: number;
  details?: unknown;
};

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiClientError";
    this.status = payload.status;
    this.details = payload.details;
  }
}

const DEFAULT_BASE_URL = "http://localhost:3300/api";

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl =
    options.baseUrl ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    DEFAULT_BASE_URL;

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", headers.get("Content-Type") || "application/json");

    if (options.token) {
      headers.set("Authorization", `Bearer ${options.token}`);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      let details: unknown;

      try {
        details = await response.json();
      } catch {
        details = await response.text();
      }

      throw new ApiClientError({
        message: `API request failed: ${response.status}`,
        status: response.status,
        details,
      });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}
