"use client";

import { useState } from "react";

export default function IssueForm() {
  const [issuer, setIssuer] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("UniversityDegree");
  const [attributes, setAttributes] = useState(
    "{\n  \"degreeName\": \"Bachelor of Engineering\",\n  \"issueDate\": \"2025-01-01\"\n}"
  );
  const [expires, setExpires] = useState("");
  const [preview, setPreview] = useState<any | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let attrs: any = {};
    try {
      attrs = JSON.parse(attributes || "{}");
    } catch (err) {
      alert("Attributes JSON is not valid");
      return;
    }

    const mockCredential = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", type],
      issuer,
      issuanceDate: new Date().toISOString(),
      expirationDate: expires || undefined,
      credentialSubject: {
        id: subject,
        ...attrs,
      },
    };

    setPreview(mockCredential);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Issuer</label>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="did:example:issuer123 or an address"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="did:example:user456 or email"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Credential type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          >
            <option value="UniversityDegree">UniversityDegree</option>
            <option value="KYC">KYC</option>
            <option value="Membership">Membership</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Attributes (JSON)</label>
          <textarea
            value={attributes}
            onChange={(e) => setAttributes(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expiration date (optional)</label>
          <input
            type="date"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto rounded-full bg-black text-white px-6 py-2 font-medium hover:bg-neutral-800"
        >
          Generate credential (mock)
        </button>
      </form>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-semibold mb-3">Preview</h2>
        {!preview && (
          <div className="text-sm text-neutral-500">
            Fill the form and press “Generate”.
          </div>
        )}
        {preview && (
          <div className="space-y-4">
            <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(preview, null, 2)}
              </pre>
            </div>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Credential</span>
                <span className="text-xs opacity-70">ACTA</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="opacity-70">Issuer</div>
                <div className="font-medium truncate">{preview.issuer}</div>
                <div className="opacity-70">Subject</div>
                <div className="font-medium truncate">
                  {preview.credentialSubject?.id}
                </div>
                <div className="opacity-70">Type</div>
                <div className="font-medium">{preview.type?.[1]}</div>
                <div className="opacity-70">Issued</div>
                <div className="font-medium">
                  {new Date(preview.issuanceDate).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}