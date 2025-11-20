"use client";

import { useEffect } from "react";
import type { CredentialTemplate } from "../hooks/useCredentialTemplates";

export default function DynamicIssueForm({
  template,
  values,
  vcId,
  issuing,
  preview,
  error,
  onSetField,
  onBuildPreview,
  onSubmit,
}: {
  template: CredentialTemplate | null;
  values: Record<string, string>;
  vcId: string;
  issuing: boolean;
  preview: any | null;
  error: string | null;
  onSetField: (key: string, value: string) => void;
  onBuildPreview: () => void;
  onSubmit: () => Promise<void>;
}) {
  useEffect(() => {
    onBuildPreview();
  }, [template, values, onBuildPreview]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Form</h3>
            <span className="text-xs text-neutral-500">W3C VC 2.0</span>
          </div>
          {!template ? (
            <div className="text-sm text-neutral-500">Select a template above.</div>
          ) : (
            <div className="space-y-3">
              {/* vcId oculto en el formulario; solo se muestra en el preview */}
              {template.fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1">{f.label}{f.required ? " *" : ""}</label>
                  <input
                    type={f.type === "date" ? "date" : "text"}
                    value={values[f.key] || ""}
                    placeholder={f.placeholder || ""}
                    onChange={(e) => onSetField(f.key, e.target.value)}
                    className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                  />
                </div>
              ))}
              <div className="pt-2">
                <button
                  onClick={onSubmit}
                  disabled={issuing || !template}
                  className="w-full md:w-auto rounded-full bg-black text-white px-6 py-2 font-medium hover:bg-neutral-800 disabled:opacity-60"
                >
                  {issuing ? "Issuing..." : "Issue Credential"}
                </button>
                {error && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Preview</h3>
            <span className="text-xs opacity-70">ACTA</span>
          </div>
          {!preview ? (
            <div className="text-sm text-neutral-500">Fill the form to see the preview.</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
                <pre className="text-xs overflow-auto">{JSON.stringify(preview, null, 2)}</pre>
              </div>
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="opacity-70">Credential ID</div>
                  <div className="font-medium font-mono truncate">{vcId}</div>
                  <div className="opacity-70">Type</div>
                  <div className="font-medium">{Array.isArray(preview?.type) ? preview.type[1] : String(preview?.type)}</div>
                  <div className="opacity-70">Issuer</div>
                  <div className="font-medium truncate">{preview?.issuer || ""}</div>
                  <div className="opacity-70">Subject</div>
                  <div className="font-medium truncate">{preview?.credentialSubject?.id || ""}</div>
                  <div className="opacity-70">Issued</div>
                  <div className="font-medium">{new Date(preview?.issuanceDate || Date.now()).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/** Transaction result **/}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          {!error && !issuing && !preview && (
            <div className="text-sm text-neutral-500">No result yet.</div>
          )}
          {issuing && <div className="text-sm">Submitting transaction...</div>}
          {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        </div>
      </div>
    </div>
  );
}