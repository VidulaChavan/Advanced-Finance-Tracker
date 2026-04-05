import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      {/* Header */}
      <header className={`container`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image src="/logo.png" alt="LifeSync Logo" width={40} height={40} style={{ borderRadius: '8px' }} priority />
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-navy, #1A202C)' }}>LifeSync</span>
        </div>
        <Link href="/login">
          <button className="btn-secondary" style={{ padding: '0.6rem 1.5rem', background: 'transparent', border: '1px solid var(--primary-navy)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Log In</button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>Beta • Smart Financial Assistant</div>
          <h1>Take absolute control<br/>of your finances.</h1>
          <p>Simplify your life and never miss what matters. LifeSync analyzes your expenses, manages your subscriptions, and builds personalized financial intelligence.</p>
          <Link href="/signup">
            <button className={`${styles.btnAccent} btn-accent`} style={{ animation: 'pulse-soft 2s infinite' }}>
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* Complex Premium Dashboard Mockup */}
      <div className={`container`}>
        <div className={styles.mockupWrapper}>
           {/* Floating Elements for 3D depth */}
           <div className={`${styles.floatingElement} ${styles.float1}`}>
             <span style={{ fontSize: '1.5rem' }}>↗</span> +₹ 12,400 Saved
           </div>
           <div className={`${styles.floatingElement} ${styles.float2}`}>
             <span style={{ fontSize: '1.5rem', background: '#FF7F50', borderRadius: '50%', color: 'white', padding: '0.2rem' }}>!</span> Payment Due
           </div>

           <div className={styles.mainMockup}>
             <div className={styles.mockHeader}>
               <span>LifeSync Platform</span>
               <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                 <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary-navy)' }}></div>
                 <span style={{ fontWeight: '600', color: '#4A5568' }}>Alex M.</span>
               </div>
             </div>

             <div className={styles.mockGrid}>
               {/* Sidebar mock */}
               <div className={styles.mockSidebar}>
                 <div className={`${styles.mockNavItem} ${styles.active}`}></div>
                 <div className={styles.mockNavItem}></div>
                 <div className={styles.mockNavItem}></div>
               </div>

               {/* Content mock */}
               <div className={styles.mockBody}>
                  <div className={styles.mockCardsRow}>
                    <div className={styles.mockDataCard}>
                      <div className={styles.mockCardLabel}>Total Expenses</div>
                      <div className={styles.mockCardValue}>₹ 42,500</div>
                    </div>
                    <div className={`${styles.mockDataCard} ${styles.accent}`}>
                      <div className={styles.mockCardLabel}>Upcoming Bills</div>
                      <div className={styles.mockCardValue}>3</div>
                    </div>
                  </div>
                  
                  <div className={styles.mockChartArea}>
                     <div className={styles.mockBar} style={{ height: '30%' }}></div>
                     <div className={styles.mockBar} style={{ height: '50%' }}></div>
                     <div className={styles.mockBar} style={{ height: '80%' }}></div>
                     <div className={styles.mockBar} style={{ height: '40%' }}></div>
                     <div className={styles.mockBar} style={{ height: '60%', background: 'var(--accent-coral)' }}></div>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Features Section */}
      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>Precision Tools for Modern Wealth</h2>
        <p className={styles.sectionSubtitle}>Everything you need to orchestrate your financial life in one sleek, unified dashboard.</p>
        
        <div className={styles.featuresGrid}>
          <div className={`${styles.card} ${styles.featureCard}`}>
             <div className={styles.featureIconWrapper}>📈</div>
             <h3>Intelligent Tracking</h3>
             <p>Log your daily spending seamlessly. Every entry is meticulously tracked in ₹ INR for precise, real-time budgeting analysis.</p>
          </div>
          <div className={`${styles.card} ${styles.featureCard}`}>
             <div className={styles.featureIconWrapper}>⚡</div>
             <h3>Smart Reminders</h3>
             <p>Never incur late fees again. Intelligent, timely alerts for utility bills, EMIs, and essential deadlines before they matter.</p>
          </div>
          <div className={`${styles.card} ${styles.featureCard}`}>
             <div className={styles.featureIconWrapper}>🔒</div>
             <h3>Subscription Manager</h3>
             <p>Identify and eliminate forgotten OTT and SaaS subscriptions passively draining your checking account.</p>
          </div>
          <div className={`${styles.card} ${styles.featureCard}`}>
             <div className={styles.featureIconWrapper}>🧠</div>
             <h3>Predictive Insights</h3>
             <p>Advanced algorithmic trends predict your monthly spending trajectory, actively warning you to optimize consumption.</p>
          </div>
        </div>
      </section>

      {/* How It Works Layered Sequence */}
      <section className={`${styles.section} ${styles.howItWorks}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Intuitive from Day One</h2>
          <p className={styles.sectionSubtitle}>We removed the friction of financial tracking. See how easy it is to get started.</p>
          
          <div className={styles.stepsContainer}>
            <div className={styles.stepRow}>
              <div className={styles.stepContent}>
                 <div className={styles.stepNumber}>1</div>
                 <h3>Connect Your Data</h3>
                 <p>Input your fixed expenses and incomes. Our platform instantly structures your raw data into actionable insights.</p>
              </div>
              <div className={styles.stepVisual}>
                 <button className={styles.interactiveButton}>Add ₹5,000 Expense</button>
              </div>
            </div>

            <div className={styles.stepRow}>
              <div className={styles.stepContent}>
                 <div className={styles.stepNumber}>2</div>
                 <h3>AI Categorization</h3>
                 <p>LifeSync's engine organizes everything automatically, sorting out Transport, Food, and Subscriptions flawlessly.</p>
              </div>
              <div className={styles.stepVisual}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ background: '#E2E8F0', padding: '0.5rem 1rem', borderRadius: '4px' }}>Food</div>
                   <div style={{ background: '#E2E8F0', padding: '0.5rem 1rem', borderRadius: '4px' }}>Transport</div>
                 </div>
              </div>
            </div>

            <div className={styles.stepRow}>
              <div className={styles.stepContent}>
                 <div className={styles.stepNumber}>3</div>
                 <h3>Achieve Clarity</h3>
                 <p>Access stunning, real-time interactive charts highlighting exactly where your money serves you best.</p>
              </div>
              <div className={styles.stepVisual} style={{ background: 'var(--primary-charcoal)', border: 'none' }}>
                 <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', gap: '5%', padding: '2rem' }}>
                    <div style={{ flex: 1, background: 'var(--accent-gold)', height: '40%', borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ flex: 1, background: 'var(--accent-coral)', height: '90%', borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ flex: 1, background: '#FFFFFF', height: '60%', borderRadius: '4px 4px 0 0' }}></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${styles.section} ${styles.testimonials}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Trusted by Thousands</h2>
          <p className={styles.sectionSubtitle}>Join the individuals using LifeSync to rebuild their wealth structures.</p>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.quoteMark}>"</div>
              <p className={styles.testimonialText}>LifeSync highlighted that I was wasting ₹4,000 monthly on subscriptions I rarely used. The clean dashboard has completely altered my consumption habits.</p>
              <div className={styles.testimonialAuthor}>
                 <div className={styles.authorAvatar}>AS</div>
                 <div className={styles.authorInfo}>
                   <h4>Ananya S.</h4>
                   <p>Product Manager</p>
                 </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.quoteMark}>"</div>
              <p className={styles.testimonialText}>The predictive insights caught an overspending trend before the festive season even peaked. It literally saved me from diving into credit card debt.</p>
              <div className={styles.testimonialAuthor}>
                 <div className={styles.authorAvatar}>RV</div>
                 <div className={styles.authorInfo}>
                   <h4>Rahul V.</h4>
                   <p>Software Engineer</p>
                 </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.quoteMark}>"</div>
              <p className={styles.testimonialText}>I used to constantly miss due dates on minor utility bills. Since using LifeSync's intelligent reminders, my credit score has steadily improved.</p>
              <div className={styles.testimonialAuthor}>
                 <div className={styles.authorAvatar}>PM</div>
                 <div className={styles.authorInfo}>
                   <h4>Priya M.</h4>
                   <p>Freelance Designer</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={`container`}>
        <div className={styles.ctaSection}>
           <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>Ready to simplify your life?</h2>
           <p style={{ fontSize: '1.2rem', opacity: '0.9', marginBottom: '2.5rem' }}>Join the premium platform that treats your capital with the respect it deserves.</p>
           <Link href="/signup">
             <button className="btn-accent" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
               Start Tracking Now
             </button>
           </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerLogo}>LifeSync</div>
          <p>© 2026 LifeSync Technologies. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
