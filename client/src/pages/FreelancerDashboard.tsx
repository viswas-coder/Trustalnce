import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { useState } from "react";

// Added a quick type so TypeScript is happy with an empty array
type Project = {
  id: string;
  title: string;
  category: string;
  budget: number;
  deadline: string;
  description: string;
  createdAt: string;
};

export default function FreelancerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const user = { name: "Guest Developer" };
  
  // Wiped clean! No more pre-loaded projects.
  const projects: Project[] = [];
  const applications: { status: string; projectId: string }[] = []; 

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-orange-300 border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Freelancer Dashboard</h1>
            <p className="text-slate-800 mt-2">Welcome back, {user.name}!</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Available Projects", value: projects.length },
            { label: "Applications Sent", value: applications.length },
            { label: "Accepted", value: applications.filter(a => a.status === "accepted").length },
            { label: "Pending", value: applications.filter(a => a.status === "pending").length },
          ].map((stat, idx) => (
            <Card key={idx} className="bg-white border-0 rounded-2xl">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-600 mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-black">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-black border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Available Projects</h2>
          
          {filteredProjects.length === 0 ? (
            <Card className="bg-white border-0 rounded-2xl">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-600">No projects available at the moment. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredProjects.map((project) => {
                const hasApplied = applications.some(a => a.projectId === project.id);
                return (
                  <Card key={project.id} className="bg-white border-0 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link href={`/project/${project.id}`}>
                            <h3 className="text-xl font-bold text-black hover:text-orange-500 cursor-pointer transition-colors">
                              {project.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-slate-500 mt-1">{project.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-black">${project.budget}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Due: {new Date(project.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-6 line-clamp-2 leading-relaxed">{project.description}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <span className="text-xs font-medium text-slate-400">
                          Posted {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        {hasApplied ? (
                          <span className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg">
                            Applied
                          </span>
                        ) : (
                          <Link href={`/project/${project.id}/apply`}>
                            <Button className="bg-black text-white hover:bg-slate-800 rounded-lg px-6">
                              Apply Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}