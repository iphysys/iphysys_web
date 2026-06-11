import React from "react";
import { useParams } from "react-router-dom";

const PAGES = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "iphysys collects personal information only when voluntarily provided through forms on this website, such as the contact form and newsletter signup. We use this information solely to respond to inquiries and to share updates relevant to our work.",
      "We do not sell or share personal data with third parties for marketing purposes. Aggregated, non-identifiable analytics may be used to improve the website.",
      "You may request deletion of any personal data we hold by emailing privacy@iphysys.com.",
      "Company registration and statutory disclosures will be added here as iphysys formalizes its corporate structure.",
    ],
  },
  terms: {
    title: "Terms of Use",
    body: [
      "This website is provided as-is for informational purposes. iphysys is in an early research and prototyping phase; nothing on this website should be interpreted as an offer to sell, deploy, or operate a production system.",
      "All content is the intellectual property of iphysys unless otherwise noted. Reproduction in whole or in part requires written permission.",
      "Use of this website constitutes acceptance of these terms. Terms may be revised; revisions will be reflected on this page.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    body: [
      "This site uses a minimal set of cookies required for functionality (such as keeping you signed into the admin dashboard) and for privacy-respecting analytics.",
      "Authentication cookies are HTTP-only and limited to administrative areas of the site. They are removed on logout or expiry.",
      "You may disable cookies in your browser; however, administrative areas will not function without them.",
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center" data-testid="legal-not-found">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500">404</p>
        <h1 className="font-display mt-4 text-3xl text-white">Page not found.</h1>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-6 py-24" data-testid={`legal-${slug}`}>
      <p className="text-mono-label">// Legal</p>
      <h1 className="font-display mt-6 text-4xl text-white">{page.title}</h1>
      <div className="prose-iphysys mt-10">
        {page.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="mt-12 font-mono text-xs text-slate-500">Last updated: {new Date().toISOString().slice(0, 10)}</p>
    </div>
  );
}
