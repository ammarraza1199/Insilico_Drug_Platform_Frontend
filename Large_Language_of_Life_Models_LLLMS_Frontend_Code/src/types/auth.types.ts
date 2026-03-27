export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'analyst' | 'clinician' | 'manager' | 'engineer' | 'admin';
  organization?: string;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type UserRole = UserProfile['role'];
