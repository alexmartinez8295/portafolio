import styles from '../../styles/Page.module.css';

export default function Blog() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi Blog</h1>
      <p>Aquí se mostrarán las entradas de mi blog.</p>
    </div>
  );
}
