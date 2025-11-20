"use client";

import { useCredentialTemplates } from "../hooks/useCredentialTemplates";
import { useIssueCredential } from "../hooks/useIssueCredential";
import DynamicIssueForm from "./DynamicIssueForm";
import TemplateSelector from "./TemplateSelector";

export default function IssueBuilder() {
  const { templates } = useCredentialTemplates();
  const { state, selectTemplate, setFieldValue, buildPreview, issue } =
    useIssueCredential();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Templates</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Choose a template and the form will adapt automatically.
        </p>
      </div>
      <TemplateSelector
        templates={templates}
        selectedId={state.template?.id || null}
        onSelect={selectTemplate}
      />

      <DynamicIssueForm
        template={state.template}
        values={state.values}
        vcId={state.vcId}
        issuing={state.issuing}
        preview={state.preview}
        error={state.error}
        onSetField={setFieldValue}
        onBuildPreview={buildPreview}
        onSubmit={async () => {
          await issue();
        }}
      />
    </div>
  );
}
