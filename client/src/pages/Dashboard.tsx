import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import ClientDashboard from "./ClientDashboard";
import FreelancerDashboard from "./FreelancerDashboard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Route to appropriate dashboard based on user type
  const userType = (user as any)?.userType || localStorage.getItem("userRole");

  if (!userType) {
    // If no role set, redirect to register
    navigate("/register", { replace: true });
    return null;
  }

  if (userType === "client") {
    return <ClientDashboard />;
  } else if (userType === "freelancer") {
    return <FreelancerDashboard />;
  } else {
    // User hasn't selected a role yet
    navigate("/register", { replace: true });
    return null;
  }
}
