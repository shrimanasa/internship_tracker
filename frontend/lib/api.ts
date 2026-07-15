// lib/api.ts: Exposes central fetch client for all InternTrack API calls

const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
  : 'http://backend:8000/api/v1'; // Server-side fallback

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Get JWT token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Save auth session info
export function setAuthSession(token: string, role: string, fullName: string, userId: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('user_name', fullName);
  localStorage.setItem('user_id', String(userId));
}

// Clear auth session info
export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_id');
}

export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('role');
}

export function getUserName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_name') || 'User';
}

export function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem('user_id');
  return id ? Number(id) : null;
}

// Core API caller
async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Set default JSON headers if body is a plain object and not FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  // Handle URL query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return {} as T;
  }

  const textData = await response.text();
  let data;
  try {
    data = textData ? JSON.parse(textData) : {};
  } catch (e) {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    const errorMsg = data.detail || data.message || `API Error: ${response.statusText}`;
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) => 
    apiCall<T>(endpoint, { method: 'GET', params, ...options }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    apiCall<T>(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    apiCall<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    apiCall<T>(endpoint, { method: 'DELETE', ...options })
};
