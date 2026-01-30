'use client';
import { ReactNode } from 'react';
import { Nav } from './Nav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
    </div>
  );
}
