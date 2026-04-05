'use client';
import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });

  // Load from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem('lifesync_expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
      setLoading(false);
    } else {
      const defaults = [
        { id: 1, title: 'Groceries (Reliance Fresh)', amount: 4500, category: 'Food', date: '2026-03-24' },
        { id: 2, title: 'Uber to Office', amount: 350, category: 'Transport', date: '2026-03-23' },
        { id: 3, title: 'Netflix & Spotify', amount: 800, category: 'Entertainment', date: '2026-03-22' }
      ];
      setExpenses(defaults);
      localStorage.setItem('lifesync_expenses', JSON.stringify(defaults));
      setLoading(false);
    }
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    
    const added = {
      id: Date.now(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date
    };
    
    const updated = [added, ...expenses];
    setExpenses(updated);
    localStorage.setItem('lifesync_expenses', JSON.stringify(updated));
    
    setShowAddForm(false);
    setNewExpense({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  };

  // Calculate stats for Pie Chart
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Simple colors mapping
  const categoryColors = {
    'Food': '#FF7F50',
    'Transport': '#D4AF37',
    'Entertainment': '#1C2541',
    'Bills': '#38A169',
    'Shopping': '#805AD5',
    'Other': '#CBD5E1'
  };

  // Generate CSS conic-gradient string
  let currentAngle = 0;
  const pieSlices = Object.entries(categoryTotals).map(([cat, amt]) => {
    if (totalAmount === 0) return '';
    const percentage = (amt / totalAmount) * 100;
    const sliceStr = `${categoryColors[cat] || '#CBD5E1'} ${currentAngle}% ${currentAngle + percentage}%`;
    currentAngle += percentage;
    return sliceStr;
  }).join(', ');

  return (
    <>
      <div className={styles.topbar} style={{ marginBottom: '1rem' }}>
        <h1 className={styles.sectionTitle} style={{ margin: 0 }}>Expense Tracking</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      <div className={styles.dashboardGrid} style={{ marginBottom: '2rem' }}>
        <div className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--primary-charcoal)', marginBottom: '1rem' }}>Category Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {Object.entries(categoryTotals).map(([cat, amt]) => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: categoryColors[cat] || '#CBD5E1' }}></span>
                      <span style={{ flex: 1, color: 'var(--text-muted)' }}>{cat}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-navy)' }}>₹ {amt.toLocaleString()}</span>
                    </div>
                 ))}
                 {totalAmount === 0 && <span style={{ color: 'var(--text-muted)' }}>No data to display.</span>}
              </div>
           </div>
           
           <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: '180px', height: '180px', borderRadius: '50%',
                background: totalAmount > 0 ? `conic-gradient(${pieSlices})` : '#E2E8F0',
                boxShadow: 'var(--shadow-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}>
                 {/* Donut hole for premium look */}
                 <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</span>
                   <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-charcoal)' }}>₹{totalAmount > 1000 ? (totalAmount/1000).toFixed(1) + 'k' : totalAmount}</span>
                 </div>
              </div>
           </div>
        </div>

        {showAddForm ? (
          <div className={styles.card} style={{ animation: 'fadeIn 0.3s ease', borderTop: '4px solid var(--accent-gold)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-navy)' }}>Log New Expense</h3>
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Title</label>
                <input type="text" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Amount (₹)</label>
                  <input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Date</label>
                  <input type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Category</label>
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Entertainment</option>
                  <option>Bills</option>
                  <option>Shopping</option>
                  <option>Other</option>
                </select>
              </div>
              <button type="submit" className="btn-accent" style={{ padding: '0.75rem 1rem', marginTop: '0.5rem' }}>Save Expense</button>
            </form>
          </div>
        ) : (
          <div className={styles.card} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-navy)', color: 'white', textAlign: 'center' }}>
             <div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Take Control</h3>
                <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Logging expenses daily builds the foundation for long-term wealth.</p>
             </div>
          </div>
        )}
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>No expenses logged yet. Start tracking above!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: '#718096' }}>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '1rem', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: '600', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }} className={styles.hoverLift}>
                  <td style={{ padding: '1rem' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--primary-navy)' }}>{exp.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: '#E2E8F0', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: categoryColors[exp.category] || '#CBD5E1', marginRight: '6px' }}></span>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>₹ {exp.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
