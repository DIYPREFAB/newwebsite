import React from "react";

const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false };
const mk = (children, extra) => (props) => <svg {...base} {...extra} {...props}>{children}</svg>;

export const IconUseful = mk(<><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Z" /><path d="M7 11l4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.3 20H7" /></>);
export const IconInsight = mk(<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.4.4.6.9.6 1.4V16h6v-.8c0-.5.2-1 .6-1.4A6 6 0 0 0 12 3Z" /></>);
export const IconSourced = mk(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /><path d="m9 14.5 2 2 4-4.5" /></>);
export const IconComment = mk(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12Z" />);
export const IconReply = mk(<><path d="M9 14 4 9l5-5" /><path d="M4 9h9a7 7 0 0 1 7 7v3" /></>);
export const IconShare = mk(<><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="m8.3 10.7 7.4-4.4M8.3 13.3l7.4 4.4" /></>);
export const IconClock = mk(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, { width: 16, height: 16 });
export const IconSearch = mk(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const IconClose = mk(<path d="M6 6l12 12M18 6 6 18" />);
export const IconArrow = mk(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconBack = mk(<path d="M19 12H5M11 6l-6 6 6 6" />);
export const IconCheck = mk(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const IconTrash = mk(<><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></>, { width: 16, height: 16 });
export const IconChevron = mk(<path d="m6 9 6 6 6-6" />, { width: 16, height: 16 });
export const IconThread = mk(<><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="12" r="2" /><path d="M6 7v10M8 12h8" /></>);
export const IconQuery = mk(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8" /><path d="M12 17h.01" /></>);
