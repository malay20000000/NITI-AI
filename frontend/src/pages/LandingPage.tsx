import { ArrowRight, FileText, CheckCircle, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Now powered by OpenAI GPT-3.5
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Unlock your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Career Potential</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume and select your target role. Get an instant AI-powered evaluation, ATS score, and a personalized month-by-month career roadmap.
        </p>
        <Link to="/upload" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 group">
          Screen My Resume
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left"
      >
        <FeatureCard 
            icon={<FileText className="w-6 h-6 text-blue-600" />} 
            title="Smart Parsing" 
            description="We instantly extract capabilities from PDF or DOCX flawlessly using advanced Natural Language Processing." 
        />
        <FeatureCard 
            icon={<CheckCircle className="w-6 h-6 text-emerald-600" />} 
            title="ATS Compatibility" 
            description="Learn exactly what Applicant Tracking Systems think about your resume structure and keywords." 
        />
        <FeatureCard 
            icon={<Target className="w-6 h-6 text-purple-600" />} 
            title="Actionable Roadmaps" 
            description="Get a tailored 0-12 month roadmap pinpointing exactly what skills you lack and what to build." 
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="w-14 h-14 bg-slate-50 group-hover:bg-blue-50 transition-colors flex items-center justify-center rounded-2xl mb-6">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
