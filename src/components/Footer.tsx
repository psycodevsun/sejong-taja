import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <span className={styles.logo}>을지타자연습</span>
          <span className={styles.tagline}>한글 타자 연습의 정석</span>
        </div>

        <div className={styles.company}>
          <a
            href="https://www.softmoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.companyLink}
          >
            주식회사 소프트모아
          </a>
          <span className={styles.divider}>|</span>
          <a href="mailto:support@softmoa.com" className={styles.email}>
            support@softmoa.com
          </a>
        </div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Softmoa Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
