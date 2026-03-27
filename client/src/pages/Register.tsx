import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, Link } from "wouter";
import { Briefcase, User, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  
  // State to track which step of the signup process we are on
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"client" | "freelancer" | null>(null);

  const handleRoleSelect = (selectedRole: "client" | "freelancer") => {
    setRole(selectedRole);
    setStep(2); // Move to the details form
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TEMPORARY UI BYPASS: For your GitHub portfolio, this instantly routes the user.
    // In the future, this is where you will send the email/password to your backend.
    if (role === "freelancer") {
      navigate("/freelancer-dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4 py-12">
      
      {/* STEP 1: CHOOSE ROLE */}
      {step === 1 && (
        <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Trustlance</h1>
            <p className="text-xl text-slate-400">Choose your role to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Card */}
            <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                  <CardTitle className="text-2xl text-white">I'm a Client</CardTitle>
                </div>
                <CardDescription className="text-slate-400 text-base">
                  Post projects and hire top-tier freelancers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8 text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Post projects with detailed descriptions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Review and accept applications</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Secure escrow payments</li>
                </ul>
                <Button 
                  onClick={() => handleRoleSelect("client")}
                  className="w-full bg-slate-700 hover:bg-blue-600 text-white py-6 text-lg transition-colors"
                >
                  Continue as Client
                </Button>
              </CardContent>
            </Card>

            {/* Freelancer Card */}
            <Card className="bg-slate-800 border-slate-700 hover:border-green-500 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-2xl text-white">I'm a Freelancer</CardTitle>
                </div>
                <CardDescription className="text-slate-400 text-base">
                  Find great projects and build your reputation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8 text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Browse available projects</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Submit custom proposals</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Guaranteed payment via escrow</li>
                </ul>
                <Button 
                  onClick={() => handleRoleSelect("freelancer")}
                  className="w-full bg-slate-700 hover:bg-green-600 text-white py-6 text-lg transition-colors"
                >
                  Continue as Freelancer
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center text-slate-400">
            Already have an account? <Link href="/login"><span className="text-blue-400 hover:underline cursor-pointer">Log in</span></Link>
          </div>
        </div>
      )}

      {/* STEP 2: ACCOUNT DETAILS FORM */}
      {step === 2 && (
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl animate-in slide-in-from-right-8 duration-300">
          <CardHeader className="pb-4">
            <Button 
              variant="ghost" 
              className="w-fit p-0 hover:bg-transparent text-slate-400 hover:text-white mb-4"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <CardTitle className="text-3xl font-bold text-white mb-2">Create Account</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Signing up as a <span className="text-white font-semibold capitalize">{role}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSignup}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-lg rounded-lg shadow-lg mt-4 transition-all">
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
    </div>
  );
}