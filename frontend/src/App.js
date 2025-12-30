import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Public Pages
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import WeeklyUpdatesPage from "@/pages/WeeklyUpdatesPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import ContactPage from "@/pages/ContactPage";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminArticleEditor from "@/pages/admin/AdminArticleEditor";
import AdminSubscribers from "@/pages/admin/AdminSubscribers";
import AdminCategories from "@/pages/admin/AdminCategories";

// Layout Components
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/weekly-updates" element={<WeeklyUpdatesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/articles/new" element={<AdminArticleEditor />} />
            <Route path="/admin/articles/edit/:id" element={<AdminArticleEditor />} />
            <Route path="/admin/subscribers" element={<AdminSubscribers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

export default App;
