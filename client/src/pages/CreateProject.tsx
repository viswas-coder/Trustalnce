import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, UploadCloud, ShieldCheck, ChevronRight, 
  ChevronLeft, CheckCircle2, AlertCircle 
} from "lucide-react";

export default function CreateProject() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<"fixed" | "milestone">("fixed");
  
  // Dummy form submission for your portfolio demo
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send data to the backend here
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="bg-orange-300 border-b-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-black hover:bg-orange-400/50 mb-4 p-0 px-3 h-8 rounded-lg">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-black">Post a New Project</h1>
          <p className="text-slate-800 mt-2">Find the perfect freelancer for your next big idea.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-400 -z-10 rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors duration-300 ${
              step >= num ? "bg-orange-400 border-black text-black" : "bg-slate-900 border-slate-800 text-slate-500"
            }`}>
              {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
          ))}
        </div>

        <form onSubmit={handlePublish}>
          {/* STEP 1: Project Basics */}
          {step === 1 && (
            <Card className="bg-white border-0 rounded-3xl shadow-2xl animate-in slide-in-from-right-8 duration-300">
              <CardContent className="p-8 sm:p-12">
                <h2 className="text-2xl font-bold text-black mb-6">1. Project Basics</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Project Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Build a responsive React e-commerce site" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all" 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Description</label>
                    <textarea 
                      rows={5}
                      placeholder="Describe your project in detail. What are the deliverables?" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Category</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all appearance-none">
                        <option value="">Select a category</option>
                        <option value="web">Web Development</option>
                        <option value="design">Graphic Design</option>
                        <option value="writing">Writing & Translation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Skills Required</label>
                      <input 
                        type="text" 
                        placeholder="e.g. React, Tailwind, Node.js (comma separated)" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Budget & Timeline */}
          {step === 2 && (
            <Card className="bg-white border-0 rounded-3xl shadow-2xl animate-in slide-in-from-right-8 duration-300">
              <CardContent className="p-8 sm:p-12">
                <h2 className="text-2xl font-bold text-black mb-6">2. Budget & Timeline</h2>
                
                <div className="space-y-8">
                  {/* Payment Type Toggle */}
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-3 block">Payment Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        onClick={() => setPaymentType("fixed")}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${paymentType === "fixed" ? "border-orange-400 bg-orange-50 text-black" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                      >
                        <p className="font-bold mb-1">Fixed Price</p>
                        <p className="text-xs">Pay a single amount</p>
                      </div>
                      <div 
                        onClick={() => setPaymentType("milestone")}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${paymentType === "milestone" ? "border-orange-400 bg-orange-50 text-black" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                      >
                        <p className="font-bold mb-1">Milestones</p>
                        <p className="text-xs">Pay in stages via escrow</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Total Budget (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Estimated Duration</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all appearance-none">
                        <option value="days">Less than 1 week</option>
                        <option value="weeks">1 - 4 weeks</option>
                        <option value="months">1 - 3 months</option>
                        <option value="ongoing">Ongoing project</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Attachments</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PNG, or JPG (max. 10MB)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Preferences & Escrow */}
          {step === 3 && (
            <Card className="bg-white border-0 rounded-3xl shadow-2xl animate-in slide-in-from-right-8 duration-300">
              <CardContent className="p-8 sm:p-12">
                <h2 className="text-2xl font-bold text-black mb-6">3. Final Details & Escrow</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Freelancer Experience Level</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all appearance-none">
                      <option value="beginner">Beginner ($)</option>
                      <option value="intermediate">Intermediate ($$)</option>
                      <option value="expert">Expert ($$$)</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 block">Additional Options</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-slate-700 font-medium">Allow revisions (Up to 2 rounds)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-slate-700 font-medium text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Mark as Urgent (Stand out to freelancers)
                      </span>
                    </label>
                  </div>

                  {/* Escrow Notice */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-white flex gap-4 items-start shadow-inner">
                    <ShieldCheck className="w-8 h-8 text-orange-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Secure Escrow Protection</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Your funds will be securely held in the Trustlance Escrow system. Payment is only released to the freelancer once you have reviewed and approved the final work.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            {step > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl px-6 py-6"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Previous
              </Button>
            ) : (
              <div></div> // Empty div to keep 'Next' button on the right
            )}

            {step < 3 ? (
              <Button 
                type="button" 
                onClick={() => setStep(step + 1)}
                className="bg-orange-400 hover:bg-orange-500 text-black font-bold rounded-xl px-8 py-6 shadow-lg hover:shadow-orange-400/20 transition-all"
              >
                Next Step <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl px-6 py-6 hidden sm:flex"
                >
                  Save Draft
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-6 shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Fund & Publish Project
                </Button>
              </div>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}