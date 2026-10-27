import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useThread } from "./ThreadContext";
import { KINDS } from "./blogData";
import { IconArrow, IconClock, IconQuery, IconShare } from "./icons";
import { formatDay } from "./utils";

export const BLOG_MAIL = "info@diyprefab.com";
export const queryHref = (post) => `mailto:${BLOG_MAIL}?subject=${encodeURIComponent(`Query: ${post.title}`)}`;

// Gmail compose in a new tab: works on a PC even when no desktop mail app is set up for mailto:
export const gmailHref = (post) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${BLOG_MAIL}&su=${encodeURIComponent(`Query: ${post.title}`)}`;

// Phones keep the normal mailto: link (it opens their mail app); on a PC the click opens Gmail instead.
export const openQuery = (e, post) => {
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) return;
  e.preventDefault();
  const w = window.open(gmailHref(post), "_blank", "noopener,noreferrer");
  if (!w) window.location.href = queryHref(post);
};

export const sharePost = async (post, toast) => {
  const url = `${window.location.origin}/blog/${post.slug}`;
  try {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      await navigator.share({ title: post.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch {
    toast("Copy the link from the address bar");
  }
};

const PostCard = ({ post, index }) => {
  const { toast } = useThread();
  const nodeRef = useRef(null);
  const reached = useInView(nodeRef, { margin: "-45% 0px -45% 0px" });
  const passed = useInView(nodeRef, { margin: "0px 0px -45% 0px" });
  const kind = KINDS[post.kind];
  const href = `/blog/${post.slug}`;

  return (
    <motion.article
      layout="position"
      className="bt-post"
      id={`post-${post.slug}`}
      initial={{ opacity: 0, y: 44, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
      transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <span ref={nodeRef} className={`bt-node${passed ? " is-passed" : ""}${reached ? " is-current" : ""}`} aria-hidden="true" />
      <div className="bt-card">
        <header className="bt-post-head">
          <div className="bt-author">
            <span className="bt-mono" aria-hidden="true">D</span>
            <div>
              <strong>DIYPREFAB Editorial</strong>
              <span className="bt-post-meta">
                <time dateTime={post.publishedAt}>{formatDay(post.publishedAt)}</time>
                <span className="bt-read"><IconClock /> {post.readMin} min read</span>
              </span>
            </div>
          </div>
          <span className={`bt-kind bt-kind--${post.kind}`}>{kind.label}</span>
        </header>

        <Link to={href} className="bt-cover" tabIndex={-1} aria-hidden="true">
          <img src={post.cover} alt="" loading={index === 0 ? "eager" : "lazy"} width="1200" height="630" />
        </Link>
        {/* cover alt text lives with the article page; in the feed the image is decorative beside the title link */}

        <div className="bt-body">
          <h2 className="bt-title"><Link to={href}>{post.title}</Link></h2>
          <p className="bt-dek">{post.dek}</p>
          <p className="bt-source"><span>Source</span> {post.sourceLine}</p>
          <ul className="bt-tags" aria-label="Topics">
            {post.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        <footer className="bt-actions">
          <div className="bt-actions-right">
            <a href={queryHref(post)} onClick={(e) => openQuery(e, post)} className="bt-act">
              <IconQuery width={18} height={18} /> Query?
            </a>
            <button type="button" className="bt-act" onClick={() => sharePost(post, toast)}>
              <IconShare width={18} height={18} /> Share
            </button>
            <Link to={href} className="bt-act bt-act--primary">Read <IconArrow width={16} height={16} /></Link>
          </div>
        </footer>
      </div>
    </motion.article>
  );
};

export default PostCard;
