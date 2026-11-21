import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Makes the browser Back button close an overlay (popup, full-screen menu, modal) instead of leaving the site.
//  - when the overlay opens it adds one history entry (same URL, state[key] = true)
//  - Back / swipe-back removes that entry, and requestClose() hides the overlay
//  - closing the overlay with its own X / Esc / outside click removes the entry again, so history stays clean
// To navigate away FROM an overlay, use navigate(path, { replace: !!location.state?.[key] }) so no dead entry is left behind.
export default function useOverlayHistory(key, isOpen, requestClose) {
  const navigate = useNavigate();
  const location = useLocation();
  const prevOpen = useRef(false);
  const prevPushed = useRef(false);
  const closeRef = useRef(requestClose);
  closeRef.current = requestClose;

  useEffect(() => {
    const pushed = Boolean(location.state && location.state[key]);
    if (isOpen && !prevOpen.current) {
      navigate(
        { pathname: location.pathname, search: location.search, hash: location.hash },
        { state: { ...(location.state || {}), [key]: true } }
      );
    } else if (!isOpen && prevOpen.current && pushed) {
      navigate(-1);
    } else if (isOpen && prevPushed.current && !pushed) {
      closeRef.current?.();
    }
    prevOpen.current = isOpen;
    prevPushed.current = pushed;
  }, [isOpen, location, key, navigate]);
}
