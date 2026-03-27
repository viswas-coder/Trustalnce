import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectDetail() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [projectId, setProjectId] = useState<number | null>(null);

  useEffect(() => {
    const match = window.location.pathname.match(/\/project\/(\d+)/);
    if (match) {
      setProjectId(parseInt(match[1]));
    }
  }, []);

  const projectQuery = trpc.projects.getById.useQuery(
    { id: projectId || 0 },
    { enabled: projectId !== null }
  );

  const applicationsQuery = trpc.applications.getByProject.useQuery(
    { projectId: projectId || 0 },
    { enabled: projectId !== null }
  );

  const escrowQuery = trpc.escrow.getByProject.useQuery(
    { projectId: projectId || 0 },
    { enabled: projectId !== null }
  );

  if (projectQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const project = projectQuery.data;

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-600">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isClient = user?.id === project.clientId;
  const applications = applicationsQuery.data || [];
  const escrow = escrowQuery.data;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
              <p className="text-slate-600 mt-2">
                Posted {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              project.status === "open" ? "bg-green-100 text-green-800" :
              project.status === "in_progress" ? "bg-blue-100 text-blue-800" :
              project.status === "completed" ? "bg-slate-100 text-slate-800" :
              "bg-red-100 text-red-800"
            }`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Budget</p>
                    <p className="text-2xl font-bold text-blue-600">${project.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Deadline</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {project.category && (
                  <div>
                    <p className="text-sm text-slate-600">Category</p>
                    <p className="text-slate-900">{project.category}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applications Section */}
            {isClient && (
              <Card>
                <CardHeader>
                  <CardTitle>Applications ({applications.length})</CardTitle>
                  <CardDescription>Review freelancer proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <p className="text-slate-600 text-center py-8">No applications yet</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <Card key={app.id} className="border-slate-200">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-slate-900">Freelancer ID: {app.freelancerId}</p>
                                <p className="text-sm text-slate-600 mt-1">{app.coverLetter}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                app.status === "accepted" ? "bg-green-100 text-green-800" :
                                app.status === "rejected" ? "bg-red-100 text-red-800" :
                                "bg-slate-100 text-slate-800"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            {app.proposedBudget && (
                              <p className="text-sm mb-3">Proposed: ${app.proposedBudget}</p>
                            )}
                            {app.status === "pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1">Accept</Button>
                                <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Escrow Card */}
            <Card>
              <CardHeader>
                <CardTitle>Escrow Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {escrow ? (
                  <>
                    <div>
                      <p className="text-sm text-slate-600">Amount</p>
                      <p className="text-2xl font-bold text-blue-600">${escrow.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        escrow.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        escrow.status === "held" ? "bg-blue-100 text-blue-800" :
                        escrow.status === "released" ? "bg-green-100 text-green-800" :
                        "bg-slate-100 text-slate-800"
                      }`}>
                        {escrow.status}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-600 text-center py-4">No escrow yet</p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isClient && !escrow && (
              <Button className="w-full" size="lg">
                Fund Escrow
              </Button>
            )}

            {isClient && project.status === "in_progress" && (
              <Button className="w-full" size="lg" variant="outline">
                Request Dispute
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
