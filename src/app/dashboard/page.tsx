import Link from 'next/link';
import { FileCheck2, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuickStart from '@/components/modules/dashboard/ui/QuickStart';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-[#edeed1]/20 ">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-base text-white/50 mt-1">Manage your credentials and vault</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-full">
              <div className="relative glass-card rounded-2xl p-8 lg:p-10 h-full shadow-2xl border-[#edeed1]/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-[#edeed1]/10 shadow-lg shadow-[#edeed1]/10">
                    <Sparkles className="w-5 h-5 text-[#edeed1]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                    Quick Start
                  </h2>
                </div>

                <QuickStart />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <div className="relative group">
              <div className="relative glass-card rounded-2xl p-8 shadow-2xl border-[#edeed1]/20 hover:border-[#edeed1]/40 transition-all duration-300 bg-black/40">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#edeed1]/10 flex items-center justify-center mb-6 shadow-lg shadow-[#edeed1]/10">
                    <Shield className="w-7 h-7 text-[#edeed1]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Issue</h3>
                  <p className="text-gray-400 text-sm text-pretty leading-relaxed">
                    Create new credentials
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full h-12 bg-[#edeed1] hover:bg-[#edeed1]/90 text-black font-semibold shadow-lg shadow-[#edeed1]/10 hover:shadow-xl hover:shadow-[#edeed1]/20 transition-all duration-300 rounded-xl group/btn"
                >
                  <Link href="/dashboard/issue">
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="relative glass-card rounded-2xl p-8 shadow-2xl border-[#edeed1]/20 hover:border-[#edeed1]/40 transition-all duration-300 bg-black/40">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#edeed1]/10 flex items-center justify-center mb-6 shadow-lg shadow-[#edeed1]/10">
                    <FileCheck2 className="w-7 h-7 text-[#edeed1]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">My Vault</h3>
                  <p className="text-gray-400 text-sm text-pretty leading-relaxed">
                    View your vault
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 border-2 border-[#edeed1]/40 hover:border-[#edeed1] hover:bg-[#edeed1]/10 text-[#edeed1] font-semibold transition-all duration-300 rounded-xl group/btn bg-transparent"
                >
                  <Link href="/dashboard/credentials">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
