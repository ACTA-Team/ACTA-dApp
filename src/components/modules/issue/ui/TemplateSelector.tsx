"use client";

import type { CredentialTemplate } from "../hooks/useCredentialTemplates";

export default function TemplateSelector({
  templates,
  selectedId,
  onSelect,
}: {
  templates: CredentialTemplate[];
  selectedId: string | null;
  onSelect: (tpl: CredentialTemplate) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => onSelect(tpl)}
          className={`text-left rounded-xl border p-4 transition ${
            selectedId === tpl.id
              ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-900"
              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{tpl.title}</h3>
            {selectedId === tpl.id && (
              <span className="text-xs px-2 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black">Selected</span>
            )}
          </div>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {tpl.description}
          </p>
        </button>
      ))}
    </div>
  );
}