import { useState, useRef } from "react";
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx')) {
        setFile(droppedFile);
      } else {
        alert("Only PDF and DOCX files are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !role) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze/resume`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error("Analysis failed");
        }
        
        const data = await response.json();
        success = true;
        navigate(`/dashboard/${data.id}`);
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          console.error(error);
          alert("Analysis failed. This can happen if the backend is still waking up (common on the free tier). Please wait a few seconds and try again.");
          setLoading(false);
        } else {
          // Wait 2 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Upload Resume</h1>
        <p className="text-slate-500 mb-8 text-lg">We'll cross-reference your experience against the target role.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Target Role</label>
            <input 
              type="text" 
              placeholder="e.g. Fullstack Developer, Product Manager" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Resume File</label>
            
            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragActive ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-blue-600">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="font-semibold text-slate-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-slate-500">PDF or DOCX max 10MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl transition-all">
                <div className="flex items-center gap-4 text-slate-800 font-medium tracking-tight">
                  <div className="w-12 h-12 bg-white text-blue-600 flex items-center justify-center rounded-xl shadow-sm border border-slate-100">
                    <FileIcon className="w-6 h-6" />
                  </div>
                  {file.name}
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="p-2 bg-white hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm border border-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!file || !role || loading}
            className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                Processing AI Insights...
              </>
            ) : "Analyze Profile"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
