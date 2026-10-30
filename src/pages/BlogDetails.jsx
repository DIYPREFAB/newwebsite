import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import { ThreadProvider, useThread } from "../components/blogthread/ThreadContext";
import ArticleBody, { Inline } from "../components/blogthread/ArticleBody";
import { sharePost } from "../components/blogthread/PostCard";
import { FontLinks, useBlogBody } from "../components/blogthread/PageShell";
import { getPost, getPosts, KINDS, absoluteUrl } from "../components/blogthread/blogData";
import { IconArrow, IconBack, IconClock, IconQuery, IconShare } from "../components/blogthread/icons";
import { formatDate, formatDay } from "../components/blogthread/utils";
import "../components/blogthread/blogthread.css";

const ease = [0.2, 0.7, 0.2, 1];

const ArticlePage = ({ post }) => {
  useBlogBody();
  const { toast, openQuery } = useThread();
  const [active, setActive] = useState("");
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  const heads = post.blocks.filter((b) => b.t === "h2");
  const kind = KINDS[post.kind];
  const more = getPosts().filter((p) => p.id !== post.id);
  const next = more.find((p) => p.slug === post.next) || more[0];
  const others = more.filter((p) => p.id !== next?.id).slice(0, 2);

  useEffect(() => {
    const els = [...document.querySelectorAll(".bt-prose h2[id]")];
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-18% 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [post.id]);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.seoDescription,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      image: absoluteUrl(`/images/blog/og/${post.cover.split("/").pop().replace(".svg", ".png")}`),
      author: { "@type": "Organization", name: "DIYPREFAB Editorial" },
      publisher: { "@type": "Organization", name: "DIY PreFab", url: absoluteUrl("/") },
      mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    }),
    [post]
  );
  const og = absoluteUrl(`/images/blog/og/${post.cover.split("/").pop().replace(".svg", ".png")}`);

  return (
    <div className="bt-root bt-page bt-article-page">
      <FontLinks />
      <Helmet>
        <title>{`${post.seoTitle} | DIY PreFab`}</title>
        <meta name="description" content={post.seoDescription} />
        <link rel="canonical" href={absoluteUrl(`/blog/${post.slug}`)} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.seoTitle} />
        <meta property="og:description" content={post.seoDescription} />
        <meta property="og:image" content={og} />
        <meta name="twitter:image" content={og} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <NavBar />
      <motion.div className="bt-progress" style={{ scaleX: bar }} aria-hidden="true" />

      <header className="bt-art-head">
        <div className="bt-wrap bt-art-head-in">
          <motion.nav className="bt-crumb" aria-label="Breadcrumb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
            <Link to="/blog-news"><IconBack width={16} height={16} /> Blog and news</Link>
            <span className={`bt-kind bt-kind--${post.kind}`}>{kind.label}</span>
          </motion.nav>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.06, ease }}>{post.title}</motion.h1>
          <motion.p className="bt-art-dek" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.14, ease }}>{post.dek}</motion.p>
          <motion.div className="bt-art-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.24 }}>
            <div className="bt-author">
              <span className="bt-mono" aria-hidden="true">D</span>
              <div>
                <strong>DIYPREFAB Editorial</strong>
                <span className="bt-post-meta">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span className="bt-read"><IconClock /> {post.readMin} min read</span>
                </span>
              </div>
            </div>
            <div className="bt-art-meta-actions">
              <button type="button" className="bt-act" onClick={() => openQuery(post)} aria-haspopup="dialog"><IconQuery width={18} height={18} /> Query?</button>
              <button type="button" className="bt-act" onClick={() => sharePost(post, toast)}><IconShare width={18} height={18} /> Share</button>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="bt-wrap">
        <motion.figure className="bt-art-cover" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }}>
          <img src={post.cover} alt={post.coverAlt} width="1200" height="630" />
        </motion.figure>
      </div>

      <div className="bt-wrap bt-art-grid">
        <article className="bt-art">
          <ArticleBody blocks={post.blocks} />

          <section className="bt-sources" id="sources" aria-labelledby="sources-h">
            <h2 id="sources-h">Sources</h2>
            <ol>
              {post.sources.map((s) => (
                <li key={s.n} id={`source-${s.n}`}>
                  <strong>{s.title}</strong>
                  <span>{s.meta}</span>
                </li>
              ))}
            </ol>
            <p className="bt-source-note"><Inline text={post.sourceNote} /></p>
          </section>

          <aside className="bt-art-cta">
            <div>
              <strong>Need this applied to a live project?</strong>
              <span>Our team can walk through scope, interfaces and delivery with you.</span>
            </div>
            <Link to={post.cta.to} className="bt-btn bt-btn--solid">{post.cta.label} <IconArrow width={16} height={16} /></Link>
          </aside>
        </article>

        <aside className="bt-art-side" aria-label="On this page">
          <nav className="bt-toc">
            <h3>On this page</h3>
            <ol>
              {heads.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className={active === h.id ? "is-on" : ""} onClick={(e) => { e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                    {h.text}
                  </a>
                </li>
              ))}
              <li><a href="#sources" onClick={(e) => { e.preventDefault(); document.getElementById("sources")?.scrollIntoView({ behavior: "smooth" }); }}>Sources</a></li>
            </ol>
          </nav>
        </aside>
      </div>

      <section className="bt-more">
        <div className="bt-wrap">
          <h2>Continue the thread</h2>
          <div className="bt-more-grid">
            {[next, ...others].filter(Boolean).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: "-60px" }} transition={{ duration: 0.45, delay: i * 0.08, ease }}>
                <Link to={`/blog/${p.slug}`} className={`bt-more-card${i === 0 ? " is-next" : ""}`}>
                  <img src={p.cover} alt="" loading="lazy" width="1200" height="630" />
                  <span className={`bt-kind bt-kind--${p.kind}`}>{KINDS[p.kind].label}</span>
                  <strong>{p.title}</strong>
                  <span className="bt-more-meta">{formatDay(p.publishedAt)} · {p.readMin} min read</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

const NotFound = () => {
  useBlogBody();
  return (
    <div className="bt-root bt-page">
      <FontLinks />
      <NavBar />
      <div className="bt-wrap bt-404">
        <h1>We could not find that post</h1>
        <p>It may have moved, or the link may be incomplete.</p>
        <Link to="/blog-news" className="bt-btn bt-btn--solid">Back to blog and news</Link>
      </div>
      <Footer />
    </div>
  );
};

const BlogDetails = () => {
  const { slug } = useParams();
  const post = getPost(slug);
  return <ThreadProvider>{post ? <ArticlePage key={post.id} post={post} /> : <NotFound />}</ThreadProvider>;
};

export default BlogDetails;
