import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FIGURES } from "./Figures";
import { parseInline } from "./utils";

export const Inline = ({ text }) =>
  parseInline(text).map((p, i) => {
    if (p.type === "bold") return <strong key={i}>{p.value}</strong>;
    if (p.type === "cite")
      return (
        <sup key={i} className="bt-cite">
          <a href={`#source-${p.value}`}>[{p.value}]</a>
        </sup>
      );
    if (p.type === "link")
      return p.href.startsWith("/") ? (
        <Link key={i} to={p.href}>{p.value}</Link>
      ) : (
        <a key={i} href={p.href} target="_blank" rel="noopener noreferrer">{p.value}</a>
      );
    return <React.Fragment key={i}>{p.value}</React.Fragment>;
  });

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] },
};

const ArticleBody = ({ blocks }) => (
  <div className="bt-prose">
    {blocks.map((b, i) => {
      switch (b.t) {
        case "h2":
          return <motion.h2 key={i} id={b.id} {...rise}>{b.text}</motion.h2>;
        case "p":
          return <motion.p key={i} {...rise}><Inline text={b.text} /></motion.p>;
        case "ul":
          return (
            <motion.ul key={i} {...rise}>
              {b.items.map((it, j) => <li key={j}><Inline text={it} /></li>)}
            </motion.ul>
          );
        case "note":
          return (
            <motion.aside key={i} className="bt-note" {...rise}>
              <strong>{b.title}</strong>
              <p><Inline text={b.text} /></p>
            </motion.aside>
          );
        case "example":
          return (
            <motion.aside key={i} className="bt-example" {...rise}>
              <strong>{b.title}</strong>
              <dl>
                {b.rows.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </motion.aside>
          );
        case "figure": {
          const Fig = FIGURES[b.id];
          return Fig ? <Fig key={i} /> : null;
        }
        default:
          return null;
      }
    })}
  </div>
);

export default ArticleBody;
