import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// User Pages
import HomePage from './pages/user/HomePage';
import TopicsPage from './pages/user/TopicsPage';
import QuizPage from './pages/user/QuizPage';
import ResultPage from './pages/user/ResultPage';
import SubmissionsPage from './pages/user/SubmissionsPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import VerifyEmailPage from './pages/user/VerifyEmailPage';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage';
import AboutPage from './pages/user/AboutPage';
import ContactPage from './pages/user/ContactPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminTopicsPage from './pages/admin/AdminTopicsPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* User & Public Routes */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/topics" element={<TopicsPage />} />
                
                {/* Protected User Routes */}
                <Route
                  path="/quiz/:topicId"
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/result/:submissionId"
                  element={
                    <ProtectedRoute>
                      <ResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submissions"
                  element={
                    <ProtectedRoute>
                      <SubmissionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ForgotPasswordPage />} />

                {/* Info Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin Area */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="topics" element={<AdminTopicsPage />} />
                <Route path="questions" element={<AdminQuestionsPage />} />
                <Route path="submissions" element={<AdminSubmissionsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
