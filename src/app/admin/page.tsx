'use client';

import React from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Panel de Administración</h1>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <Link href="/admin/projects">
              Gestionar Proyectos
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/admin/blog">
              Gestionar Blog
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/admin/experience">
              Gestionar Experiencia
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/admin/forum">
              Gestionar Foro
            </Link>
          </li>
          <li className={styles.listItem}>
            <Link href="/admin/contact">
              Ver Mensajes de Contacto
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
