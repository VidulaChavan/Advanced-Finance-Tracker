'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Basic Auth Check for client side
    const userId = localStorage.getItem('lifesync_user_id');
    const name = localStorage.getItem('lifesync_user_name');
    
    if (!userId) {
      router.push('/login');
    } else {
      setUserName(name || 'User');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('lifesync_user_id');
    localStorage.removeItem('lifesync_user_name');
    router.push('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="LifeSync Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          LifeSync
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navLink} ${pathname === '/dashboard' ? styles.navLinkActive : ''}`}>
            Dashboard
          </Link>
          <Link href="/dashboard/expenses" className={`${styles.navLink} ${pathname === '/dashboard/expenses' ? styles.navLinkActive : ''}`}>
            Expenses
          </Link>
          <Link href="/dashboard/subscriptions" className={`${styles.navLink} ${pathname === '/dashboard/subscriptions' ? styles.navLinkActive : ''}`}>
            Subscriptions
          </Link>
          <Link href="/dashboard/reminders" className={`${styles.navLink} ${pathname === '/dashboard/reminders' ? styles.navLinkActive : ''}`}>
            Reminders
          </Link>
          <Link href="/dashboard/investments" className={`${styles.navLink} ${pathname === '/dashboard/investments' ? styles.navLinkActive : ''}`}>
            Investments
          </Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.greeting}>
            <h1>Hello, {userName}</h1>
            <p>Here's what's happening with your money today.</p>
          </div>
          <div className={styles.userProfile}>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
