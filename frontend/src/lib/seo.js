// Per-route head / canonical / description manager.
// Updates document.title, the meta description tag, and the canonical link
// whenever the URL changes — keeping each route SEO-correct without a router refactor.

const SITE_URL = "https://iphysys.com";
const DEFAULT_TITLE = "iPhySys — Intelligence Layer for Physical Systems";
const DEFAULT_DESCRIPTION =
  "iPhySys builds the software intelligence stack for autonomous, distributed, and mission-aware physical systems. India-based deep tech AI startup.";

export const ROUTE_SEO = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/vision": {
    title: "Vision — iPhySys",
    description:
      "Why physical systems need intelligence: a layered view of perception, reasoning, coordination, and decision support for autonomous systems.",
  },
  "/insights": {
    title: "Insights — iPhySys",
    description:
      "Engineering notes on intelligent physical systems: physical AI, edge AI, multi-agent systems, distributed optimization, and trustworthy autonomy.",
  },
  "/textbook": {
    title: "AI Textbook — iPhySys",
    description:
      "A structured curriculum for intelligent physical systems — mathematics, machine learning, deep learning, computer vision, physical AI, and more.",
  },
  "/about": {
    title: "About — iPhySys",
    description:
      "iPhySys is an India-based deep tech AI startup researching and prototyping the software intelligence stack for autonomous physical systems.",
  },
  "/contact": {
    title: "Contact — iPhySys",
    description:
      "Get in touch with iPhySys for research collaboration, industry partnerships, speaking opportunities, or general inquiries.",
  },
  "/signin": {
    title: "Sign in — iPhySys",
    description: "Sign in to your iPhySys account.",
  },
  "/signup": {
    title: "Create an account — iPhySys",
    description: "Create a free iPhySys account.",
  },
  "/legal/privacy": {
    title: "Privacy Policy — iPhySys",
    description: "Privacy practices for iphysys.com.",
  },
  "/legal/terms": {
    title: "Terms of Use — iPhySys",
    description: "Terms of use for iphysys.com.",
  },
  "/legal/cookies": {
    title: "Cookie Policy — iPhySys",
    description: "Cookie practices for iphysys.com.",
  },
};

function upsertMeta(name, content, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applySeo(pathname) {
  const conf = ROUTE_SEO[pathname] || {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
  const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  document.title = conf.title;
  upsertMeta("description", conf.description);
  upsertLink("canonical", canonical);

  // Open Graph
  upsertMeta("og:title", conf.title, "property");
  upsertMeta("og:description", conf.description, "property");
  upsertMeta("og:url", canonical, "property");

  // Twitter
  upsertMeta("twitter:title", conf.title);
  upsertMeta("twitter:description", conf.description);
}
