import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white" data-testid="site-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
