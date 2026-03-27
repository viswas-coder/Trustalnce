import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-white mb-2">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Log in to your Trustlance account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-lg rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all">
              Log In
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-400">
            <p>
              Don't have an account yet?{" "}
              <Link href="/register">
                <span className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-medium">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}