import Link from 'next/link';
import { FileCheck2, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screendark">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="mb-16">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-4 bg-gradient-to-br from-white via-white to-white/80 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Manage your credentials and vault
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="relative group h-full">
              <div className="absolute -inset-0.5 bg-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative glass-card rounded-2xl p-8 lg:p-10 h-full shadow-2xl border-border/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-white/10 shadow-lg shadow-white/5">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                    Quick Start
                  </h2>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      number: '01',
                      title: 'Connect your wallet and choose a network',
                      description: 'Link your Web3 wallet to get started',
                    },
                    {
                      number: '02',
                      title: 'Create your personal vault',
                      description: 'Secure storage for your credentials',
                    },
                    {
                      number: '03',
                      title: 'Authorize wallets to issue credentials',
                      description: 'Grant permissions to trusted wallets',
                    },
                    {
                      number: '04',
                      title: 'Start issuing and managing credentials',
                      description: 'Full control over your digital identity',
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="group/item flex items-start gap-5 p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{step.number}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-base lg:text-lg font-semibold text-white mb-1 text-pretty">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-400 text-pretty">{step.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover/item:text-white transition-colors flex-shrink-0 mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative glass-card rounded-2xl p-8 shadow-2xl border-border/50 hover:border-white/30 transition-all duration-300 bg-black/40">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 shadow-lg shadow-white/5">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Issue</h3>
                  <p className="text-gray-400 text-sm text-pretty leading-relaxed">
                    Create new credentials
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full h-12 bg-white hover:bg-white/90 text-black font-semibold shadow-lg shadow-white/10 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 rounded-xl group/btn"
                >
                  <Link href="/dashboard/issue">
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative glass-card rounded-2xl p-8 shadow-2xl border-border/50 hover:border-white/30 transition-all duration-300 bg-black/40">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 shadow-lg shadow-white/5">
                    <FileCheck2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    My Credentials
                  </h3>
                  <p className="text-gray-400 text-sm text-pretty leading-relaxed">
                    View your credentials
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold transition-all duration-300 rounded-xl group/btn bg-transparent"
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
