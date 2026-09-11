const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = sessionStorage.getItem('psuwit_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = sessionStorage.getItem('psuwit_csrf') || getCookie('psuwit_csrf');
    if (csrf) headers.set('X-CSRF-Token', decodeURIComponent(csrf));
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    throw new ApiError(
      typeof body === 'object' ? body.message || 'ไม่สามารถดำเนินการได้' : body,
      response.status,
    );
  }
  return body as T;
}

export function downloadUrl(path: string) {
  return `${API_URL}${path}`;
}

export async function downloadFile(path: string, fileName: string) {
  const token=sessionStorage.getItem('psuwit_token');
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', headers:token?{Authorization:`Bearer ${token}`}:{}});
  if (!response.ok) throw new ApiError('ดาวน์โหลดรายงานไม่สำเร็จ', response.status);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = fileName; link.click();
  URL.revokeObjectURL(url);
}
