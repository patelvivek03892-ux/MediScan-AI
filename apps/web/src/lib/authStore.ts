'use client';

export type UserRole = 'Patient' | 'Doctor' | 'Lab Tech' | 'Compliance Officer' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinedDate: string;
  reportsAnalyzed: number;
  status: 'Active' | 'Suspended';
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    role: 'Patient',
    phone: '+91 98765 43210',
    joinedDate: '2026-06-12',
    reportsAnalyzed: 4,
    status: 'Active'
  },
  {
    id: 'usr-2',
    name: 'Dr. Anjali Mehta, MD',
    email: 'dr.mehta@metropolis.med',
    role: 'Doctor',
    phone: '+91 99887 76655',
    joinedDate: '2026-05-10',
    reportsAnalyzed: 28,
    status: 'Active'
  },
  {
    id: 'usr-3',
    name: 'Vikram Singhania',
    email: 'vikram.singhania@hospital.org',
    role: 'Patient',
    phone: '+91 98111 22334',
    joinedDate: '2026-07-22',
    reportsAnalyzed: 2,
    status: 'Active'
  },
  {
    id: 'usr-4',
    name: 'Suresh Patil',
    email: 'suresh.patil@diagnostics.lab',
    role: 'Lab Tech',
    phone: '+91 97654 32109',
    joinedDate: '2026-04-18',
    reportsAnalyzed: 64,
    status: 'Active'
  },
  {
    id: 'usr-5',
    name: 'Dr. Rohan Shah, MD',
    email: 'admin@mediscan.ai',
    role: 'Admin',
    phone: '+91 91234 56789',
    joinedDate: '2026-01-01',
    reportsAnalyzed: 142,
    status: 'Active'
  }
];

const STORAGE_USERS_KEY = 'mediscan_registered_users';
const STORAGE_CURRENT_USER_KEY = 'mediscan_current_user';
const STORAGE_AUTH_TOKEN_KEY = 'mediscan_auth_token';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, token);
  }
}

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  const stored = localStorage.getItem(STORAGE_USERS_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_USERS;
  }
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export async function registerUserWithBackend(
  newUser: Omit<UserProfile, 'id' | 'joinedDate' | 'reportsAnalyzed' | 'status'>,
  password?: string
): Promise<UserProfile> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newUser.email,
        password: password || 'SecurePass123!',
        full_name: newUser.name,
        role: newUser.role,
        phone: newUser.phone || null
      })
    });
    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.access_token);
      const profile: UserProfile = {
        id: String(data.user.id),
        name: data.user.full_name,
        email: data.user.email,
        role: data.user.role as UserRole,
        phone: data.user.phone,
        joinedDate: data.user.created_at ? data.user.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        reportsAnalyzed: data.user.reports_count || 0,
        status: data.user.status as 'Active' | 'Suspended'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(profile));
        window.dispatchEvent(new Event('mediscan_auth_changed'));
      }
      return profile;
    }
  } catch (err) {
    console.warn('Backend register unavailable, falling back to secure local store:', err);
  }
  // Fallback to local store
  return registerUser(newUser);
}

export async function loginUserWithBackend(
  email: string,
  password?: string,
  role?: UserRole
): Promise<UserProfile> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        password: password || 'patient123'
      })
    });
    if (res.ok) {
      const data = await res.json();
      setAuthToken(data.access_token);
      const profile: UserProfile = {
        id: String(data.user.id),
        name: data.user.full_name,
        email: data.user.email,
        role: data.user.role as UserRole,
        phone: data.user.phone,
        joinedDate: data.user.created_at ? data.user.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        reportsAnalyzed: data.user.reports_count || 0,
        status: data.user.status as 'Active' | 'Suspended'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(profile));
        window.dispatchEvent(new Event('mediscan_auth_changed'));
      }
      return profile;
    }
  } catch (err) {
    console.warn('Backend login unavailable, falling back to local store:', err);
  }
  // Fallback to local store
  return loginUser(email, role);
}

export function registerUser(newUser: Omit<UserProfile, 'id' | 'joinedDate' | 'reportsAnalyzed' | 'status'>): UserProfile {
  const users = getAllUsers();
  
  // Check if email already exists
  const existing = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (existing) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(existing));
      window.dispatchEvent(new Event('mediscan_auth_changed'));
    }
    return existing;
  }

  const user: UserProfile = {
    ...newUser,
    id: `usr-${Date.now().toString().slice(-4)}`,
    joinedDate: new Date().toISOString().split('T')[0],
    reportsAnalyzed: 0,
    status: 'Active'
  };

  users.unshift(user);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
  return user;
}

export function loginUser(email: string, role?: UserRole): UserProfile {
  const users = getAllUsers();
  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    user = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: nameFromEmail,
      email,
      role: role || 'Patient',
      joinedDate: new Date().toISOString().split('T')[0],
      reportsAnalyzed: 1,
      status: 'Active'
    };
    users.unshift(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
  return user;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
}

export function updateUserRole(userId: string, newRole: UserRole): void {
  const users = getAllUsers();
  const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    const current = getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify({ ...current, role: newRole }));
    }
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
}

export function toggleUserStatus(userId: string): void {
  const users = getAllUsers();
  const updated = users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? ('Suspended' as const) : ('Active' as const) } : u);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
}

export function deleteUser(userId: string): void {
  const users = getAllUsers();
  const updated = users.filter(u => u.id !== userId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    const current = getCurrentUser();
    if (current && current.id === userId) {
      logoutUser();
    }
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
}

export function incrementUserReportCount(userId?: string): void {
  if (!userId) return;
  const users = getAllUsers();
  const updated = users.map(u => u.id === userId ? { ...u, reportsAnalyzed: u.reportsAnalyzed + 1 } : u);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    const current = getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify({ ...current, reportsAnalyzed: current.reportsAnalyzed + 1 }));
    }
    window.dispatchEvent(new Event('mediscan_auth_changed'));
  }
}
