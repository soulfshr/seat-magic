'use client';
import { useState } from 'react';
import { OptimizationResult } from '@/lib/types';

export function useOptimizer() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  async function runOptimization(date: string) {
    setIsOptimizing(true);
    try {
      const resp = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      const data = await resp.json();
      setResult(data);
      return data as OptimizationResult;
    } finally {
      setIsOptimizing(false);
    }
  }

  function clearResult() {
    setResult(null);
  }

  return { result, isOptimizing, runOptimization, clearResult };
}
