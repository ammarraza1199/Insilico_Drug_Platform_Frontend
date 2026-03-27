import React, { useState } from 'react';
import { useModelStore } from '../stores/modelStore';
import type { ModelProvider } from '../stores/modelStore';
import {
  ShieldCheck,
  Cpu,
  Zap,
  Globe,
  Network,
  Settings2,
  AlertCircle,
  Copy
} from 'lucide-react';
import ApiKeyField from '../components/model/ApiKeyField';
import { cn } from '../utils/formatters';


const ModelSettingsPage: React.FC = () => {
  const {
    globalDefault,
    setGlobalDefault,
    systemOverrides,
    setSystemOverride,
    apiKeys,
    setApiKey
  } = useModelStore();

  const [activeTab, setActiveTab] = useState<'defaults' | 'overrides' | 'profiles' | 'security'>('defaults');

  const providers: { id: ModelProvider; name: string; icon: any }[] = [
    { id: 'platform_default', name: 'Platform Default', icon: ShieldCheck },
    { id: 'openai', name: 'OpenAI', icon: Zap },
    { id: 'anthropic', name: 'Claude', icon: Globe },
    { id: 'huggingface', name: 'HuggingFace', icon: Network },
    { id: 'local', name: 'Local Model', icon: Cpu },
    { id: 'custom', name: 'Custom', icon: Settings2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Model Management</h1>
        <p className="text-sm text-slate-500">Configure global model defaults, system-specific overrides, and secure API credentials.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {[
            { id: 'defaults', label: 'Global Defaults', icon: Settings2 },
            { id: 'overrides', label: 'System Overrides', icon: Cpu },
            { id: 'profiles', label: 'Saved Profiles', icon: Copy },
            { id: 'security', label: 'API Keys & Security', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-scientific-blue text-white shadow-md" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <tab.icon size={18} className="mr-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'defaults' && (
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Default Model Profile</h2>
              <div className="space-y-6 max-w-md">
                <div className="rounded-xl border bg-slate-50 p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="rounded-lg bg-scientific-blue/10 p-3 text-scientific-blue">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">Current Default</p>
                      <p className="text-lg font-black text-slate-900">{globalDefault.modelName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Provider</label>
                      <select 
                        value={globalDefault.provider}
                        onChange={(e) => setGlobalDefault({...globalDefault, provider: e.target.value as any})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      >
                        {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Temperature</label>
                        <input 
                          type="number" step="0.1"
                          value={globalDefault.temperature}
                          onChange={(e) => setGlobalDefault({...globalDefault, temperature: parseFloat(e.target.value)})}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-500">Max Tokens</label>
                        <input 
                          type="number"
                          value={globalDefault.maxTokens}
                          onChange={(e) => setGlobalDefault({...globalDefault, maxTokens: parseInt(e.target.value)})}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">This profile is used automatically for all experiments unless a system-specific override is defined.</p>
              </div>
            </div>
          )}

          {activeTab === 'overrides' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {(['p1', 'p2', 'p3'] as const).map((system) => (
                <div key={system} className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-900 uppercase">{system} Engine</h3>
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      systemOverrides[system] ? "bg-scientific-blue animate-pulse" : "bg-slate-300"
                    )} />
                  </div>
                  
                  {systemOverrides[system] ? (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-blue-50 p-3 text-xs font-medium text-scientific-blue border border-blue-100">
                        Override active: {systemOverrides[system]?.modelName}
                      </div>
                      <button 
                        onClick={() => setSystemOverride(system, null)}
                        className="w-full rounded-md border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        Reset to Global Default
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">Currently inheriting global default settings.</p>
                      <button 
                        onClick={() => setSystemOverride(system, { ...globalDefault })}
                        className="w-full rounded-md bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                      >
                        Configure Override
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <ShieldCheck className="text-scientific-blue" size={24} />
                <h2 className="text-lg font-bold text-slate-900">Secure API Credentials</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {providers.filter(p => p.id !== 'platform_default').map((provider) => (
                  <div key={provider.id} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <provider.icon size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{provider.name}</span>
                    </div>
                    <ApiKeyField 
                      label={`${provider.name} API Key`}
                      value={apiKeys[provider.id] || ''}
                      onChange={(val) => setApiKey(provider.id, val)}
                      placeholder={provider.id === 'openai' ? 'sk-...' : 'Key...'}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-12 rounded-xl bg-amber-50 p-6 border border-amber-100">
                <div className="flex items-start">
                  <AlertCircle className="text-amber-600 mt-0.5 mr-3" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Security Notice</h4>
                    <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                      API keys are never stored in browser persistent storage (localStorage) or sent to our database. 
                      They are held in the browser's memory for the duration of your session and are cleared when the tab is closed. 
                      You will need to re-enter them upon logging back in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSettingsPage;
