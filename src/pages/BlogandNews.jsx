import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from "framer-motion";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import { ThreadProvider } from "../components/blogthread/ThreadContext";
import PostCard from "../components/blogthread/PostCard";
import { FontLinks, useBlogBody } from "../components/blogthread/PageShell";
import { getPosts, KINDS, absoluteUrl } from "../components/blogthread/blogData";
import { IconArrow, IconSearch, IconClose } from "../components/blogthread/icons";
import { formatDay } from "../components/blogthread/utils";
import "../components/blogthread/blogthread.css";

const TITLE = "Blog & News | Prefab and Steel Construction Insights | DIY PreFab";
const DESC =
  "Original guides and sourced industry briefings from DIY PreFab for consultants and PEB project teams: material evidence, roof drainage, steel market context and industrial development.";

/* Steel portal frame, drawn once on load: the page's single orchestrated moment */
const Truss = () => {
  const draw = (delay, d = 1.1) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { delay, duration: d, ease: "easeInOut" }, opacity: { delay, duration: 0.2 } },
  });
  return (
    <svg className="bt-truss" viewBox="0 0 520 280" aria-hidden="true" focusable="false">
      <motion.path d="M10 250 H510" className="s-ground" {...draw(0, 0.8)} />
      <motion.path d="M70 250 V120 L260 40 L450 120 V250" className="s-main" {...draw(0.2, 1.3)} />
      <motion.path d="M70 120 H450" className="s-main" {...draw(0.9, 0.8)} />
      <motion.path d="M165 80 V120 M260 40 V120 M355 80 V120" className="s-thin" {...draw(1.2, 0.6)} />
      <motion.path d="M70 120 L165 80 M165 120 L260 40 M260 40 L355 120 M355 80 L450 120" className="s-acc" {...draw(1.4, 0.9)} />
      <motion.path d="M70 250 L165 120 M450 250 L355 120" className="s-thin" {...draw(1.7, 0.7)} />
      <motion.path d="M40 250 V120 M40 112 V128 M40 242 V258" className="s-dim" {...draw(2, 0.5)} />
      <motion.path d="M70 270 H450 M70 262 V278 M450 262 V278" className="s-dim" {...draw(2.1, 0.5)} />
    </svg>
  );
};

const FeedPage = () => {
  useBlogBody();
  const [params, setParams] = useSearchParams();
  const kind = params.get("type") === "guide" || params.get("type") === "briefing" ? params.get("type") : "all";
  const [query, setQuery] = useState(params.get("q") || "");
  const feedRef = useRef(null);
  const all = useMemo(() => getPosts(), []);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((p) => (kind === "all" || p.kind === kind) && (!q || [p.title, p.dek, p.tags.join(" "), p.sourceLine].join(" ").toLowerCase().includes(q)));
  }, [all, kind, query]);

  const setKind = (k) => {
    const next = new URLSearchParams(params);
    if (k === "all") next.delete("type");
    else next.set("type", k);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const { scrollYProgress } = useScroll({ target: feedRef, offset: ["start 62%", "end 62%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  const counts = { all: all.length, guide: all.filter((p) => p.kind === "guide").length, briefing: all.filter((p) => p.kind === "briefing").length };
  const tabs = [["all", "All posts"], ["guide", KINDS.guide.plural], ["briefing", KINDS.briefing.plural]];

  const jump = (slug) => {
    const el = document.getElementById(`post-${slug}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("is-flash");
    setTimeout(() => el.classList.remove("is-flash"), 1400);
  };

  return (
    <div className="bt-root bt-page">
      <FontLinks />
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={absoluteUrl("/blog-news")} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={absoluteUrl("/images/blog/og/steel-material-certificates.png")} />
      </Helmet>
      <NavBar />

      <header className="bt-hero">
        <div className="bt-wrap bt-hero-in">
          <div className="bt-hero-copy">
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}>
              Blog and news
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}>
              Original guides and dated, sourced briefings for consultants and PEB project teams. Read any post, share it, or send us a query about it.
            </motion.p>
          </div>
          <Truss />
        </div>
      </header>

      <div className="bt-controls-wrap">
        <div className="bt-wrap bt-controls">
          <LayoutGroup id="bt-tabs">
            <div className="bt-tabs" role="tablist" aria-label="Filter posts">
              {tabs.map(([k, l]) => (
                <button key={k} type="button" role="tab" aria-selected={kind === k} className={kind === k ? "is-on" : ""} onClick={() => setKind(k)}>
                  {kind === k && <motion.span layoutId="bt-tab-pill" className="bt-tab-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                  <span className="bt-tab-l">{l}</span>
                  <span className="bt-tab-n">{counts[k]}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <label className="bt-search">
            <IconSearch width={18} height={18} />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts" aria-label="Search posts" />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><IconClose width={14} height={14} /></button>
            )}
          </label>
        </div>
      </div>

      <main className="bt-wrap bt-layout">
        <section className="bt-feed" ref={feedRef} aria-label="Posts">
          <span className="bt-rail" aria-hidden="true"><motion.span className="bt-rail-fill" style={{ scaleY: fill }} /></span>
          <AnimatePresence initial>
            {posts.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
          </AnimatePresence>
          {posts.length === 0 && (
            <motion.div className="bt-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <strong>No posts match{query ? ` “${query}”` : ""}.</strong>
              <span>Try a different word, or show everything.</span>
              <button type="button" className="bt-btn bt-btn--solid" onClick={() => { setQuery(""); setKind("all"); }}>Show all posts</button>
            </motion.div>
          )}
          {posts.length > 0 && <p className="bt-end">You are up to date. New posts appear at the top of the thread.</p>}
        </section>

        <aside className="bt-side" aria-label="Sidebar">
          <div className="bt-rail-card">
            <h3>In this thread</h3>
            <ol className="bt-index">
              {posts.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => jump(p.slug)}>
                    <time dateTime={p.publishedAt}>{formatDay(p.publishedAt)}</time>
                    <span>{p.title}</span>
                  </button>
                </li>
              ))}
              {posts.length === 0 && <li className="bt-index-empty">Nothing to show</li>}
            </ol>
          </div>
          <div className="bt-rail-card bt-rail-card--quiet">
            <h3>How to read this page</h3>
            <p>Guides are original working methods. Briefings summarise a dated primary source and say what it does not show. Neither replaces engineering design, testing or professional advice.</p>
          </div>
          <div className="bt-rail-card bt-cta">
            <h3>Planning a project?</h3>
            <p>Talk to our team about scope, interfaces and delivery.</p>
            <Link to="/contact-us" className="bt-btn bt-btn--solid">Contact us <IconArrow width={16} height={16} /></Link>
          </div>
        </aside>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

const BlogandNews = () => (
  <ThreadProvider>
    <FeedPage />
  </ThreadProvider>
);

export default BlogandNews;
