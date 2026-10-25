import React from "react";
import { Container } from "reactstrap";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import Banner from "../common/Banner";

const TermsOfService = () => {
  return (
    <div>
      <NavBar />
      <Banner
        title="Terms of Service"
        description="The terms that govern your use of the DIY Prefab platform"
      />

      <section className="py-5">
        <Container>
          <h2 className="mb-3">Terms of Service</h2>
          <p><strong>Effective Date:</strong> 25 March 2026</p>
          <p>
            These Terms of Service govern your access to and use of DIY Prefab website,
            applications, and software services. By using the platform, you agree to these terms.
          </p>

          <h4 className="mt-4">1. Eligibility and Accounts</h4>
          <ul>
            <li>You must provide accurate registration information.</li>
            <li>You are responsible for activity under your account.</li>
            <li>Access is limited to authorized login credentials.</li>
          </ul>

          <h4 className="mt-4">2. Permitted Use</h4>
          <p>
            You may use the platform for lawful business purposes, including project planning,
            tender processing, and engineering-commercial documentation workflows.
          </p>

          <h4 className="mt-4">3. PEB and Tender Workflow Usage</h4>
          <p>
            The platform supports PEB sector workflows, including tender submission handling,
            evaluation support, and output preparation such as QRF, BOQ, and BOM documents.
            You agree not to upload unlawful, infringing, or unauthorized data.
          </p>

          <h4 className="mt-4">4. Customer Data and Ownership</h4>
          <p>
            You retain ownership of your submitted project and tender data. You grant us a limited
            right to host, process, and transmit such data solely to provide the service.
          </p>

          <h4 className="mt-4">5. Confidentiality</h4>
          <p>
            Both parties agree to protect confidential business information exchanged during service
            usage, including tender documents and pricing-related content.
          </p>

          <h4 className="mt-4">6. Security and Access Control</h4>
          <p>
            We implement reasonable safeguards, while you must protect your credentials and notify
            us promptly of suspected unauthorized access.
          </p>

          <h4 className="mt-4">7. Fees and Service Changes</h4>
          <p>
            Paid features, if applicable, are governed by agreed pricing terms. We may update,
            improve, or discontinue non-critical features with notice where reasonable.
          </p>

          <h4 className="mt-4">8. Service Availability</h4>
          <p>
            We aim for reliable uptime, but the service is provided on an "as available" basis and
            may be interrupted for maintenance, upgrades, or events outside our control.
          </p>

          <h4 className="mt-4">9. Prohibited Conduct</h4>
          <ul>
            <li>Unauthorized access attempts, reverse engineering, or security bypass.</li>
            <li>Uploading malicious code or content that violates law or third-party rights.</li>
            <li>Using platform outputs for fraudulent tender activity or misrepresentation.</li>
          </ul>

          <h4 className="mt-4">10. Limitation of Liability</h4>
          <p>
            To the maximum extent permitted by law, we are not liable for indirect or consequential
            damages arising from service use, delays, or data inaccuracies originating from source
            inputs provided by users.
          </p>

          <h4 className="mt-4">11. Termination</h4>
          <p>
            We may suspend or terminate access for violation of these terms or legal requirements.
            You may stop using the service at any time, subject to contractual obligations.
          </p>

          <h4 className="mt-4">12. Governing Law</h4>
          <p>
            These terms are governed by applicable laws in the relevant operating jurisdiction,
            unless otherwise agreed in writing.
          </p>

          <h4 className="mt-4">13. Changes to Terms</h4>
          <p>
            We may update these Terms of Service from time to time. Continued use of the platform
            after updates constitutes acceptance of the revised terms.
          </p>

          <h4 className="mt-4">14. Contact</h4>
          <p>
            For legal or terms-related questions, please contact us using the details on our
            Contact page.
          </p>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;