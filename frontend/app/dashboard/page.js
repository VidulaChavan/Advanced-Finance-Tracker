'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [salaryReady, setSalaryReady] = useState(false);
  const [inputSalary, setInputSalary] = useState('');
  const [data, setData] = useState({
    salary: 0,
    expenses: [],
    reminders: [],
    insights: {}
  });

  useEffect(() => {
    // Check for salary first
    const savedSalary = localStorage.getItem('lifesync_salary');
    if (!savedSalary) {
      setLoading(false);
      return; 
    }
    setSalaryReady(true);
    const userSalary = parseFloat(savedSalary);

    // Dynamic loading from localStorage
    const savedExpenses = localStorage.getItem('lifesync_expenses');
    const savedReminders = localStorage.getItem('lifesync_reminders');
    
    // Fallback if not visited sub-pages yet
    let exps = savedExpenses ? JSON.parse(savedExpenses) : [
        { id: 1, title: 'Groceries (Reliance Fresh)', amount: 4500, category: 'Food', date: '2026-03-24' },
        { id: 2, title: 'Uber to Office', amount: 350, category: 'Transport', date: '2026-03-23' },
        { id: 3, title: 'Netflix & Spotify', amount: 800, category: 'Entertainment', date: '2026-03-22' }
    ];
    let rems = savedReminders ? JSON.parse(savedReminders) : [
        { id: 1, title: 'Electricity Bill', amount: 1500, dueDate: '2026-04-05', isPaid: false },
        { id: 2, title: 'Internet (Airtel)', amount: 999, dueDate: '2026-04-10', isPaid: false },
        { id: 3, title: 'Credit Card (HDFC)', amount: 12400, dueDate: '2026-04-15', isPaid: false }
    ];

    if (!savedExpenses) localStorage.setItem('lifesync_expenses', JSON.stringify(exps));
    if (!savedReminders) localStorage.setItem('lifesync_reminders', JSON.stringify(rems));

    const totalExt = exps.reduce((s, e) => s + e.amount, 0);
    const upc = rems.filter(r => !r.isPaid).length;
    
    // Calculate 80% of salary as dangerous zone
    const overspendingThreshold = userSalary * 0.8;
    const isOverspending = totalExt > overspendingThreshold;
    
    setData({
      salary: userSalary,
      totalExpenses: totalExt,
      upcomingBills: upc,
      reminders: rems.filter(r => !r.isPaid).slice(0, 3), // Show top 3 unpaid
      insights: {
        overspending: isOverspending,
        message: `You have spent ₹${totalExt.toLocaleString()} this month, exceeding 80% of your ₹${userSalary.toLocaleString()} salary.`,
        ottWarning: true,
        ottMessage: 'Consider reviewing your active subscriptions to optimize spending.'
      }
    });
    setLoading(false);
  }, []);

  const handleAddQuickReminder = () => {
    router.push('/dashboard/reminders');
  };

  if (loading) {
    return <div>Loading your financial intelligence...</div>;
  }

  const handleSaveSalary = (e) => {
    e.preventDefault();
    if (!inputSalary) return;
    localStorage.setItem('lifesync_salary', inputSalary);
    window.location.reload(); 
  };

  if (!salaryReady) {
    return (
      <div className={styles.dashboardGrid}>
         <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4rem 2rem', gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>Welcome to LifeSync 🚀</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px' }}>
              Your smart financial dashboard adapts seamlessly to your lifestyle. To generate accurate predictive insights and trajectory warnings, please enter your monthly salary.
            </p>
            <form onSubmit={handleSaveSalary} style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
              <input 
                 type="number" 
                 placeholder="e.g. ₹50,000" 
                 value={inputSalary} 
                 onChange={e => setInputSalary(e.target.value)} 
                 style={{ flex: 1, padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1.2rem' }}
                 required
              />
              <button className="btn-accent" style={{ padding: '0 2rem', fontSize: '1.1rem' }} type="submit">Establish Baseline</button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Expenses (Logged)</div>
          <div className={styles.statValue}>₹ {data.totalExpenses.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Upcoming Unpaid Bills</div>
          <div className={`${styles.statValue} ${styles.itemAmountDue}`}>{data.upcomingBills}</div>
        </div>
        <div className={`${styles.statCard} ${data.insights.overspending ? styles.warning : styles.safe}`}>
          <div className={styles.statLabel}>Monthly Status</div>
          <div className={styles.statValue} style={{ fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: '600', color: data.insights.overspending ? 'var(--accent-coral)' : '#38A169' }}>
            {data.insights.overspending ? 'Over Budget Tip' : 'On Track'}
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div>
          <h2 className={styles.sectionTitle}>Smart Insights</h2>
          {data.insights.overspending && (
            <div className={`${styles.insightCard} ${styles.alert}`}>
               <span>⚠️</span>
               <div>
                 <strong>Warning: </strong>
                 {data.insights.message}
               </div>
            </div>
          )}
          {data.insights.ottWarning && (
            <div className={styles.insightCard}>
               <span>💡</span>
               <div>
                 <strong>Tip: </strong>
                 {data.insights.ottMessage}
               </div>
            </div>
          )}

          <h2 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Dynamic Expense Trajectory</h2>
          <div className={styles.card} style={{ borderTop: '4px solid var(--primary-charcoal)' }}>
            <div className={styles.chartContainer}>
               {/* Pure CSS Dynamic Chart based on Salary instead of static 20000 limit */}
               <div className={styles.chartBarWrapper}>
                 <div className={styles.chartBar} style={{ height: `${Math.max(10, Math.min(100, (data.totalExpenses / Math.max(data.salary, 1)) * 40))}%` }} data-value="Wk 1"></div>
                 <div className={styles.chartLabel}>Week 1</div>
               </div>
               <div className={styles.chartBarWrapper}>
                 <div className={styles.chartBar} style={{ height: `${Math.max(20, Math.min(100, (data.totalExpenses / Math.max(data.salary, 1)) * 65))}%` }} data-value="Wk 2"></div>
                 <div className={styles.chartLabel}>Week 2</div>
               </div>
               <div className={styles.chartBarWrapper}>
                 <div className={styles.chartBar} style={{ height: `${Math.max(30, Math.min(100, (data.totalExpenses / Math.max(data.salary, 1)) * 90))}%`, backgroundColor: data.insights.overspending ? 'var(--accent-coral)' : 'var(--primary-navy)' }} data-value="Wk 3"></div>
                 <div className={styles.chartLabel}>Week 3</div>
               </div>
               <div className={styles.chartBarWrapper}>
                 <div className={styles.chartBar} style={{ height: '30%', backgroundColor: '#E2E8F0' }} data-value="Est. Wk 4"></div>
                 <div className={styles.chartLabel}>Week 4 (Est)</div>
               </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>Upcoming Reminders</h2>
          <div className={styles.card}>
            {data.reminders.length === 0 ? (
              <p style={{ color: '#718096' }}>No upcoming bills.</p>
            ) : (
              data.reminders.map(reminder => (
                <div key={reminder.id} className={styles.listItem}>
                  <div className={styles.itemInfo}>
                    <h4 style={{ color: 'var(--primary-charcoal)', fontWeight: '700' }}>{reminder.title}</h4>
                    <p>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className={`${styles.itemAmount} ${styles.due}`} style={{ fontSize: '1.1rem' }}>
                    ₹ {reminder.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
            <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', background: 'var(--primary-navy)' }} onClick={handleAddQuickReminder}>
              Manage Actions
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
