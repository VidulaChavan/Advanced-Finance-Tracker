'use client';
import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', amount: '', dueDate: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const saved = localStorage.getItem('lifesync_reminders');
    if (saved) {
      setReminders(JSON.parse(saved));
      setLoading(false);
    } else {
      const defaults = [
        { id: 1, title: 'Electricity Bill', amount: 1500, dueDate: '2026-04-05', isPaid: false },
        { id: 2, title: 'Internet (Airtel)', amount: 999, dueDate: '2026-04-10', isPaid: false },
        { id: 3, title: 'Credit Card (HDFC)', amount: 12400, dueDate: '2026-04-15', isPaid: false },
        { id: 4, title: 'Water Bill', amount: 450, dueDate: '2026-03-10', isPaid: true }
      ];
      setReminders(defaults);
      localStorage.setItem('lifesync_reminders', JSON.stringify(defaults));
      setLoading(false);
    }
  }, []);

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.amount) return;
    
    const added = {
      id: Date.now(),
      title: newReminder.title,
      amount: parseFloat(newReminder.amount),
      dueDate: newReminder.dueDate,
      isPaid: false
    };
    
    const updated = [added, ...reminders].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
    setReminders(updated);
    localStorage.setItem('lifesync_reminders', JSON.stringify(updated));
    
    setShowAddForm(false);
    setNewReminder({ title: '', amount: '', dueDate: new Date().toISOString().split('T')[0] });
  };

  const markAsPaid = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, isPaid: true } : r);
    setReminders(updated);
    localStorage.setItem('lifesync_reminders', JSON.stringify(updated));
  };

  return (
    <>
      <div className={styles.topbar} style={{ marginBottom: '1rem' }}>
        <h1 className={styles.sectionTitle} style={{ margin: 0 }}>Smart Reminders</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Custom Reminder'}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.card} style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease', borderTop: '4px solid var(--accent-gold)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-navy)' }}>Schedule a Reminder</h3>
          <form onSubmit={handleAddReminder} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Title</label>
              <input type="text" value={newReminder.title} onChange={e => setNewReminder({...newReminder, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required placeholder="e.g. Loan EMI" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Amount (₹)</label>
              <input type="number" value={newReminder.amount} onChange={e => setNewReminder({...newReminder, amount: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Due Date</label>
              <input type="date" value={newReminder.dueDate} onChange={e => setNewReminder({...newReminder, dueDate: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
            </div>
            <button type="submit" className="btn-accent" style={{ padding: '0.5rem 1rem' }}>Add</button>
          </form>
        </div>
      )}

      <div className={styles.card}>
        {loading ? <p>Loading reminders...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reminders.map(reminder => (
              <div key={reminder.id} className={styles.listItem} style={{ opacity: reminder.isPaid ? 0.6 : 1, transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: reminder.isPaid ? '#C6F6D5' : '#FED7D7', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: reminder.isPaid ? '#22543D' : '#C53030',
                    fontWeight: 'bold', fontSize: '1.2rem',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {reminder.isPaid ? '✓' : '!'}
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 style={{ textDecoration: reminder.isPaid ? 'line-through' : 'none', color: 'var(--primary-charcoal)', fontSize: '1.1rem' }}>{reminder.title}</h4>
                    <p style={{ fontWeight: '600' }}>Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div className={`${styles.itemAmount} ${!reminder.isPaid ? styles.due : ''}`} style={{ fontSize: '1.2rem' }}>
                    ₹ {reminder.amount.toLocaleString()}
                  </div>
                  {!reminder.isPaid ? (
                    <button className="btn-accent" onClick={() => markAsPaid(reminder.id)} style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}>
                      Mark Paid
                    </button>
                  ) : (
                    <span style={{ color: '#38A169', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{background: '#C6F6D5', padding: '0.2rem 0.6rem', borderRadius: '12px'}}>Paid</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            {reminders.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No reminders set. Add above.</p>}
          </div>
        )}
      </div>
    </>
  );
}
