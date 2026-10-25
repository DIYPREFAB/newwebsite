import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { ImOffice } from "react-icons/im";

// Same switch as the Key Benefits page: false = animate even when the device asks for reduced motion
// (some phones turn it on by default with battery saver). Set to true to honour the OS setting.
export const RESPECT_REDUCED_MOTION = false;

export const TITLE = "Reach Out for Innovation and Industrial Solutions";
export const HERO_HL = new Set(["Innovation", "Industrial", "Solutions"]);
export const HERO_TEXT =
  "Connect with engineering excellence that delivers smart, sustainable, and precision-driven prefab solutions tailored to your vision.";

export const ADDRESS = "32_C Nakoda Nagar II, Udaipur 313001";
export const EMAIL = "info@diyprefab.com";
export const PHONE_LABEL = "+91 8619015622";
export const PHONE_HREF = "tel:+918619015622";
export const MAPS_HREF = "https://www.google.com/maps/search/?api=1&query=32_C+Nakoda+Nagar+II+Udaipur+313001";

export const CHANNELS = [
  { id: "office", Icon: ImOffice, label: "Head Office", value: ADDRESS, action: "Open in Maps", href: MAPS_HREF, external: true },
  { id: "email", Icon: MdOutlineEmail, label: "Email Us", value: EMAIL, action: "Write to us", href: `mailto:${EMAIL}` },
  { id: "phone", Icon: IoCallOutline, label: "Let's Talk", value: PHONE_LABEL, action: "Call now", href: PHONE_HREF },
];

export const STEPS = [
  ["01", "Tell us what you need", "Share your requirement through the form, or book a call at a time that suits you."],
  ["02", "We review and reach out", "Our engineers study your brief and get back to you with the right direction."],
  ["03", "Design, estimate and build", "Free design and estimate consultation, then fabrication and on-site assembly."],
];
