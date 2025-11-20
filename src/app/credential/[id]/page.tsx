import { CredentialVerify } from "@/components/modules/credentials/ui/CredentialVerify";

export const metadata = {
  title: "Credential",
};

export default async function CredentialVerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vcId = id || "";
  return <CredentialVerify vcId={vcId} />;
}
