import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, Filter, Bookmark, Clock, DollarSign, 
  Star, X, ChevronRight, Zap, CheckCircle2 
} from "lucide-react";

// --- DUMMY DATA ---
const ALL_PROJECTS = [
  {
    id: "1",
    title: "Build a Modern React E-Commerce Store",
    shortDesc: "Looking for an experienced frontend developer to build a high-performance e-commerce store using React, Tailwind, and Stripe.",
    fullDesc: "We need a complete redesign of our current Shopify store. The new platform must be built headlessly using React and Tailwind CSS. You will be responsible for the cart state, product filtering, and integrating the Stripe payment gateway. Must have a strong portfolio of highly interactive UIs.",
    budget: 2500,
    type: "Milestone",
    duration: "1 - 3 months",
    experience: "Expert",
    skills: ["React", "Tailwind CSS", "Stripe", "Next.js"],
    posted: "2 hours ago",
    clientRating: 4.9,
    urgent: true,
  },
  {
    id: "2",
    title: "Design a Minimalist Logo for SaaS Startup",
    shortDesc: "Need a clean, modern, and trustworthy logo for a new B2B SaaS platform.",
    fullDesc: "We are launching a new analytics tool for marketing agencies. We need a vector logo (icon + wordmark) that looks great in both dark and light modes. We prefer cool tones (blues/purples) and a very minimalist aesthetic.",
    budget: 300,
    type: "Fixed",
    duration: "Less than 1 week",
    experience: "Intermediate",
    skills: ["Graphic Design", "Illustrator", "Figma", "Branding"],
    posted: "5 hours ago",
    clientRating: 5.0,
    urgent: false,
  },
  {
    id: "3",
    title: "Write SEO Blog Posts for Tech Niche",
    shortDesc: "Seeking a native English writer with a technical background to write 4 SEO-optimized articles per month.",
    fullDesc: "We need an ongoing content writer for our dev-tools blog. Topics will include CI/CD pipelines, Docker, and Kubernetes. You must be able to write deeply technical content that appeals to senior engineers while still satisfying Google's SEO guidelines.",
    budget: 800,
    type: "Ongoing",
    duration: "Ongoing",
    experience: "Intermediate",
    skills: ["Content Writing", "SEO", "Technical Writing", "DevOps"],
    posted: "1 day ago",
    clientRating: 4.2,
    urgent: false,
  },
  {
    id: "4",
    title: "Mobile App UI/UX Redesign",
    shortDesc: "Redesign 15 screens for an existing iOS fitness tracking application.",
    fullDesc: "Our fitness app is looking outdated. We need a modern, sleek, and highly motivating UI redesign. Deliverables must be in Figma, fully prototyped, with a complete design system for our devs to hand off.",
    budget: 1200,
    type: "Milestone",
    duration: "1 - 4 weeks",
    experience: "Expert",
    skills: ["UI/UX", "Figma", "Mobile Design", "Prototyping"],
    posted: "2 days ago",
    clientRating: 4.8,
    urgent: false,
  }
];

export default function FindProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [previewProject, setPreviewProject] = useState<typeof ALL_PROJECTS[0] | null>(null);

  // Toggle saving a project
  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop the card click from opening the preview
    setSavedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Smart Filtering Logic
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || 
                              (selectedCategory === "Development" && project.skills.includes("React")) ||
                              (selectedCategory === "Design" && project.skills.includes("Figma")) ||
                              (selectedCategory === "Writing" && project.skills.includes("SEO"));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      
      {/* Top Search Bar Section */}
      <div className="bg-orange-300 pt-8 pb-12 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-md border-b border-orange-400/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-6">Find Your Next Big Project</h1>
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by keywords, skills, or title (e.g., React, Logo Design)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white text-lg font-medium text-black placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/50 shadow-xl transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-4 text-slate-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {/* Quick Tags */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
            {["All", "Development", "Design", "Writing"].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedCategory(tag)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === tag 
                    ? "bg-black text-white shadow-lg" 
                    : "bg-white/50 text-black hover:bg-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
        {/* Left Sidebar Filters (Hidden on small screens for simplicity) */}
        <div className="hidden lg:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-400" /> Filters
            </h3>
            
            <div className="space-y-6">
              {/* Budget Filter */}
              <div>
                <label className="text-slate-400 font-medium text-sm mb-3 block">Project Type</label>
                <div className="space-y-2">
                  {["Fixed Price", "Milestone Based", "Hourly"].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-orange-500 focus:ring-orange-500" />
                      <span className="text-slate-300 group-hover:text-white transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="text-slate-400 font-medium text-sm mb-3 block">Experience Level</label>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Expert"].map(level => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-orange-500 focus:ring-orange-500" />
                      <span className="text-slate-300 group-hover:text-white transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-400 font-medium">{filteredProjects.length} projects found</p>
            <select className="bg-transparent border-none text-white font-medium focus:ring-0 cursor-pointer">
              <option className="bg-slate-900">Sort by: Newest</option>
              <option className="bg-slate-900">Sort by: Highest Budget</option>
              <option className="bg-slate-900">Sort by: Most Relevant</option>
            </select>
          </div>

          {filteredProjects.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800 rounded-3xl text-center py-20">
              <CardContent>
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                <p className="text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
                <Button onClick={() => {setSearchTerm(""); setSelectedCategory("All");}} className="mt-6 bg-slate-800 hover:bg-slate-700 text-white">
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredProjects.map(project => (
              <Card 
                key={project.id} 
                onClick={() => setPreviewProject(project)}
                className={`bg-white border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
                  previewProject?.id === project.id ? "border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.2)]" : "border-transparent"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {project.urgent && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md mb-2">
                          <Zap className="w-3 h-3" /> URGENT
                        </span>
                      )}
                      <h2 className="text-xl font-bold text-black group-hover:text-orange-500 transition-colors">
                        {project.title}
                      </h2>
                    </div>
                    <button 
                      onClick={(e) => toggleSave(e, project.id)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <Bookmark className={`w-5 h-5 ${savedProjects.includes(project.id) ? "fill-orange-400 text-orange-400" : "text-slate-400"}`} />
                    </button>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {project.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-black font-bold">
                        <DollarSign className="w-4 h-4 text-orange-400" /> ${project.budget}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {project.posted}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-black font-bold">{project.clientRating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Quick Preview Panel (Slide-in from right) */}
      {previewProject && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" 
            onClick={() => setPreviewProject(null)}
          />
          
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-slate-900 z-40 shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Panel Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-white font-bold text-lg">Project Details</h2>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => toggleSave(e, previewProject.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-white"
                >
                  <Bookmark className={`w-5 h-5 ${savedProjects.includes(previewProject.id) ? "fill-orange-400 text-orange-400" : ""}`} />
                </button>
                <button 
                  onClick={() => setPreviewProject(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Panel Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <h1 className="text-2xl font-bold text-white mb-4">{previewProject.title}</h1>
              
              <div className="flex gap-4 mb-6">
                <div className="bg-slate-800 rounded-xl p-4 flex-1">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Budget</p>
                  <p className="text-white font-bold text-xl">${previewProject.budget}</p>
                  <p className="text-slate-500 text-xs mt-1">{previewProject.type}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 flex-1">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Duration</p>
                  <p className="text-white font-bold text-xl">{previewProject.duration}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-bold mb-3 text-lg">About the Project</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {previewProject.fullDesc}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-bold mb-3 text-lg">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {previewProject.skills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 text-sm font-bold rounded-lg border border-blue-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-bold mb-3 text-lg">Project Requirements</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Level: <span className="text-white font-bold">{previewProject.experience}</span></li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> Escrow funding required</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-400" /> English speaking</li>
                </ul>
              </div>
            </div>

            {/* Panel Footer (Sticky) */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm">
              <Button className="w-full bg-orange-400 hover:bg-orange-500 text-black font-bold py-6 text-lg rounded-xl shadow-lg shadow-orange-500/20">
                Submit Proposal
              </Button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}