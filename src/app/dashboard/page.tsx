export const metadata = {
  title: "ACTA dApp",
};

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
        ACTA dApp
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Bienvenido al dashboard. Usa el dock flotante abajo para navegar a
        "Credenciales" o "Emitir".
      </p>
    </div>
  );
}