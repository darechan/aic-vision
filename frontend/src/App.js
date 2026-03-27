import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Leadership from "./pages/Leadership";
import AdminDashboard from "./pages/admin/AdminDashboard";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-purple-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Layout>
                <Events />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/partner"
          element={
            <ProtectedRoute>
              <Layout>
                <Resources category="partner" />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/4.0"
          element={
            <ProtectedRoute>
              <Layout>
                <Resources category="4.0" />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/other"
          element={
            <ProtectedRoute>
              <Layout>
                <Resources category="other" />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leadership"
          element={
            <ProtectedRoute>
              <Layout>
                <Leadership />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
