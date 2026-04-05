'use client';
import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newInv, setNewInv] = useState({ 
    assetName: '', 
    assetType: 'Mutual Fund', 
    investedAmount: '', 
    currentValue: '',
    date: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    const saved = localStorage.getItem('lifesync_investments');
    if (saved) {
      setInvestments(JSON.parse(saved));
      setLoading(false);
    } else {
      // Mock data for new users to demonstrate the UI
      const defaults = [
        { id: 1, assetName: 'NIFTY 50 Index Fund', assetType: 'Mutual Fund', investedAmount: 50000, currentValue: 56000, date: '2025-01-10' },
        { id: 2, assetName: 'Reliance Industries', assetType: 'Stock', investedAmount: 25000, currentValue: 28500, date: '2025-06-15' },
        { id: 3, assetName: 'HDFC Bank', assetType: 'Stock', investedAmount: 40000, currentValue: 38000, date: '2025-08-01' },
        { id: 4, assetName: 'Bitcoin', assetType: 'Crypto', investedAmount: 15000, currentValue: 22000, date: '2025-11-20' }
      ];
      setInvestments(defaults);
      localStorage.setItem('lifesync_investments', JSON.stringify(defaults));
      setLoading(false);
    }
  }, []);

  const handleAddInvestment = (e) => {
    e.preventDefault();
    if (!newInv.assetName || !newInv.investedAmount || !newInv.currentValue) return;
    
    const added = {
      id: Date.now(),
      assetName: newInv.assetName,
      assetType: newInv.assetType,
      investedAmount: parseFloat(newInv.investedAmount),
      currentValue: parseFloat(newInv.currentValue),
      date: newInv.date
    };
    
    const updated = [added, ...investments];
    setInvestments(updated);
    localStorage.setItem('lifesync_investments', JSON.stringify(updated));
    
    setShowAddForm(false);
    setNewInv({ assetName: '', assetType: 'Mutual Fund', investedAmount: '', currentValue: '', date: new Date().toISOString().split('T')[0] });
  };

  const removeInvestment = (id) => {
    const updated = investments.filter(inv => inv.id !== id);
    setInvestments(updated);
    localStorage.setItem('lifesync_investments', JSON.stringify(updated));
  };

  // Calculations
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfitLoss = totalCurrent - totalInvested;
  const isProfit = totalProfitLoss >= 0;
  const percentageReturn = totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) : 0;

  // Breakdown by Type
  const allocation = investments.reduce((acc, inv) => {
    acc[inv.assetType] = (acc[inv.assetType] || 0) + inv.currentValue;
    return acc;
  }, {});

  const typeColors = {
    'Stock': '#1C2541', // Charcoal
    'Mutual Fund': '#D4AF37', // Gold
    'Crypto': '#FF7F50', // Coral
    'Other': '#CBD5E1'
  };

  let currentAngle = 0;
  const pieSlices = Object.entries(allocation).map(([type, value]) => {
    if (totalCurrent === 0) return '';
    const percentage = (value / totalCurrent) * 100;
    const sliceStr = `${typeColors[type] || '#CBD5E1'} ${currentAngle}% ${currentAngle + percentage}%`;
    currentAngle += percentage;
    return sliceStr;
  }).join(', ');

  return (
    <>
      <div className={styles.topbar} style={{ marginBottom: '1rem' }}>
        <h1 className={styles.sectionTitle} style={{ margin: 0 }}>Wealth & Investments</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Asset'}
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--primary-charcoal)' }}>
          <div className={styles.statLabel}>Total Invested</div>
          <div className={styles.statValue}>₹ {totalInvested.toLocaleString()}</div>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--primary-navy)' }}>
          <div className={styles.statLabel}>Current Portfolio Value</div>
          <div className={styles.statValue}>₹ {totalCurrent.toLocaleString()}</div>
        </div>
        <div className={`${styles.statCard} ${isProfit ? styles.safe : styles.warning}`}>
          <div className={styles.statLabel}>Total Returns</div>
          <div className={styles.statValue} style={{ fontSize: '1.4rem', color: isProfit ? '#38A169' : 'var(--accent-coral)' }}>
            {isProfit ? '+' : ''}{totalProfitLoss > 0 ? '₹ ' + totalProfitLoss.toLocaleString() : '-₹ ' + Math.abs(totalProfitLoss).toLocaleString()} 
            <span style={{ fontSize: '1rem', marginLeft: '0.5rem', fontWeight: 'bold' }}>
              ({isProfit ? '+' : ''}{percentageReturn}%)
            </span>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid} style={{ marginBottom: '2rem' }}>
         <div className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--primary-charcoal)', marginBottom: '1rem' }}>Asset Allocation</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {Object.entries(allocation).map(([type, value]) => (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: typeColors[type] || '#CBD5E1' }}></span>
                      <span style={{ flex: 1, color: 'var(--text-muted)' }}>{type}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-navy)' }}>
                        {((value / totalCurrent) * 100).toFixed(1)}%
                      </span>
                    </div>
                 ))}
                 {totalCurrent === 0 && <span style={{ color: 'var(--text-muted)' }}>No allocation data.</span>}
              </div>
           </div>
           
           <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: '180px', height: '180px', borderRadius: '50%',
                background: totalCurrent > 0 ? `conic-gradient(${pieSlices})` : '#E2E8F0',
                boxShadow: 'var(--shadow-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}>
                 <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assets</span>
                   <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-charcoal)' }}>{investments.length}</span>
                 </div>
              </div>
           </div>
        </div>

        {showAddForm ? (
          <div className={styles.card} style={{ animation: 'fadeIn 0.3s ease', borderTop: '4px solid var(--accent-gold)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-navy)' }}>Log New Investment</h3>
            <form onSubmit={handleAddInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Asset Name</label>
                <input type="text" value={newInv.assetName} onChange={e => setNewInv({...newInv, assetName: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Invested Amount (₹)</label>
                  <input type="number" value={newInv.investedAmount} onChange={e => setNewInv({...newInv, investedAmount: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Current Value (₹)</label>
                  <input type="number" value={newInv.currentValue} onChange={e => setNewInv({...newInv, currentValue: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Asset Type</label>
                  <select value={newInv.assetType} onChange={e => setNewInv({...newInv, assetType: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                    <option>Stock</option>
                    <option>Mutual Fund</option>
                    <option>Crypto</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Date</label>
                  <input type="date" value={newInv.date} onChange={e => setNewInv({...newInv, date: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} required />
                </div>
              </div>
              <button type="submit" className="btn-accent" style={{ padding: '0.75rem 1rem', marginTop: '0.5rem' }}>Save Asset</button>
            </form>
          </div>
        ) : (
          <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-navy)', color: 'white', textAlign: 'center' }}>
             <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Grow Your Wealth</h3>
             <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '1rem' }}>Tracking your portfolio helps you visualize your progress towards financial freedom.</p>
             <div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
                <span style={{ fontSize: '0.85rem' }}>Portfolio Diversity </span>
                <span style={{ fontWeight: 'bold' }}>{Object.keys(allocation).length} Asset Classes</span>
             </div>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Your Holdings</h2>
        
        {loading ? (
          <p>Loading portfolio...</p>
        ) : investments.length === 0 ? (
          <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>No investments tracked yet. Start building your portfolio above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {investments.map(inv => {
              const profit = inv.currentValue - inv.investedAmount;
              const isGain = profit >= 0;
              const percent = ((profit / inv.investedAmount) * 100).toFixed(1);

              return (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} className={styles.hoverLift}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: typeColors[inv.assetType] || '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {inv.assetType.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--primary-navy)', fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{inv.assetName}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                        {inv.assetType} • Added {new Date(inv.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>Invested</div>
                      <div style={{ fontWeight: '600' }}>₹ {inv.investedAmount.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>Current</div>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-charcoal)', fontSize: '1.1rem' }}>₹ {inv.currentValue.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <div style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: isGain ? '#C6F6D5' : '#FED7D7', color: isGain ? '#22543D' : '#9B2C2C', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {isGain ? '▲' : '▼'} {Math.abs(percent)}%
                      </div>
                    </div>
                    <button onClick={() => removeInvestment(inv.id)} style={{ color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', background: 'none', border: 'none' }} title="Remove Asset">×</button>
                  </div>
                </div>
              );
            })}
          </div>
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
