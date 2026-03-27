import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { CheckCircle2, Shield, Zap, Users } from "lucide-react";
import { DottedSurface } from "@/components/DottedSurface";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 relative">
      <DottedSurface className="opacity-30" />
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">Trustlance</div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button asChild className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <a>Dashboard</a>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button asChild className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <a>Login</a>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button asChild className="hover:shadow-lg hover:scale-105 transition-all duration-200">
                    <a>Get Started</a>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[400px] bg-blue-500/20 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-10">
          {/* Reverted back to the original text size! */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connect with Freelancers You Can Trust
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Trustlance provides a secure marketplace where clients and freelancers collaborate with confidence. Escrow payments protect both parties, ensuring work quality and timely payment.
          </p>
          <div className="flex justify-center gap-4">
            {!isAuthenticated && (
              <>
                <Link href="/register">
                  <Button asChild size="lg" className="hover:shadow-[0_0_20px_rgba(96,165,250,0.4)] hover:scale-105 transition-all duration-300">
                    <a>Start Now</a>
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="hover:shadow-lg hover:scale-105 transition-all duration-300 border-slate-700 text-slate-300 hover:text-white">
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Trustlance?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Escrow",
                description: "Funds held safely until work is approved and delivered",
              },
              {
                icon: CheckCircle2,
                title: "Quality Assurance",
                description: "Clients review work before releasing payment",
              },
              {
                icon: Users,
                title: "Fair Disputes",
                description: "AI-powered mediation for conflict resolution",
              },
              {
                icon: Zap,
                title: "Fast Payments",
                description: "Quick payment processing via Stripe integration",
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 border border-slate-700 rounded-lg bg-slate-800 hover:shadow-2xl hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Post Project", desc: "Clients describe their project and set budget" },
              { step: "2", title: "Receive Bids", desc: "Freelancers apply with proposals" },
              { step: "3", title: "Fund Escrow", desc: "Client deposits funds securely" },
              { step: "4", title: "Get Paid", desc: "Payment released after approval" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-lg hover:bg-slate-800 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 hover:bg-blue-400 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of clients and freelancers using Trustlance
          </p>
            {!isAuthenticated && (
            <Link href="/register">
              <Button asChild size="lg" variant="secondary" className="hover:shadow-2xl hover:scale-110 transition-all duration-300">
                <a>Sign Up Now</a>
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Trustlance</h3>
              <p className="text-sm">Secure freelance marketplace with escrow payments</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Post Projects</a></li>
                <li><a href="#" className="hover:text-white">Browse Freelancers</a></li>
                <li><a href="#" className="hover:text-white">Manage Projects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Find Projects</a></li>
                <li><a href="#" className="hover:text-white">Build Profile</a></li>
                <li><a href="#" className="hover:text-white">Get Paid</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2027 Trustlance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}