'use client';

import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import styles from '../admin/admin.module.css'; // Reusing admin styles

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export default function Experiencia() {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const response = await fetch('/api/experience');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ExperienceItem[] = await response.json();
        setExperience(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExperience();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Experiencia</h1>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Experiencia</h1>
        <p className={styles.error}>Error al cargar la experiencia: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Experiencia</h1>
      {
        experience.length === 0 ? (
          <p>No hay experiencia disponible.</p>
        ) : (
          <ul className={styles.list}>
            {experience.map((item) => (
              <li key={item.id} className={styles.listItem}>
                <h2>{item.title} en {item.company}</h2>
                <p>{item.startDate} - {item.endDate}</p>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
