// app/page.js
import Link from 'next/link';
import styles from './home.module.scss';
import Layout from './components/Layout';

export default function Home() {
  return (
<Layout>
    <div className={styles.container}>
      <h1>Welcome to Our Website</h1>
      <div className={styles.buttonContainer}>
        <Link href="/auth">
          <button className={styles.button}>Login</button>
        </Link>
        {/*<Link href="/auth/register">
          <button className={styles.button}>Register</button>
        </Link> */}
        <Link href="/drumplayer">
          <button className={styles.button}>Drum Player</button>
        </Link>
      </div>
    </div>
</Layout>
  );
}
