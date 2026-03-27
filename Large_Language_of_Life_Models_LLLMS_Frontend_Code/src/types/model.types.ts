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
  apiKeys: Record<string, string>; // provider -> key (session only)
}
