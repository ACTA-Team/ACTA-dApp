"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type Props = {
  vcId: string;
  status?: string | null;
  since?: string | null;
  sharedStatus?: { ok: boolean; reason?: string; mode?: string } | null;
  revealed?: Record<string, any> | null;
};

export function CredentialVerifyCard({
  vcId,
  status,
  since,
  sharedStatus,
  revealed,
}: Props) {
  const shorten = (s: string) =>
    s && s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-6)}` : s;

  const formatRevealed = (key: string, value: any) => {
    const raw = String(value ?? "");
    const lower = key.toLowerCase();
    let text = raw;
    let isWallet = false;
    if (lower === "issuer" || lower === "subject") {
      const wallet = raw.startsWith("did:")
        ? (raw.split(":").pop() as string)
        : raw;
      text = shorten(wallet);
      isWallet = true;
    }
    if (lower === "status") {
      text = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : raw;
    }
    return { text, raw, isWallet };
  };
  const normalized = (status || "").toLowerCase();
  const displayStatus = !status
    ? "Unknown"
    : normalized === "valid" || normalized === "verified" || normalized === "ok"
    ? "Verified"
    : normalized === "revoked"
    ? "Revoked"
    : "Not Verified";
  return (
    <div className="relative flex justify-center items-center w-full h-full pt-2 sm:pt-4 md:pt-6">
      <MagicCard
        className="relative rounded-xl sm:rounded-2xl ring-1 ring-neutral-800 w-full sm:w-[720px] max-w-[720px] aspect-[1.586/1] shadow-xl bg-black dark:bg-black text-white mx-auto"
        overlayChildren={
          <BorderBeam
            size={160}
            duration={6}
            delay={0.3}
            colorFrom="#9E7AFF"
            colorTo="#FE8BBB"
            borderWidth={2}
            className="opacity-60"
          />
        }
      >
        <div className="relative z-10 h-full w-full flex flex-col pt-4 px-4 pb-0 sm:pt-6 sm:px-6 sm:pb-0 md:pt-6 md:px-8 md:pb-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold">
              Credential
            </h2>
            <span className="text-[10px] sm:text-xs md:text-sm opacity-70">
              ACTA
            </span>
          </div>

          <div className="border-t border-neutral-800 pt-3 sm:pt-4 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs opacity-70">VC ID</span>
                <span className="text-[9px] sm:text-[11px] md:text-xs font-mono truncate max-w-[50vw] sm:max-w-[60vw] md:max-w-[420px]">
                  {vcId || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs opacity-70">
                  Verification On-chain
                </span>
                <span className="text-xs sm:text-sm font-medium">
                  {displayStatus}
                </span>
              </div>

              {displayStatus === "Revoked" && since ? (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs opacity-70">
                    Revoked since
                  </span>
                  <span className="text-[9px] sm:text-[11px] md:text-xs font-mono truncate max-w-[50vw] sm:max-w-[60vw] md:max-w-[420px]">
                    {since}
                  </span>
                </div>
              ) : null}
            </div>

            {sharedStatus || revealed ? (
              <div className="mt-4 border-t border-neutral-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs opacity-70">
                    Verification ZK Proof
                  </span>
                  {sharedStatus && (
                    <span>{sharedStatus.ok ? "Verified" : "Not verified"}</span>
                  )}
                </div>
                {sharedStatus &&
                  !sharedStatus.ok &&
                  sharedStatus.reason &&
                  sharedStatus.reason !== "snarkjs_cdn_load_failed" && (
                    <div className="text-[10px] sm:text-xs opacity-70 mb-2">
                      {sharedStatus.reason}
                    </div>
                  )}
                {revealed && (
                  <div>
                    <div className="text-[10px] sm:text-xs font-medium mb-2">
                      Revealed fields
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {Object.entries(revealed).map(([k, v]) => {
                        const { text, raw, isWallet } = formatRevealed(k, v);
                        return (
                          <div key={k} className="contents">
                            <div className="opacity-70 capitalize">{k}</div>
                            <div className="font-medium wrap-break-word">
                              <div className="flex items-center justify-end gap-2">
                                <span className="truncate">{text}</span>
                                {isWallet && (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await navigator.clipboard?.writeText(
                                          raw
                                        );
                                        toast.success("Copied to clipboard");
                                      } catch (e) {
                                        toast.error("Failed to copy");
                                      }
                                    }}
                                    className="rounded border p-1 text-[10px]"
                                    title="Copy"
                                    aria-label="Copy wallet"
                                  >
                                    <Copy size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex items-baseline justify-between sm:mt-2 md:mt-4 lg:mt-6 mb-6">
              <div className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-wide opacity-70">
                ACTA • Verifiable Credential
              </div>
              <img
                src="/dark.png"
                alt="ACTA Logo"
                className="pt-8 w-22 h-auto sm:w-22 sm:h-auto md:w-28 md:h-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
