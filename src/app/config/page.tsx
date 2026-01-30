'use client';
import { ConfigPanel } from '@/components/config/ConfigPanel';
import { useConfig } from '@/hooks/useConfig';
import { DEFAULT_CONFIG } from '@/lib/constants';

export default function ConfigPage() {
  const { config, isLoading, updateConfig } = useConfig();

  if (isLoading) return <div className="p-6 text-gray-500">Loading settings...</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-lg font-bold text-gray-900 mb-6">Settings</h1>
      <ConfigPanel config={config ?? DEFAULT_CONFIG} onSave={updateConfig} />
    </div>
  );
}
