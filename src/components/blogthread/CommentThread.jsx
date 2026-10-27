import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useThread } from "./ThreadContext";
import Avatar from "./Avatar";
import { IconChevron, IconReply, IconTrash, IconUseful } from "./icons";
import { timeAgo } from "./utils";

const MAX_LEN = 1000;
const MAX_DEPTH = 3; // 0,1,2 nest; deeper replies attach to the same level with an @mention

/* ------------------------------------------------------------------ composer */
const Composer = ({ postId, parentId = null, prefill = "", autoFocus = false, onDone, placeholder, submitLabel = "Post comment", compact = false }) => {
  const { user, addComment, requireAuth, signOut, toast } = useThread();
  const [text, setText] = useState(prefill);
  const ref = useRef(null);

  const grow = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 260)}px`;
  };
  useEffect(grow, [text]);
  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
      const n = ref.current.value.length;
      ref.current.setSelectionRange(n, n);
    }
  }, [autoFocus]);

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    requireAuth("comment", (u) => {
      addComment(postId, v, parentId, u);
      setText("");
      toast(parentId ? "Reply posted" : "Comment posted");
      onDone?.();
    });
  };

  if (!user) {
    return (
      <button type="button" className="bt-composer-locked" onClick={() => requireAuth(parentId ? "reply" : "comment", () => {})}>
        <Avatar name="?" size={34} />
        <span>{placeholder || "Sign in with Google to join the discussion"}</span>
        <span className="bt-composer-locked-cta">Sign in</span>
      </button>
    );
  }

  return (
    <div className={`bt-composer${compact ? " is-compact" : ""}`}>
      <Avatar name={user.name} picture={user.picture} size={34} />
      <div className="bt-composer-box">
        <textarea
          ref={ref}
          value={text}
          rows={compact ? 2 : 3}
          maxLength={MAX_LEN}
          placeholder={placeholder || "Add a comment or question"}
          aria-label={placeholder || "Write a comment"}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
          }}
        />
        <div className="bt-composer-bar">
          <span className="bt-composer-as">
            Commenting as <strong>{user.name}</strong> ·{" "}
            <button type="button" onClick={signOut}>Sign out</button>
          </span>
          <span className={`bt-composer-count${text.length > MAX_LEN - 80 ? " is-warn" : ""}`}>{text.length}/{MAX_LEN}</span>
          {onDone && (
            <button type="button" className="bt-btn bt-btn--ghost" onClick={onDone}>Cancel</button>
          )}
          <motion.button type="button" className="bt-btn bt-btn--solid" onClick={submit} disabled={!text.trim()} whileTap={{ scale: 0.96 }}>
            {submitLabel}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ one comment (recursive) */
const CommentItem = ({ c, kidsOf, depth, postId }) => {
  const { user, requireAuth, toggleCommentLike, deleteComment } = useThread();
  const [replying, setReplying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const fresh = useRef(Date.now() - new Date(c.createdAt).getTime() < 2500).current;
  const kids = kidsOf(c.id);
  const mine = user && user.id === c.userId;
  const liked = user && c.likes.includes(user.id);
  const deep = depth >= MAX_DEPTH - 1;
  const first = (c.name || "").split(" ")[0];

  useEffect(() => {
    if (!confirm) return undefined;
    const t = setTimeout(() => setConfirm(false), 3200);
    return () => clearTimeout(t);
  }, [confirm]);

  return (
    <motion.li
      className="bt-c-item"
      layout="position"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.26 }}
    >
      <motion.div
        className="bt-c"
        initial={fresh ? { backgroundColor: "rgba(47,212,192,0.22)" } : false}
        animate={{ backgroundColor: "rgba(47,212,192,0)" }}
        transition={{ duration: 1.8 }}
      >
        <Avatar name={c.name} picture={c.picture} size={34} />
        <div className="bt-c-main">
          <div className="bt-c-head">
            <strong>{c.name}</strong>
            {mine && <span className="bt-you">You</span>}
            <time dateTime={c.createdAt}>{timeAgo(c.createdAt)}</time>
          </div>
          <p className="bt-c-text">{c.text}</p>
          <div className="bt-c-actions">
            <motion.button
              type="button"
              className={`bt-c-act${liked ? " is-on" : ""}`}
              aria-pressed={!!liked}
              whileTap={{ scale: 0.92 }}
              onClick={() => requireAuth("like", (u) => toggleCommentLike(postId, c.id, u))}
            >
              <IconUseful width={16} height={16} /> Helpful{c.likes.length > 0 && <span className="bt-c-n">{c.likes.length}</span>}
            </motion.button>
            <button type="button" className="bt-c-act" onClick={() => requireAuth("reply", () => setReplying((v) => !v))} aria-expanded={replying}>
              <IconReply width={16} height={16} /> Reply
            </button>
            {kids.length > 0 && (
              <button type="button" className="bt-c-act" onClick={() => setCollapsed((v) => !v)} aria-expanded={!collapsed}>
                <motion.span animate={{ rotate: collapsed ? -90 : 0 }} style={{ display: "inline-flex" }}><IconChevron /></motion.span>
                {collapsed ? `Show ${kids.length} ${kids.length === 1 ? "reply" : "replies"}` : "Hide replies"}
              </button>
            )}
            {mine && (
              <button
                type="button"
                className={`bt-c-act bt-c-act--danger${confirm ? " is-armed" : ""}`}
                onClick={() => (confirm ? deleteComment(postId, c.id) : setConfirm(true))}
              >
                <IconTrash /> {confirm ? "Confirm delete" : "Delete"}
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {replying && (
              <motion.div
                className="bt-reply-slot"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24 }}
                style={{ overflow: "hidden" }}
              >
                <Composer
                  postId={postId}
                  parentId={deep ? c.parentId : c.id}
                  prefill={deep ? `@${first} ` : ""}
                  placeholder={`Reply to ${first}`}
                  submitLabel="Post reply"
                  autoFocus
                  compact
                  onDone={() => setReplying(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {kids.length > 0 && !collapsed && (
          <motion.ul
            className="bt-replies"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26 }}
            style={{ overflow: "hidden" }}
          >
            <AnimatePresence initial={false}>
              {kids.map((k) => (
                <CommentItem key={k.id} c={k} kidsOf={kidsOf} depth={depth + 1} postId={postId} />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

/* ------------------------------------------------------------------ whole thread */
const CommentThread = ({ postId, heading = true }) => {
  const { commentsFor } = useThread();
  const all = commentsFor(postId);
  const [sort, setSort] = useState("newest");

  const { tops, kidsOf } = useMemo(() => {
    const byParent = {};
    all.forEach((c) => {
      const k = c.parentId || "root";
      (byParent[k] = byParent[k] || []).push(c);
    });
    const top = [...(byParent.root || [])].sort((a, b) =>
      sort === "helpful"
        ? b.likes.length - a.likes.length || new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    const kids = (id) => [...(byParent[id] || [])].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return { tops: top, kidsOf: kids };
  }, [all, sort]);

  return (
    <div className="bt-thread-comments">
      {heading && (
        <div className="bt-tc-head">
          <h3>Discussion <span>{all.length}</span></h3>
          {all.length > 1 && (
            <div className="bt-seg" role="group" aria-label="Sort comments">
              {[["newest", "Newest"], ["helpful", "Most helpful"]].map(([k, l]) => (
                <button key={k} type="button" className={sort === k ? "is-on" : ""} aria-pressed={sort === k} onClick={() => setSort(k)}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Composer postId={postId} />

      {tops.length === 0 ? (
        <p className="bt-empty">No comments yet. Ask a question or share how your team handles this.</p>
      ) : (
        <ul className="bt-c-list">
          <AnimatePresence initial={false}>
            {tops.map((c) => (
              <CommentItem key={c.id} c={c} kidsOf={kidsOf} depth={0} postId={postId} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default CommentThread;
