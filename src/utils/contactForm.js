import ROUTE_PATHS from "../routes/RoutePath";

// Id of the "Send us a message" section on the Contact Us page (see ContactSections.jsx).
export const CONTACT_FORM_ID = "contact-form";

// Where "Let's talk" buttons send people: the contact FORM on the Contact Us page, not the top of the page.
export const CONTACT_FORM_PATH = `${ROUTE_PATHS.CONTACT_US}#${CONTACT_FORM_ID}`;

export const goToContactForm = (navigate) => navigate(CONTACT_FORM_PATH);
