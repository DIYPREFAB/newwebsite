import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookCall, BOOKING_LABEL } from '../components/home3d/booking';
import './floatingActions.css';

/* Global floating actions (mounted once in App.jsx, so they appear on every page):
   - bottom-left dock: book a call + WhatsApp, small round buttons that name themselves on hover
   - bottom-right: chat assistant launcher, which drives the Flowise chat widget loaded from /chatscript/chat/chat.js */

const ICON_CALENDAR = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="m9 15.2 2.2 2.2 4.3-4.4" />
  </svg>
);

const ICON_WHATSAPP = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const ICON_CHAT = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6.5 6.5h8a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H10.5L7 19.5v-3a3 3 0 0 1-3-3v-4a3 3 0 0 1 2.5-3z" />
    <path d="M8.2 11.5h.01M11 11.5h.01M13.8 11.5h.01" strokeWidth="2.4" />
    <path d="M19.2 2.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="currentColor" strokeWidth="1" />
  </svg>
);

/* The Flowise widget draws its own round bubble inside a shadow root. Find it, hide it, and hand back a handle so our
   launcher can open and close the chat. If the widget never appears (blocked, different embed), this returns null and no
   launcher is drawn, so there is never a dead button. */
function useChatBubble() {
  const [state, setState] = useState({ btn: null, open: false });

  useEffect(() => {
    let timer = null;
    let mo = null;
    let tries = 0;

    const locate = () => {
      const root = document.querySelector('flowise-chatbot')?.shadowRoot;
      if (!root) return null;
      const byPart = root.querySelector('button[part="button"]');
      const btn = byPart || [...root.querySelectorAll('button')].find((b) => getComputedStyle(b).position === 'fixed');
      return btn ? { root, btn } : null;
    };

    const attach = ({ root, btn }) => {
      if (!root.querySelector('style[data-fab]')) {
        const st = document.createElement('style');
        st.setAttribute('data-fab', '');
        st.textContent = 'button[part="button"]{display:none!important}[part="tooltip"]{display:none!important}';
        root.appendChild(st);
      }
      btn.style.setProperty('display', 'none', 'important');
      const read = () => setState({ btn, open: /scale-0/.test(btn.className) });
      read();
      mo = new MutationObserver(read);
      mo.observe(btn, { attributes: true, attributeFilter: ['class'] });
    };

    const tick = () => {
      const found = locate();
      if (found) { clearInterval(timer); attach(found); return; }
      tries += 1;
      if (tries > 75) clearInterval(timer); // give up after about 30 s
    };
    timer = setInterval(tick, 400);
    tick();
    return () => { clearInterval(timer); if (mo) mo.disconnect(); };
  }, []);

  return state;
}

const WhatsAppButton = () => {
  // WhatsApp number and first message
  const whatsappNumber = '+918619015622';
  const message = 'Hello! I would like to know more about your services.';

  const navigate = useNavigate();
  // On small screens the dock collapses into one small toggle so it never sits on top of page content
  const [compact, setCompact] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const chat = useChatBubble();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const apply = () => { setCompact(mq.matches); if (!mq.matches) setExpanded(false); };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded]);

  // Same Cal booking popup as the header "Let's talk" button (one event type, one duration: see booking.js);
  // if Cal is unavailable or blocked it falls back to the Contact Us page
  const handleMeetingClick = (e) => {
    setExpanded(false);
    bookCall(() => navigate('/contact-us'), e);
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setExpanded(false);
  };

  return (
    <>
      <div className={`fab-dock${compact ? ' is-compact' : ''}${expanded ? ' is-expanded' : ''}`}>
        {compact && (
          <button
            type="button"
            className="fab-toggle"
            aria-expanded={expanded}
            aria-controls="fab-actions"
            aria-label={expanded ? 'Close contact options' : 'Open contact options'}
            onClick={() => setExpanded((v) => !v)}
          >
            <i aria-hidden="true" />
          </button>
        )}
        <div className="fab-actions" id="fab-actions" hidden={compact && !expanded}>
          <button type="button" className="fab-btn fab-btn--book" aria-label={`Book a ${BOOKING_LABEL} with the DIY PreFab team`} onClick={handleMeetingClick}>
            {ICON_CALENDAR}
            <span className="fab-tip" aria-hidden="true">Book a {BOOKING_LABEL}</span>
          </button>
          <button type="button" className="fab-btn fab-btn--wa" aria-label="Chat with us on WhatsApp" onClick={handleWhatsAppClick}>
            {ICON_WHATSAPP}
            <span className="fab-tip" aria-hidden="true">Chat on WhatsApp</span>
          </button>
        </div>
      </div>

      {chat.btn && (
        <button
          type="button"
          className={`fab-chat${chat.open ? ' is-hidden' : ''}`}
          aria-label="Open the DIY PreFab chat assistant"
          onClick={() => chat.btn.click()}
          tabIndex={chat.open ? -1 : 0}
        >
          {ICON_CHAT}
          <i className="fab-dot" aria-hidden="true" />
          <span className="fab-tip fab-tip--l" aria-hidden="true">Ask our assistant</span>
        </button>
      )}
    </>
  );
};

export default WhatsAppButton;
