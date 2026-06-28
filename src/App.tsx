import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Home from "./pages/Home";
import AboutPages from "./pages/AboutPages";
import CouncilPage from "./pages/CouncilPage";
import GovernancePage from "./pages/GovernancePage";
import ServicesPage from "./pages/ServicesPage";
import MembershipInfoPages from "./pages/MembershipInfoPages";
import MembershipEligibilityPage from "./pages/MembershipEligibilityPage";
import MemberDirectory from "./pages/MemberDirectory";
import Register from "./pages/Register";
import PublicationsPage from "./pages/PublicationsPage";
import GalleryPage from "./pages/GalleryPage";
import AchievementsPage from "./pages/AchievementsPage";
import AwardsPage from "./pages/AwardsPage";
import NewsEventsPage from "./pages/NewsEventsPage";
import ContactPage from "./pages/ContactPage";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";

// Private Dashboard Pages
import PortalDashboard from "./pages/PortalDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Guard Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/membership/register?tab=signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper: Admin pages render full-screen without shared Header/Footer
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "" : "flex flex-col min-h-screen justify-between bg-white text-slate-800"}>
      {/* Scroll to top on every route change */}
      <ScrollToTop />

      {!isAdminRoute && <Header />}

      <main className={isAdminRoute ? "" : "flex-grow"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about/origin" element={<AboutPages />} />
          <Route path="/about/vision-mission" element={<AboutPages />} />
          <Route path="/about/objectives" element={<AboutPages />} />
          <Route path="/about/contribution" element={<AboutPages />} />
          <Route path="/governance/constitution" element={<GovernancePage />} />
          <Route path="/council" element={<CouncilPage />} />
          <Route path="/services/research" element={<ServicesPage />} />
          <Route path="/services/training" element={<ServicesPage />} />
          <Route path="/services/consultancy" element={<ServicesPage />} />
          <Route path="/membership/eligibility" element={<MembershipEligibilityPage />} />
          <Route path="/membership/types" element={<MembershipInfoPages />} />
          <Route path="/membership/benefits" element={<MembershipInfoPages />} />
          <Route path="/membership/terms" element={<MembershipInfoPages />} />
          <Route path="/membership/directory" element={<MemberDirectory />} />
          <Route path="/membership/register" element={<Register />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/news-events" element={<NewsEventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />

          {/* Private Protected Member Portal */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute allowedRoles={["Member"]}>
                <PortalDashboard />
              </ProtectedRoute>
            }
          />

          {/* Private Protected Admin Dashboard — full-screen, no Header/Footer */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Editor"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
