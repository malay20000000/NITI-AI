import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Briefcase, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import PasswordStrength from "../components/PasswordStrength";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"none" | "checking" | "available" | "taken">("none");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Real-time Email Check
  useEffect(() => {
    if (!isLogin && email.includes("@") && email.includes(".")) {
      const delayDebounce = setTimeout(async () => {
        setEmailStatus("checking");
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check-email?email=${email}`);
          const data = await response.json();
          setEmailStatus(data.available ? "available" : "taken");
        } catch (err) {
          setEmailStatus("none");
        }
      }, 500);
      return () => clearTimeout(delayDebounce);
    } else {
      setEmailStatus("none");
    }
  }, [email, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin 
      ? { email, password } 
      : { email, password, full_name: fullName, target_role: targetRole };

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Authentication failed");

      login(data.access_token, data.user, rememberMe);
      navigate("/upload");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        {/* Glass Container */}
        <div className="bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {isLogin ? "Welcome Back" : "Join NITI AI"}
              </h1>
              <p className="text-slate-400">
                {isLogin ? "Securely access your career potential." : "Create your advanced profile."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        required={!isLogin}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Target Role (e.g. Software Engineer)" 
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!isLogin && emailStatus !== "none" && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {emailStatus === "checking" ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> :
                     emailStatus === "available" ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                     <div className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded">Taken</div>}
                  </div>
                )}
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {!isLogin && password.length > 0 && (
                <PasswordStrength password={password} />
              )}

              {!isLogin && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required={!isLogin}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
                {isLogin && <a href="#" className="text-blue-500 hover:text-blue-400">Forgot?</a>}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center"
                >
                  {error}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={loading || (!isLogin && emailStatus === "taken")}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : isLogin ? "Launch Engine" : "Create Account"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-700/50 text-center">
              <span className="text-slate-500 mr-2">
                {isLogin ? "New to the platform?" : "Already have an account?"}
              </span>
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-blue-500 font-bold hover:text-blue-400"
              >
                {isLogin ? "Sign Up Now" : "Login Instead"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
