"use client";

// Business-profile forms call the shared API client; these names are kept for existing imports.
import { apiRequest, ApiRequestError, toFormValues } from "@/components/utils/apiClient";

export { toFormValues };
export const CompanyApiError = ApiRequestError;

export const companyApi = <T,>(path: string, init: { method?: string; body?: unknown } = {}) =>
  apiRequest<T>(path, { ...init, loginMessage: "Please log in with your account to save changes." });
