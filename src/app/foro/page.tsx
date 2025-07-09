'use client';

import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import styles from '../admin/admin.module.css'; // Reusing admin styles

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function Foro() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/forum');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ForumPost[] = await response.json();
        setPosts(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Foro</h1>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Foro</h1>
        <p className={styles.error}>Error al cargar los posts: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Foro</h1>
      {
        posts.length === 0 ? (
          <p>No hay posts disponibles.</p>
        ) : (
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.id} className={styles.listItem}>
                <h2>{post.title}</h2>
                <p>Autor: {post.author} - Fecha: {post.date}</p>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
