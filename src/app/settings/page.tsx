"use client";

import { SettingsPanel } from "@/components/modules/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">Settings</h1>
      </div>
      <SettingsPanel />
    </div>
  );
}