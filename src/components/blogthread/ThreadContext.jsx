import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { uid } from "./utils";
import { IconCheck } from "./icons";
import QueryModal from "./QueryModal";

// The blog is read-only: no sign-in, reactions or comments. This provider supplies the small
// "Link copied" toast used by the Share buttons and the popup Query form.
const ThreadCtx = createContext(null);
export const useThread = () => useContext(ThreadCtx);

export const ThreadProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [queryPost, setQueryPost] = useState(null);
  const openQuery = useCallback((post) => setQueryPost(post), []);
  const closeQuery = useCallback(() => setQueryPost(null), []);

  const toast = useCallback((message) => {
    const id = uid();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const value = useMemo(() => ({ toast, openQuery }), [toast, openQuery]);

  return (
    <ThreadCtx.Provider value={value}>
      <MotionConfig reducedMotion="user">
        {children}
        <QueryModal post={queryPost} onClose={closeQuery} />
        <div className="bt-toasts" role="status" aria-live="polite">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                className="bt-toast"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              >
                <IconCheck width={16} height={16} /> {t.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </ThreadCtx.Provider>
  );
};
