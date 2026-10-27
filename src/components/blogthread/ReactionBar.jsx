import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { REACTIONS, useThread } from "./ThreadContext";
import { IconInsight, IconSourced, IconUseful } from "./icons";

const ICONS = { useful: IconUseful, insightful: IconInsight, sourced: IconSourced };
const SPARKS = [0, 60, 120, 180, 240, 300];

const ReactionBar = ({ postId }) => {
  const { reactionCounts, myReaction, toggleReaction, requireAuth } = useThread();
  const counts = reactionCounts(postId);
  const mine = myReaction(postId);
  const [burst, setBurst] = useState(null);

  const press = (key) =>
    requireAuth("react", (u) => {
      const turningOn = (myReaction(postId) || null) !== key;
      toggleReaction(postId, key, u);
      if (turningOn) {
        setBurst({ key, id: Date.now() });
        setTimeout(() => setBurst((b) => (b && b.key === key ? null : b)), 700);
      }
    });

  return (
    <div className="bt-reacts" role="group" aria-label="React to this post">
      {REACTIONS.map(({ key, label }) => {
        const Icon = ICONS[key];
        const on = mine === key;
        const n = counts[key];
        return (
          <motion.button
            key={key}
            type="button"
            className={`bt-react${on ? " is-on" : ""}`}
            aria-pressed={on}
            onClick={() => press(key)}
            whileTap={{ scale: 0.94 }}
          >
            <motion.span
              className="bt-react-ic"
              key={on ? "on" : "off"}
              initial={false}
              animate={on ? { scale: [1, 1.4, 1], rotate: [0, -14, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.46, ease: "easeOut" }}
            >
              <Icon width={18} height={18} />
              {burst?.key === key &&
                SPARKS.map((deg) => (
                  <motion.i
                    key={`${burst.id}-${deg}`}
                    className="bt-spark"
                    initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    animate={{ opacity: 0, x: Math.cos((deg * Math.PI) / 180) * 18, y: Math.sin((deg * Math.PI) / 180) * 18, scale: 0.3 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  />
                ))}
            </motion.span>
            <span className="bt-react-label">{label}</span>
            <span className="bt-react-count" aria-label={`${n} ${label}`}>
              <AnimatePresence mode="popLayout" initial={false}>
                {n > 0 && (
                  <motion.span key={n} initial={{ y: 9, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -9, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {n}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
