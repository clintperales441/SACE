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
                  Last updated
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                  pariatur.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  2. Use of Service
                </h2>
                <p className="mb-4">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                  mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                  veniam, quis nostrud exercitation ullamco laboris.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  3. User Accounts
                </h2>
                <p className="mb-4">
                  Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
                  voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  4. Intellectual Property
                </h2>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  5. Limitation of Liability
                </h2>
                <p className="mb-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
                  qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, 
                  consectetur adipiscing elit.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  6. Governing Law
                </h2>
                <p className="mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the 
                  jurisdiction in which SACE operates, without regard to its conflict of law provisions.
                </p>

                <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
                  7. Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions about these Terms, please contact us at legal@sace.com. 
                  We reserve the right to update these terms at any time without prior notice.
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
