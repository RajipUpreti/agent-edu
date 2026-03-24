import { getApiBaseUrl } from "@/lib/api/config";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = RequestInit & {
  nextOptions?: NextFetchRequestConfig;
};

export async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const { nextOptions, headers, ...rest } = options;
  const url = `${getApiBaseUrl()}${path}`;

  const response = await fetch(url, {
    ...rest,
    next: nextOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    let details: unknown;

    try {
      details = await response.json();
    } catch {
      details = await response.text();
    }

    const message =
      typeof details === "object" &&
      details !== null &&
      "message" in details &&
      typeof (details as { message: unknown }).message === "string"
        ? (details as { message: string }).message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
