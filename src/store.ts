import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  token: string | null;
  username: string | null;
  articles: Article[];
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUsername: (username: string | null) => void;
  setArticles: (articles: Article[]) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      articles: [],
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUsername: (username) => set({ username }),
      setArticles: (articles) => set({ articles }),
      logout: () => set({ token: null, username: null, isAuthenticated: false }),
    }),
    {
      name: 'diary-app-storage',
    }
  )
);

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = useAppStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
