export const metadata = {
  title: "ACTA dApp",
};

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Elige una acción o sigue la guía rápida para comenzar.
        </p>
      </div>

      {/* Acciones principales */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ActionCard title="Mis Credenciales" description="Consulta tus credenciales reales guardadas en tu vault" href="/dashboard/credentials" />
        <ActionCard title="Emitir" description="Crea y emite nuevas credenciales (issuer)" href="/dashboard/issue" />
        <ActionCard title="Vault" description="Crea y administra tu vault personal" href="/dashboard/vault" />
        <ActionCard title="Autorizar" description="Autoriza wallets para emitir en tu vault" href="/dashboard/authorize" />
      </div>

      {/* Guía rápida */}
      <QuickStartCard />
    </div>
  );
}

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ActionCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Card className="p-6 flex flex-col">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 flex-1">{description}</p>
      <Button asChild className="mt-4 rounded-md">
        <Link href={href}>Ir a {title}</Link>
      </Button>
    </Card>
  );
}

function QuickStartCard() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">Guía rápida</h3>
      <ol className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300 list-decimal list-inside">
        <li>Conecta tu wallet en la barra superior y elige red (Testnet/Mainnet).</li>
        <li>Ve a "Vault" y crea tu vault personal.</li>
        <li>En "Autorizar", habilita tu propia wallet o agrega otra dirección.</li>
        <li>Usa "Emitir" para crear y publicar credenciales firmadas.</li>
        <li>Consulta todo desde "Mis Credenciales".</li>
      </ol>
    </Card>
  );
}