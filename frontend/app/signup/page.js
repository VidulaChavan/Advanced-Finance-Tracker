'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength++;
    if (pass.length > 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = calculateStrength(formData.password);
  let strengthClass = '';
  let strengthLabel = 'Weak';
  if (formData.password.length > 0) {
    if (strength <= 2) { strengthClass = styles.strengthWeak; strengthLabel = 'Weak'; }
    else if (strength <= 4) { strengthClass = styles.strengthMedium; strengthLabel = 'Medium'; }
    else { strengthClass = styles.strengthStrong; strengthLabel = 'Strong'; }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="LifeSync Logo" style={{ width: '64px', height: '64px', borderRadius: '12px' }} />
        </div>
        <h1 className={styles.authTitle}>Join LifeSync</h1>
        <p className={styles.authSubtitle}>Start your journey to financial clarity.</p>

        {error && <div className={styles.errorMsg} style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div className={styles.successMsg}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              className={styles.input} 
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className={styles.input} 
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
            <button 
              type="button" 
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {formData.password && (
              <>
                <div className={styles.passwordStrength}>
                  <div className={`${styles.strengthBar} ${strength >= 1 ? strengthClass : ''}`}></div>
                  <div className={`${styles.strengthBar} ${strength >= 3 ? strengthClass : ''}`}></div>
                  <div className={`${styles.strengthBar} ${strength >= 5 ? strengthClass : ''}`}></div>
                </div>
                <div className={styles.strengthText}>{strengthLabel} password</div>
              </>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="terms" 
              className={styles.checkbox}
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms" className={styles.checkboxLabel}>
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading || success}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.switchAuth}>
          Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
