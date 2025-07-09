import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">Alx.is.dev</Link>
      </div>
      <ul className={styles.links}>
        <li><Link href="/"><i className="fas fa-home"></i></Link></li>
        <li><Link href="/proyectos"><i className="fas fa-code"></i></Link></li>
        <li><Link href="/experiencia"><i className="fas fa-briefcase"></i></Link></li>
        <li><Link href="/blog"><i className="fas fa-blog"></i></Link></li>
        <li><Link href="/foro"><i className="fas fa-comments"></i></Link></li>
        <li><Link href="/contacto"><i className="fas fa-envelope"></i></Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
