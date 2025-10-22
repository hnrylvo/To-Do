import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Home from './pages/home/Home.jsx';
import TaskFormPage from './pages/home/TaskFormPage.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/login/Register.jsx';
import Analytics from './components/Analytics.jsx';
import { useState } from 'react';
import { 
  FiCheck, 
  FiSun, 
  FiMoon, 
  FiLogOut, 
  FiUser,
} from 'react-icons/fi';
import { FaChartBar } from "react-icons/fa6";


function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { token, logout, user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FiCheck className="text-white text-sm" />
            </div>
            TaskFlow
          </Link>
          <nav className="flex items-center gap-4">
            {token ? (
              <>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                    <FiUser className="text-white text-sm" />
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user?.name}</span>
                </div>
                <Link 
                  to="/analytics" 
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                >
                  <FaChartBar className="text-sm" />
                  Analytics
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  title="Toggle dark mode"
                >
                  {darkMode ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}
                </button>
                <button
                  onClick={logout}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  <FiLogOut className="text-sm" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  title="Toggle dark mode"
                >
                  {darkMode ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}
                </button>
                <Link 
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`} 
                  to="/login"
                >
                  Login
                </Link>
                <Link 
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} 
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks/new" element={<PrivateRoute><TaskFormPage /></PrivateRoute>} />
          <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskFormPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
