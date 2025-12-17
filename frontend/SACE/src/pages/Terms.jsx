import Layout from '@/components/layout/Layout';

const Terms = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                Terms of Service
              </h1>

              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  <strong>System:</strong> S.A.C.E – SRS AI-Powered Checking Engine<br />
                  <strong>Institution:</strong> Cebu Institute of Technology – University<br />
                  <strong>Last Updated:</strong> December 2025
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                  By accessing or using the S.A.C.E (SRS AI-Powered Checking Engine) system, you agree
                  to be bound by these Terms of Service. If you do not agree to these terms, you
                  may not access or use the system.
                </p>
                <p className="mb-4">
                  These Terms apply to all users of the system, including students, instructors,
                  and administrators.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  2. Use of Service
                </h2>
                <p className="mb-4">
                  S.A.C.E is provided strictly for academic and educational purposes. Users agree
                  to use the system only for legitimate academic activities related to Software
                  Requirements Specification (SRS) evaluation.
                </p>
                <p className="mb-4">
                  You agree not to misuse the system, attempt to bypass security controls, submit
                  malicious files, or engage in activities that may compromise system integrity.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  3. User Accounts
                </h2>
                <p className="mb-4">
                  Access to S.A.C.E requires user authentication. You are responsible for maintaining
                  the confidentiality of your account credentials and for all activities performed
                  under your account.
                </p>
                <p className="mb-4">
                  Users must provide accurate and complete information. Any unauthorized use of
                  accounts or suspected security breaches must be reported immediately.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  4. Intellectual Property
                </h2>
                <p className="mb-4">
                  All system components, including software, interface design, logos, and AI-generated
                  analysis mechanisms, are the intellectual property of the S.A.C.E development team
                  unless otherwise stated.
                </p>
                <p className="mb-4">
                  Users retain ownership of their submitted SRS documents. However, by submitting
                  documents, users grant the system permission to process them for evaluation and
                  feedback purposes.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  5. Limitation of Liability
                </h2>
                <p className="mb-4">
                  S.A.C.E is provided on an “as-is” and “as-available” basis. While reasonable efforts
                  are made to ensure accuracy and reliability, the system does not guarantee that
                  AI-generated feedback is error-free or complete.
                </p>
                <p className="mb-4">
                  The developers and institution shall not be held liable for any academic decisions,
                  data loss, or damages arising from the use or inability to use the system.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  6. Governing Law
                </h2>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the
                  Republic of the Philippines, without regard to its conflict of law provisions.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  7. Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions or concerns regarding these Terms of Service, you may
                  contact us at <strong>legal@sace.com</strong>. We reserve the right to update these
                  Terms at any time, with changes effective upon posting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
