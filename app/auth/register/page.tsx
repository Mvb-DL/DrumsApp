// app/auth/register/page.js
import Link from 'next/link';
import styles from './register.module.scss';

export default function Register() {
  return (
    <div className={styles.container}>
      <h1>Register Page</h1>
      <form className={styles.form}>
        <input type="text" placeholder="First Name" className={styles.input} />
        <input type="text" placeholder="Last Name" className={styles.input} />
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />
        <button type="submit" className={styles.button}>Register</button>
      </form>
      <div className={styles.backLink}>
        <Link href="/">
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
