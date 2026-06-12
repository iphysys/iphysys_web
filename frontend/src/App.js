import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import VisionPage from "@/pages/VisionPage";
import InsightsPage from "@/pages/InsightsPage";
import InsightDetailPage from "@/pages/InsightDetailPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LegalPage from "@/pages/LegalPage";
import AITextbookPage from "@/pages/AITextbookPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  React.useEffect(() => {
    // Lock the document title — defends against any platform script that resets it.
    const desired = "iphysys";
    document.title = desired;
    const titleEl = document.querySelector("title");
    let titleObserver;
    if (titleEl) {
      titleObserver = new MutationObserver(() => {
        if (document.title !== desired) document.title = desired;
      });
      titleObserver.observe(titleEl, { childList: true });
    }

    // Defend against the platform "Made with Emergent" badge being re-injected.
    const hideBadge = () => {
      const badge = document.getElementById("emergent-badge");
      if (badge) badge.style.display = "none";
    };
    hideBadge();
    const bodyObserver = new MutationObserver(hideBadge);
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (titleObserver) titleObserver.disconnect();
      bodyObserver.disconnect();
    };
  }, []);

  return (
    <div className="App dark">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/vision" element={<Layout><VisionPage /></Layout>} />
            <Route path="/insights" element={<Layout><InsightsPage /></Layout>} />
            <Route path="/insights/:slug" element={<Layout><InsightDetailPage /></Layout>} />
            <Route path="/textbook" element={<Layout><AITextbookPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/legal/:slug" element={<Layout><LegalPage /></Layout>} />
            <Route path="/signin" element={<Layout><SignInPage /></Layout>} />
            <Route path="/signup" element={<Layout><SignUpPage /></Layout>} />
            <Route path="/admin/login" element={<Layout><AdminLoginPage /></Layout>} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </BrowserRouter>
        <Toaster theme="dark" position="bottom-right" />
      </AuthProvider>
    </div>
  );
}

export default App;
