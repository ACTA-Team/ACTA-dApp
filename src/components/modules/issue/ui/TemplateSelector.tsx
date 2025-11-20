'use client';

import type { CredentialTemplate } from '@/@types/templates';

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
    <div className="space-y-2">
      <label className="block mt-4 text-sm font-medium text-white">Select Template</label>
      <select
        value={selectedId || ''}
        onChange={(e) => {
          const tpl = templates.find((t) => t.id === e.target.value);
          if (tpl) onSelect(tpl);
        }}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
      >
        <option value="" disabled>
          Choose a template...
        </option>
        {templates.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>
            {tpl.title} - {tpl.description}
          </option>
        ))}
      </select>
    </div>
  );
}
