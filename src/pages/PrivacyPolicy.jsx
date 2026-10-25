import React from "react";
import { Container } from "reactstrap";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import Banner from "../common/Banner";

const PrivacyPolicy = () => {
  return (
    <div>
      <NavBar />
      <Banner
        title="Privacy Policy"
        description="How DIY Prefab handles data in our platform and tender workflows"
      />

      <section className="py-5">
        <Container>
          <h2 className="mb-3">Privacy Policy</h2>
          <p><strong>Effective Date:</strong> 25 March 2026</p>
          <p>
            This Privacy Policy explains how DIY Prefab collects, uses, stores, and protects
            information when you use our software platform, website, and related digital services.
            Except where specifically noted below for the PEB (Pre-Engineered Building) sector and
            tender workflows, standard SaaS privacy and security practices apply.
          </p>

          <h4 className="mt-4">1. Scope and Applicability</h4>
          <p>
            This policy applies to all users who access our systems through authorized login
            credentials, including customers, internal users, and approved collaborators.
          </p>

          <h4 className="mt-4">2. Data We Collect</h4>
          <p>We may collect and process the following categories of data:</p>
          <ul>
            <li>Account data such as name, business email, phone number, company, and role.</li>
            <li>Authentication data such as hashed passwords, login timestamps, and access logs.</li>
            <li>Operational data uploaded or created in the platform, including files and documents.</li>
            <li>Technical usage data such as browser type, IP address, device, and session metrics.</li>
            <li>Support communication data when you contact us for assistance.</li>
          </ul>

          <h4 className="mt-4">3. Sector-Specific Tool Usage (PEB Workflows)</h4>
          <p>
            Our tools are designed for project planning, estimation, and tender participation in the
            PEB sector. Data entered into the system may include technical and commercial project
            information relevant to fabrication and construction workflows.
          </p>

          <h4 className="mt-4">4. Tender Submission Data</h4>
          <p>
            When tenders are submitted through our platform or shared with us for processing, we
            collect only the information needed to review, prepare, and process submission-related
            activities. This may include client requirements, schedules, technical drawings,
            commercial terms, and compliance documents.
          </p>

          <h4 className="mt-4">5. Usage of Received Tenders</h4>
          <p>Received tenders are used for legitimate business purposes, including:</p>
          <ul>
            <li>Evaluating project feasibility and response readiness.</li>
            <li>Preparing estimates and proposal documents.</li>
            <li>Generating project artifacts such as QRF, BOQ, and BOM outputs.</li>
            <li>Internal collaboration among authorized team members.</li>
          </ul>
          <p>
            We do not sell tender data. We do not use received tender content for unrelated
            marketing exploitation.
          </p>

          <h4 className="mt-4">6. QRF, BOQ, and BOM Formation</h4>
          <p>
            Data may be processed to build and refine QRF (Quick Response Format), BOQ (Bill of
            Quantities), and BOM (Bill of Materials) documentation. This processing may involve
            structured extraction, normalization, and calculation based on project inputs. Output
            documents are accessible only to users with valid permissions.
          </p>

          <h4 className="mt-4">7. Access Rights and Login Controls</h4>
          <p>
            Access to tender data, project artifacts, and platform functions is restricted to
            authenticated users. Rights are limited to login-enabled accounts only, with role-based
            authorization enforced where applicable. You are responsible for safeguarding your login
            credentials and reporting any unauthorized account activity immediately.
          </p>

          <h4 className="mt-4">8. Standard SaaS Privacy Practices</h4>
          <p>In addition to the workflow-specific points above, we follow common SaaS controls:</p>
          <ul>
            <li>Data minimization and purpose-based processing.</li>
            <li>Reasonable technical and organizational security safeguards.</li>
            <li>Retention limits based on legal, contractual, and operational needs.</li>
            <li>Access logging, monitoring, and incident response procedures.</li>
            <li>Use of trusted service providers under confidentiality obligations.</li>
          </ul>

          <h4 className="mt-4">9. Marketing Retargeting (LinkedIn and Meta)</h4>
          <p>
            We may use marketing and retargeting technologies, including LinkedIn Insight Tag and
            Meta Pixel (or equivalent tools), to measure campaign performance, build relevant
            audiences, and show business-related ads to prior website visitors.
          </p>
          <p>These tools may process limited identifiers and activity data, such as:</p>
          <ul>
            <li>Page views, navigation events, and campaign source information.</li>
            <li>Device/browser metadata, IP-based location approximation, and cookie identifiers.</li>
            <li>Event signals related to business actions, such as form submissions.</li>
          </ul>
          <p>
            We do not intentionally share confidential tender content, QRF/BOQ/BOM documents, or
            full commercial files with ad networks for retargeting purposes.
          </p>

          <h4 className="mt-4">10. Cookies, Consent, and Opt-Out</h4>
          <p>
            Where required by law, marketing cookies and ad-tracking technologies are used only
            after consent. You can control or disable cookies through browser settings and platform
            controls made available by LinkedIn and Meta. Disabling these technologies may reduce
            ad personalization and campaign measurement accuracy.
          </p>

          <h4 className="mt-4">11. Data Sharing and Disclosure</h4>
          <p>We may disclose information only when necessary for:</p>
          <ul>
            <li>Providing contracted services.</li>
            <li>Complying with legal obligations, court orders, or government requests.</li>
            <li>Protecting our rights, users, systems, or platform security.</li>
          </ul>

          <h4 className="mt-4">12. Your Rights</h4>
          <p>
            Subject to applicable law, you may request access, correction, deletion, or restriction
            of your personal information. You may also request account deactivation, subject to
            retention obligations.
          </p>

          <h4 className="mt-4">13. Policy Updates</h4>
          <p>
            We may update this policy from time to time. Updates will be posted on this page with a
            revised effective date.
          </p>

          <h4 className="mt-4">14. Contact</h4>
          <p>
            For privacy-related questions, please contact us through the details listed on our
            Contact page.
          </p>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;