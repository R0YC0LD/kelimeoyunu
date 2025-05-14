
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import AuthPage from '@/pages/AuthPage';
import ChatPage from '@/pages/ChatPage';
import ProfilePage from '@/pages/ProfilePage';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Yükleme ekranı veya spinner gösterilebilir
    return <div className="flex justify-center items-center h-screen bg-slate-900 text-white">Yükleniyor...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <AppRoutes />
        </AnimatePresence>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
  