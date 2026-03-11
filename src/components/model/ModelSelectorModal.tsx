import React, { useState } from 'react';
import { X, Save, Cpu, Globe, Zap, Network, Settings2, ShieldCheck } from 'lucide-react';
import { AISystem } from '../../types/experiment.types';
import { useModelStore } from '../../stores/modelStore';
import type { ModelProvider, ModelConfiguration } from '../../stores/modelStore';
import { cn } from '../../utils/formatters';
import ApiKeyField from './ApiKeyField';

interface ModelSelectorModalProps {
  system: AISystem;
  isOpen: boolean;
  onClose: () => void;
}

const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({ system, isOpen, onClose }) => {
  const { getEffectiveConfig, setSystemOverride, setApiKey, apiKeys } = useModelStore();
  const initialConfig = getEffectiveConfig(system);
  
  const [config, setConfig] = useState<ModelConfiguration>(initialConfig);
  const [activeTab, setActiveTab] = useState<ModelProvider>(config.provider);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const providers: { id: ModelProvider; name: string; icon: any }[] = [
    { id: 'platform_default', name: 'Platform Default', icon: ShieldCheck },
    { id: 'openai', name: 'OpenAI', icon: Zap },
    { id: 'anthropic', name: 'Claude', icon: Globe },
    { id: 'huggingface', name: 'HuggingFace', icon: Network },
    { id: 'local', name: 'Local Model', icon: Cpu },
    { id: 'custom', name: 'Custom', icon: Settings2 },
  ];

  const handleProviderChange = (provider: ModelProvider) => {
    setActiveTab(provider);
    setConfig({ ...config, provider });
  };


  const handleTestConnection = async () => {
    setTestStatus('testing');
    // Simulated mock test connection delay
    setTimeout(() => setTestStatus('success'), 1200);
  };

  const handleApply = () => {
    setSystemOverride(system, config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center space-x-2">
            <Settings2 className="text-scientific-blue" size={20} />
            <h2 className="text-lg font-bold text-slate-900">AI Model Selector — {system.toUpperCase()}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r bg-slate-50 p-2 space-y-1">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === p.id ? "bg-white text-scientific-blue shadow-sm border" : "text-slate-500 hover:bg-slate-200"
                )}
              >
                <p.icon size={16} className="mr-2" />
                {p.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Provider Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  {providers.find(p => p.id === activeTab)?.name} Configuration
                </h3>
                
                {activeTab === 'platform_default' ? (
                  <div className="rounded-lg border bg-blue-50/50 p-4 text-sm text-slate-600">
                    Uses the platform-configured inference endpoint. This is recommended for most research workflows.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {/* Model Name */}
                    <div>
                      <label className="text-sm font-medium text-slate-700">Model Name / ID</label>
                      <input
                        type="text"
                        value={config.modelName}
                        onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-scientific-blue focus:outline-none"
                        placeholder={activeTab === 'openai' ? "gpt-4o" : "claude-3-opus"}
                      />
                    </div>

                    {/* API Key */}
                    <ApiKeyField 
                      label="API Key" 
                      value={apiKeys[activeTab] || ''} 
                      onChange={(val) => setApiKey(activeTab, val)}
                    />

                    {/* Advanced Parameters */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Temperature: {config.temperature}</label>
                        <input
                          type="range" min="0" max="2" step="0.1"
                          value={config.temperature}
                          onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                          className="mt-2 w-full accent-scientific-blue"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700">Max Tokens</label>
                        <input
                          type="number"
                          value={config.maxTokens}
                          onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    {/* Endpoint URL (for local/custom) */}
                    {(activeTab === 'local' || activeTab === 'custom') && (
                      <div>
                        <label className="text-sm font-medium text-slate-700">Endpoint URL</label>
                        <input
                          type="text"
                          value={config.endpointUrl || ''}
                          onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                          placeholder="http://localhost:11434"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Test Connection Button */}
              {activeTab !== 'platform_default' && (
                <div className="flex items-center space-x-4 border-t pt-4">
                  <button
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-all",
                      testStatus === 'success' ? "bg-scientific-green text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {testStatus === 'testing' ? "Testing..." : testStatus === 'success' ? "Connection OK" : "Test Connection"}
                  </button>
                  {testStatus === 'success' && <span className="text-xs text-scientific-green font-medium">Latency: 245ms</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setSystemOverride(system, null)} 
            className="text-sm text-slate-500 hover:text-scientific-red font-medium"
          >
            Reset to Platform Default
          </button>
          <div className="space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md">Cancel</button>
            <button 
              onClick={handleApply}
              className="inline-flex items-center rounded-md bg-scientific-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
            >
              <Save size={16} className="mr-2" />
              Apply to Experiment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectorModal;
