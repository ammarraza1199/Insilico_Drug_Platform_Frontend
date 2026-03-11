import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ModelProvider = 'platform_default' | 'openai' | 'anthropic' | 'huggingface' | 'local' | 'custom';

export interface ModelConfiguration {
  provider: ModelProvider;
  modelName: string;
  temperature: number;
  maxTokens: number;
  endpointUrl?: string;
  apiKey?: string;
  authHeader?: string;
  systemPrompt?: string;
  contextWindowSize?: number;
}

export interface ModelProfile {
  id: string;
  name: string;
  config: ModelConfiguration;
  createdAt: string;
}

export interface ModelStoreState {
  globalDefault: ModelConfiguration;
  systemOverrides: {
    p1: ModelConfiguration | null;
    p2: ModelConfiguration | null;
    p3: ModelConfiguration | null;
  };
  savedProfiles: ModelProfile[];
  apiKeys: Record<string, string>;
}

interface ModelStore extends ModelStoreState {
  setGlobalDefault: (config: ModelConfiguration) => void;
  setSystemOverride: (system: 'p1' | 'p2' | 'p3', config: ModelConfiguration | null) => void;
  saveProfile: (profile: ModelProfile) => void;
  deleteProfile: (id: string) => void;
  setApiKey: (provider: string, key: string) => void;
  clearApiKeys: () => void;
  getEffectiveConfig: (system: 'p1' | 'p2' | 'p3') => ModelConfiguration;
}

const DEFAULT_CONFIG: ModelConfiguration = {
  provider: 'platform_default',
  modelName: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 4096,
};

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      globalDefault: DEFAULT_CONFIG,
      systemOverrides: {
        p1: null,
        p2: null,
        p3: null,
      },
      savedProfiles: [],
      apiKeys: {},

      setGlobalDefault: (globalDefault) => set({ globalDefault }),

      setSystemOverride: (system, config) => set((state) => ({
        systemOverrides: { ...state.systemOverrides, [system]: config }
      })),

      saveProfile: (profile) => set((state) => ({
        savedProfiles: [...state.savedProfiles.filter(p => p.id !== profile.id), profile]
      })),

      deleteProfile: (id) => set((state) => ({
        savedProfiles: state.savedProfiles.filter(p => p.id !== id)
      })),

      setApiKey: (provider, key) => set((state) => ({
        apiKeys: { ...state.apiKeys, [provider]: key }
      })),

      clearApiKeys: () => set({ apiKeys: {} }),

      getEffectiveConfig: (system) => {
        const state = get();
        const override = state.systemOverrides[system];
        return override || state.globalDefault;
      },
    }),
    {
      name: 'model-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
