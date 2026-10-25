import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLinkedinIn, FaArrowRight } from "react-icons/fa";
import ImagePath from "../../assets/ImagePath";
import ROUTE_PATHS from "../../routes/RoutePath";
import SteelBits from "../home3d/SteelBits";
import { RESPECT_REDUCED_MOTION } from "../contact3d/contactData";
import "./footer3d.css";

gsap.registerPlugin(ScrollTrigger);

// Same content and links as the previous footer, restyled to the 3D theme with scroll motion.
const FooterNew = () => {
  const root = useRef(null);

  useEffect(() => {
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current) return undefined;
    const el = root.current;
    const ctx = gsap.context(() => {
      const enter = { trigger: el, start: "top 88%", toggleActions: "play none none reverse" };
      gsap.fromTo(".ft3-line", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.out", scrollTrigger: enter });
      gsap.fromTo(".ft3-col", { y: 80, opacity: 0, rotationX: -20, transformPerspective: 900 }, {
        y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: enter,
      });
      gsap.fromTo(".ft3-bottom", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.3, ease: "power3.out", scrollTrigger: enter });
      const scrub = { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.8 };
      gsap.fromTo(".ft3-ghost", { xPercent: 2.5 }, { xPercent: -2.5, ease: "none", scrollTrigger: scrub }); // gentle drift only: the full "DIY PREFAB" must stay inside the footer
      gsap.fromTo(".ft3-card", { y: 40 }, { y: -10, ease: "none", stagger: 0.05, scrollTrigger: scrub });
      gsap.fromTo(".ft3 .sh-bit", { y: 70 }, { y: (i, t) => -(Number(t.dataset.sp) || 0.5) * 160, ease: "none", scrollTrigger: scrub });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="ft3" ref={root}>
      <i className="ft3-line" aria-hidden="true" />
      <div className="ft3-ghost" aria-hidden="true">DIY PREFAB</div>
      <SteelBits n={16} />

      <div className="ft3-wrap">
        <div className="ft3-grid">
          <div className="ft3-col ft3-brand">
            <Link to="/" className="ft3-logo">
              <img src={ImagePath.Logo} alt="DIY Prefab - India's Leading Prefab Structure Company" />
            </Link>
            <p>
              Diyprefab is your go-to destination for customizable, easy-to-assemble prefab building kits. Whether you're creating a backyard office, tiny home, or storage shed, we make construction simple and affordable.
            </p>
            <div className="ft3-social">
              <a href="https://www.linkedin.com/company/diyprefab" target="_blank" rel="noopener noreferrer" aria-label="DIY Prefab on LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="ft3-col">
            <h6>Company</h6>
            <ul className="ft3-links">
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog-news">Blog</Link></li>
            </ul>
          </div>

          <div className="ft3-col">
            <h6>Support</h6>
            <ul className="ft3-links">
              <li><Link to={ROUTE_PATHS.PRIVACY_POLICY}>Privacy Policy</Link></li>
              <li><Link to={ROUTE_PATHS.TERMS_OF_SERVICE}>Terms of Service</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
            </ul>
          </div>

          <div className="ft3-col ft3-connect">
            <h6>Connect With Us</h6>
            <div className="ft3-cards">
              <div className="ft3-card"><p>Head Office:</p><strong>32_C Nakoda Nagar II, Udaipur 313001</strong></div>
              <div className="ft3-card"><p>Additional Sales Office:</p><strong>Ahmedabad, Noida</strong></div>
              <div className="ft3-card"><p>Email:</p><strong>info@diyprefab.com</strong></div>
              <div className="ft3-card"><p>Phone:</p><strong>+91 8619015622</strong></div>
            </div>
          </div>
        </div>

        <div className="ft3-bottom">
          <span>
            Copyright &copy; {new Date().getFullYear()} The Sunil &amp; Co., All rights reserved.{" "}
            <a href="https://aiprefab.in/" target="_blank" rel="noopener noreferrer">Powered by Ai-Prefab</a>
          </span>
          <ul>
            <li><Link to={ROUTE_PATHS.TERMS_OF_SERVICE}>Terms of Use</Link></li>
            <li><Link to={ROUTE_PATHS.PRIVACY_POLICY}>Privacy Policy</Link></li>
            <li><a href="/sitemap.xml">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(FooterNew);
