import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading Security...</div>;
  if (!token) return <Navigate to="/auth" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
          <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
              <div 
                className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 cursor-pointer flex items-center gap-2" 
                onClick={() => window.location.href='/'}
              >
                NITI AI
              </div>
              <UserNav />
            </div>
          </nav>
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
              <Route path="/dashboard/:id" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const UserNav = () => {
  const { user, token, logout } = useAuth();
  if (!token || !user) return <a href="/auth" className="text-sm font-bold text-blue-600 hover:text-blue-700">Login</a>;
  
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-100" />
        {user.full_name.split(' ')[0]}
      </div>
      <button onClick={logout} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Logout</button>
    </div>
  );
};

export default App;
