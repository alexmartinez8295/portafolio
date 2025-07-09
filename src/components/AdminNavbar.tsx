'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../app/admin/admin.module.css'; // Reutilizamos los estilos del módulo admin

export default function AdminNavbar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <Link href="/admin">
            Dashboard
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/admin/home">
            Gestionar Home
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/admin/projects">
            Proyectos
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/admin/blog">
            Blog
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/admin/experience">
            Experiencia
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/admin/forum">
            Foro
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href="/admin/contact">
            Contacto
          </Link>
        </li>
      </ul>
    </nav>
  );
}
