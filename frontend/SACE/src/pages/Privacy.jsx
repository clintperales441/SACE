import Layout from '@/components/layout/Layout';

const Privacy = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Privacy Policy
              </h1>

              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  <strong>System:</strong> S.A.C.E – SRS AI-Powered Checking Engine<br />
                  <strong>Institution:</strong> Cebu Institute of Technology – University<br />
                  <strong>Last Updated:</strong> September 2025
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  1. Introduction
                </h2>
                <p className="mb-4">
                  This Privacy Policy explains how S.A.C.E (SRS AI-Powered Checking Engine)
                  collects, uses, stores, and protects personal and academic data. SACE is a web-based
                  academic system designed to assist students and instructors in evaluating Software
                  Requirements Specification (SRS) documents based on IEEE and ISO standards.
                </p>
                <p className="mb-4">
                  This system is developed strictly for academic and educational purposes and complies
                  with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  2. Information We Collect
                </h2>
                <p className="mb-2">
                  We collect only the minimum data necessary to operate the system:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Full name and email address</li>
                  <li>User role (Student or Instructor)</li>
                  <li>SRS documents submitted in PDF or DOCX format</li>
                  <li>Document metadata (file name, size, submission date, version history)</li>
                  <li>AI-generated analysis results and feedback</li>
                  <li>Instructor comments and approval status</li>
                  <li>Basic technical data such as browser type and IP address (for security only)</li>
                </ul>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="mb-4">
                  Collected information is used exclusively to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Authenticate users via Google OAuth or email login</li>
                  <li>Enforce role-based access control</li>
                  <li>Analyze SRS documents using AI</li>
                  <li>Generate structured evaluation feedback</li>
                  <li>Allow instructors to review and approve results</li>
                  <li>Maintain system security and academic integrity</li>
                </ul>
                <p className="mb-4">
                  SACE does not use personal data for marketing, advertising, or commercial purposes.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  4. AI Processing and Human Oversight
                </h2>
                <p className="mb-4">
                  SACE uses Google Gemini AI to analyze SRS documents. AI-generated feedback is provided
                  as a recommendation only. Final academic decisions remain under full instructor
                  control, and no evaluation is made solely by automated means.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  5. Data Storage and Security
                </h2>
                <p className="mb-4">
                  Data is securely stored using Supabase (PostgreSQL). We apply industry-standard
                  safeguards, including HTTPS encryption, authentication tokens, role-based access
                  control, and row-level security.
                </p>
                <p className="mb-4">
                  SRS documents are retained only for the duration of the academic term and are deleted
                  within 30 days after the end of the semester.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  6. Third-Party Services
                </h2>
                <p className="mb-4">
                  SACE integrates third-party services such as Google OAuth, Google Drive API, Google
                  Gemini AI, Supabase, and Vercel. Only the minimum data required for functionality is
                  shared with these services, which operate under their own privacy policies.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  7. Your Rights
                </h2>
                <p className="mb-4">
                  In accordance with the Data Privacy Act of 2012, you have the right to be informed,
                  access your data, request corrections, request deletion (subject to academic
                  requirements), and file a complaint with the National Privacy Commission.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  8. Contact Us
                </h2>
                <p className="mb-4">
                  If you have questions or concerns regarding this Privacy Policy or your data, you may
                  contact us at <strong>privacy@sace.com</strong>. We are committed to resolving privacy
                  concerns fairly and in compliance with applicable laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
