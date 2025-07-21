import styles from "./LoadingSkeleton.module.css";

export const LoadingSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className={styles.container}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLineShort}></div>
          </div>
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonButton}></div>
            <div className={styles.skeletonButton}></div>
          </div>
        </div>
      ))}
    </div>
  );
};
