import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Plus } from "lucide-react";

// Added a quick type so TypeScript is happy with an empty array
type ClientProject = {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  createdAt: string;
  status: string;
};

export default function ClientDashboard() {
  const user = { name: "Guest Client" };
  
  // Wiped clean! Ready for the client to post their first project.
  const projects: ClientProject[] = [];

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-orange-300 border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Client Dashboard</h1>
              <p className="text-slate-800 mt-2">Welcome back, {user.name}!</p>
            </div>
            <Link href="/project/new">
              <Button className="bg-black text-white hover:bg-slate-800 rounded-lg px-6 py-6 shadow-lg hover:-translate-y-1 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Post New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Projects", value: projects.filter(p => p.status === "open" || p.status === "in_progress").length },
            { label: "Completed", value: projects.filter(p => p.status === "completed").length },
            { label: "Total Spent", value: "$0.00" },
            { label: "Pending Approvals", value: "0" },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-0 rounded-2xl">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-black">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
          
          {projects.length === 0 ? (
            <Card className="bg-white border-0 rounded-2xl">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-600 mb-4 text-lg">You haven't posted any projects yet.</p>
                <Link href="/project/new">
                  <Button className="bg-black text-white hover:bg-slate-800 rounded-lg px-6 py-6">
                    Create Your First Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <Card className="bg-white border-0 rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold text-black group-hover:text-orange-500 transition-colors">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-xs font-medium text-slate-400 mt-2">
                            Posted: {new Date(project.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
                          project.status === "open" ? "bg-green-100 text-green-800" :
                          project.status === "in_progress" ? "bg-orange-100 text-orange-800" :
                          project.status === "completed" ? "bg-slate-100 text-slate-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {project.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col justify-end">
                      <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-2xl font-bold text-black">${project.budget}</span>
                        <span className="text-xs font-medium text-slate-500">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}