import styles from './StatsDisplay.module.css';

interface StatsDisplayProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  errorRate: number;
  showSpeed?: boolean;
}

export function StatsDisplay({ wpm, cpm, accuracy, errorRate, showSpeed = true }: StatsDisplayProps) {
  return (
    <div className={styles.container}>
      {showSpeed && (
        <>
          <div className={styles.stat}>
            <span className={styles.value}>{cpm}</span>
            <span className={styles.label}>타/분</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.value}>{wpm}</span>
            <span className={styles.label}>WPM</span>
          </div>
          <div className={styles.divider} />
        </>
      )}
      <div className={styles.stat}>
        <span className={`${styles.value} ${styles.success}`}>{accuracy}%</span>
        <span className={styles.label}>정확도</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={`${styles.value} ${errorRate > 10 ? styles.error : styles.warning}`}>
          {errorRate}%
        </span>
        <span className={styles.label}>오타율</span>
      </div>
    </div>
  );
}
