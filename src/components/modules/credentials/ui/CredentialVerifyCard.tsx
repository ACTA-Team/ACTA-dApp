"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";

type Props = {
  vcId: string;
  status?: string | null;
  since?: string | null;
};

export function CredentialVerifyCard({ vcId, status, since }: Props) {
  const normalized = (status || "").toLowerCase();
  const displayStatus = !status
    ? "Unknown"
    : normalized === "valid" || normalized === "verified" || normalized === "ok"
    ? "Verified"
    : normalized === "revoked"
    ? "Revoked"
    : "Not Verified";
  return (
    <div className="relative flex justify-center items-center w-full h-full pt-4 sm:pt-6 md:pt-10">
      <MagicCard
        className="relative rounded-xl sm:rounded-2xl ring-1 ring-neutral-800 w-full sm:w-[590px] max-w-[590px] aspect-[1.586/1] shadow-xl bg-black dark:bg-black text-white mx-auto"
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
        <div className="relative z-10 h-full w-full flex flex-col pt-4 px-4 pb-0 sm:pt-6 sm:px-6 sm:pb-0 md:pt-8 md:px-8 md:pb-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base md:text-lg font-semibold">
              Credential
            </h2>
            <span className="text-[10px] sm:text-xs md:text-sm opacity-70">
              ACTA
            </span>
          </div>

          <div className="border-t border-neutral-800 pt-3 sm:pt-4 flex-1 flex flex-col">
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs opacity-70">VC ID</span>
                <span className="text-[9px] sm:text-[11px] md:text-xs font-mono truncate max-w-[50vw] sm:max-w-[60vw] md:max-w-[420px]">
                  {vcId || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs opacity-70">
                  Verification
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

            <div className="flex items-baseline justify-between mt-38">
              <div className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-wide opacity-70">
                ACTA • Verifiable Credential
              </div>
              <img
                src="/dark.png"
                alt="ACTA Logo"
                className="pt-5 w-30 h-15 sm:w-30 sm:h-15 md:w-30 md:h-15 opacity-80"
              />
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
}
