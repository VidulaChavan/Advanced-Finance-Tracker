'use client';
import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', amount: '', billingCycle: 'Monthly', nextBilling: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const saved = localStorage.getItem('lifesync_subscriptions');
    if (saved) {
      setSubs(JSON.parse(saved));
      setLoading(false);
    } else {
      const defaults = [
        { id: 1, name: 'Netflix Premium', amount: 649, billingCycle: 'Monthly', nextBilling: '2026-04-12', status: 'Active' },
        { id: 2, name: 'Amazon Prime', amount: 1499, billingCycle: 'Yearly', nextBilling: '2026-11-20', status: 'Active' },
        { id: 3, name: 'Spotify Premium', amount: 119, billingCycle: 'Monthly', nextBilling: '2026-04-05', status: 'Active' },
        { id: 4, name: 'Gym Membership', amount: 2500, billingCycle: 'Monthly', nextBilling: '2026-04-01', status: 'Canceled' }
      ];
      setSubs(defaults);
      localStorage.setItem('lifesync_subscriptions', JSON.stringify(defaults));
      setLoading(false);
    }
  }, []);

  const handleAddSub = (e) => {
    e.preventDefault();
    if (!newSub.name || !newSub.amount) return;
    
    const added = {
      id: Date.now(),
      name: newSub.name,
      amount: parseFloat(newSub.amount),
      billingCycle: newSub.billingCycle,
      nextBilling: newSub.nextBilling,
      status: 'Active'
    };
    
    const updated = [added, ...subs];
    setSubs(updated);
    localStorage.setItem('lifesync_subscriptions', JSON.stringify(updated));
    
    setShowAddForm(false);
    setNewSub({ name: '', amount: '', billingCycle: 'Monthly', nextBilling: new Date().toISOString().split('T')[0] });
  };

  const markStatus = (id, newStatus) => {
    const updated = subs.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setSubs(updated);
    localStorage.setItem('lifesync_subscriptions', JSON.stringify(updated));
  };

  const totalMonthly = subs.filter(s => s.status === 'Active' && s.billingCycle === 'Monthly')
                           .reduce((sum, s) => sum + s.amount, 0);
  const totalYearly = subs.filter(s => s.status === 'Active' && s.billingCycle === 'Yearly')
                           .reduce((sum, s) => sum + s.amount, 0);

  return (
    <>
      <div className={styles.topbar} style={{ marginBottom: '1rem' }}>
        <h1 className={styles.sectionTitle} style={{ margin: 0 }}>Subscription Manager</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Subscription'}
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--primary-charcoal)' }}>
          <div className={styles.statLabel}>Active Monthly Burn</div>
          <div className={styles.statValue}>₹ {totalMonthly.toLocaleString()} <span style={{fontSize: '1rem', color: '#718096', fontWeight: 'normal'}}>/ mo</span></div>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--accent-gold)' }}>
          <div className={styles.statLabel}>Active Yearly Burn</div>
          <div className={styles.statValue}>₹ {totalYearly.toLocaleString()} <span style={{fontSize: '1rem', color: '#718096', fontWeight: 'normal'}}>/ yr</span></div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statLabel}>Action Needed</div>
          <div style={{ fontSize: '1rem', color: 'var(--accent-coral)', marginTop: '0.5rem', fontWeight: '600' }}>
            Identify idle subscriptions and mark them Canceled to optimize flow.
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className={styles.card} style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease', borderTop: '4px solid var(--accent-gold)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-navy)' }}>Track New Subscription</h3>
          <form onSubmit={handleAddSub} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Service Name</label>
              <input type="text" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required placeholder="e.g. Disney+" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Amount (₹)</label>
              <input type="number" value={newSub.amount} onChange={e => setNewSub({...newSub, amount: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Cycle</label>
              <select value={newSub.billingCycle} onChange={e => setNewSub({...newSub, billingCycle: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Next Billing Date</label>
              <input type="date" value={newSub.nextBilling} onChange={e => setNewSub({...newSub, nextBilling: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
            </div>
            <button type="submit" className="btn-accent" style={{ padding: '0.5rem 1rem' }}>Add Service</button>
          </form>
        </div>
      )}

      <div className={styles.dashboardGrid}>
        <div style={{ gridColumn: 'span 2' }}>
          <div className={styles.card}>
            {loading ? <p>Loading subscriptions...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {subs.map(sub => (
                  <div key={sub.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: sub.status === 'Canceled' ? '#F8FAFC' : 'white', opacity: sub.status === 'Canceled' ? 0.7 : 1 }} className={styles.hoverLift}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                       <div>
                         <h3 style={{ color: 'var(--primary-navy)', fontSize: '1.1rem', marginBottom: '0.25rem', textDecoration: sub.status === 'Canceled' ? 'line-through' : 'none' }}>{sub.name}</h3>
                         <span style={{ fontSize: '0.8rem', background: sub.status === 'Active' ? '#C6F6D5' : '#FED7D7', color: sub.status === 'Active' ? '#22543D' : '#742A2A', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>
                           {sub.status}
                         </span>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                         <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-charcoal)' }}>₹ {sub.amount}</div>
                         <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: '600' }}>{sub.billingCycle}</div>
                       </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.9rem', color: '#4A5568', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Next Due: {new Date(sub.nextBilling).toLocaleDateString()}</span>
                      {sub.status === 'Active' ? (
                        <button onClick={() => markStatus(sub.id, 'Canceled')} style={{ color: 'var(--accent-coral)', fontWeight: 'bold', fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: '#FFF5F5', borderRadius: '4px' }}>Stop</button>
                      ) : (
                        <button onClick={() => markStatus(sub.id, 'Active')} style={{ color: '#38A169', fontWeight: 'bold', fontSize: '0.85rem' }}>Reactivate</button>
                      )}
                    </div>
                  </div>
                ))}
                {subs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No subscriptions imported yet.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
