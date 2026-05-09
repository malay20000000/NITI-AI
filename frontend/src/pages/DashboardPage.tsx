import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle, Target, TrendingUp, Calendar, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze/results/${id}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Retrieving AI Analysis...</p>
      </div>
    );
  }

  if (!data || !data.evaluation) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Not Found</h2>
        <p className="text-slate-600 mb-6 font-medium">We couldn't retrieve the analysis results. Make sure backend and DB are active.</p>
        <Link to="/upload" className="text-blue-600 font-bold hover:underline py-2">← Back to Upload</Link>
      </div>
    );
  }

  const eval_data = data.evaluation;
  
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <Link to="/upload" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-800 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Analyze Another Resume
      </Link>
      
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Analysis Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Target Role: <span className="font-bold text-slate-800">{data.target_role}</span></p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Resume Score</h3>
            <p className="text-slate-500 font-medium">Overall fit for the role</p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * eval_data.score) / 100} className="text-blue-600 transition-all duration-1000" />
            </svg>
            <span className="absolute text-2xl font-extrabold text-slate-900">{eval_data.score}%</span>
          </div>
        </div>

        {/* ATS Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">ATS Compatibility</h3>
            <p className="text-slate-500 font-medium">Keyword & structure match</p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * eval_data.ats_compatibility) / 100} className="text-emerald-500 transition-all duration-1000" />
            </svg>
            <span className="absolute text-2xl font-extrabold text-slate-900">{eval_data.ats_compatibility}%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
          {/* Strengths & Weaknesses */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center"><Target className="w-6 h-6 mr-2 text-indigo-500" /> Profile Breakdown</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-emerald-800 mb-4 bg-emerald-100 px-3 py-1 rounded-md inline-block text-sm tracking-wide uppercase">Strengths</h4>
                <ul className="space-y-3">
                  {(eval_data.strengths || []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start text-slate-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                 <h4 className="font-bold text-rose-800 mb-4 bg-rose-100 px-3 py-1 rounded-md inline-block text-sm tracking-wide uppercase">Areas for Improvement</h4>
                <ul className="space-y-3">
                  {(eval_data.weaknesses || []).map((w: string, i: number) => (
                    <li key={i} className="flex items-start text-slate-700 font-medium">
                      <AlertCircle className="w-5 h-5 text-rose-400 mr-2 shrink-0 mt-0.5" /> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-blue-500" /> Actionable Suggestions</h3>
             <ul className="space-y-4">
                  {(eval_data.suggestions || []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-3 shrink-0 shadow-sm">{i + 1}</span>
                      <p className="text-slate-700 leading-relaxed pt-0.5">{s}</p>
                    </li>
                  ))}
                </ul>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
             <h3 className="text-xl font-extrabold text-slate-900 mb-5 relative z-10">Missing Skills</h3>
             <div className="flex flex-wrap gap-2 relative z-10">
               {(eval_data.skill_gaps || []).map((sg: string, i: number) => (
                 <span key={i} className="px-3 py-1.5 bg-amber-100/50 text-amber-900 border border-amber-200/50 rounded-lg text-sm font-bold tracking-tight">
                   {sg}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Career Roadmap */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-extrabold mb-10 flex items-center"><Calendar className="w-8 h-8 mr-3 text-blue-400" /> Your Career Roadmap</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(eval_data.roadmap || {}).map(([period, tasks]: [string, string[]], index) => (
             <div key={period} className="relative group">
                {index !== 2 && <div className="hidden md:block absolute top-8 -right-4 w-8 border-t-2 border-dashed border-slate-700"></div>}
                <div className="text-sm font-black tracking-widest text-blue-400 uppercase mb-4 pl-1">{period}</div>
                <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50 h-full hover:bg-slate-800 transition-colors">
                  <ul className="space-y-5">
                    {tasks.map((task: string, i: number) => (
                       <li key={i} className="flex items-start text-slate-300 font-medium">
                          <ChevronRight className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                          <span className="text-sm leading-relaxed">{task}</span>
                       </li>
                    ))}
                  </ul>
                </div>
             </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
