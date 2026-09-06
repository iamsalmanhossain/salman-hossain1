/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from '@/store/auth.store';

interface FetchOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  responseType?: 'json' | 'blob' | 'text';
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

// রিফ্রেশ টোকেন আসার পর লাইনে থাকা রিকোয়েস্টগুলো প্রসেস করার ফাংশন
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export interface FetchApi {
  (endpoint: string, options?: FetchOptions): Promise<any>;
  get<T = any>(url: string, config?: any): Promise<{ data: T }>;
  post<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  put<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
  delete<T = any>(url: string, config?: any): Promise<{ data: T }>;
}

export const fetchApi = (async (endpoint: string, options: FetchOptions = {}): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const { data, headers, _retry, params, responseType, skipAuthRefresh, ...restOptions } = options;

  const isClient = typeof window !== 'undefined';
  
  let token = null;
  if (isClient) {
    // শুধু মেইন Auth Store থেকে টোকেন নেওয়া হচ্ছে
    const authStore = useAuthStore.getState();
    token = authStore.accessToken;
  }

  const configHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  const hasAuthorizationHeader = Object.keys(configHeaders).some((headerName) => headerName.toLowerCase() === 'authorization');

  if (token && !hasAuthorizationHeader) {
    configHeaders.Authorization = `Bearer ${token}`;
  }

  // FormData (ফাইল আপলোড) এর জন্য Content-Type হ্যান্ডেল করা
  if (data) {
    if (data instanceof FormData) {
      // fetch অটোমেটিক multipart/form-data সেট করে নেবে
    } else {
      (configHeaders as Record<string, string>)['Content-Type'] = 'application/json';
    }
  }

  const config: RequestInit = {
    ...restOptions,
    headers: configHeaders,
  };

  if (data) {
    config.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  config.credentials = 'include';

  try {
    const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const baseOrigin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000';
    const url = new URL(`${formattedApiUrl}${formattedEndpoint}`, baseOrigin);

    // URL প্যারামিটার সেট করা (যেমন: ?page=1)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), config);

    // 401 Unauthorized এবং রিফ্রেশ টোকেন লজিক
    if (response.status === 401 && !_retry && !skipAuthRefresh) {
      const handleLogout = () => {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          // শুধুমাত্র প্রোটেক্টেড রাউট (যেমন: ড্যাশবোর্ড) থেকে লগআউট হলে লগইন পেজে পাঠাবে
          if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
            window.location.href = '/login'; // আপনার লগইন পেজের রাউট দিন
          }
        }
      };

      if (endpoint.includes('/auth/refresh-token') || endpoint.includes('/login')) {
        if (endpoint.includes('/auth/refresh-token')) {
          handleLogout();
        }
      } else {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => fetchApi(endpoint, { ...options, _retry: true }))
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        return new Promise((resolve, reject) => {
          const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`;

          fetch(refreshUrl, { method: 'POST', credentials: 'include' })
            .then(async (res) => {
              const resData = await res.json();
              if (resData?.success && resData?.data?.accessToken) {
                const newAccessToken = resData.data.accessToken;
                
                // নতুন টোকেন সেভ করা
                useAuthStore.getState().setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);
                resolve(fetchApi(endpoint, { ...options, _retry: true }));
              } else {
                handleLogout();
                reject(new Error('Refresh failed'));
              }
            })
            .catch((refreshError) => {
              processQueue(refreshError, null);
              handleLogout();
              reject(refreshError);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
    }

    // রেসপন্স যদি Error হয়
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      const errorObj = new Error(errorData.message || `API Request failed with status ${response.status}`);
      (errorObj as any).response = { data: errorData, status: response.status };
      throw errorObj;
    }

    if (responseType === 'blob') return { data: await response.blob() };
    if (responseType === 'text') return { data: await response.text() };

    const text = await response.text();
    return text ? { data: JSON.parse(text) } : { data: {} };
  } catch (error) {
    throw error;
  }
}) as FetchApi;

// Axios এর মতো ব্যবহার করার জন্য হেল্পার মেথডস
fetchApi.get = <T = any>(url: string, config?: any): Promise<{ data: T }> => fetchApi(url, { ...config, method: 'GET' });
fetchApi.post = <T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> => fetchApi(url, { ...config, method: 'POST', data });
fetchApi.put = <T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> => fetchApi(url, { ...config, method: 'PUT', data });
fetchApi.patch = <T = any>(url: string, data?: any, config?: any): Promise<{ data: T }> => fetchApi(url, { ...config, method: 'PATCH', data });
fetchApi.delete = <T = any>(url: string, config?: any): Promise<{ data: T }> => fetchApi(url, { ...config, method: 'DELETE' });