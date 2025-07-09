'use client';

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import Spinner from '../../../components/Spinner';

interface HomeContentItem {
  id: number;
  section_name: string;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

export default function AdminHomeContent() {
  const [homeContent, setHomeContent] = useState<HomeContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<HomeContentItem | null>(null);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/home');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: HomeContentItem[] = await response.json();
      setHomeContent(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const response = await fetch('/api/home', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingItem(null);
      fetchHomeContent(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Contenido del Home</h1>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Contenido del Home</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gestionar Contenido del Home</h1>

      {editingItem ? (
        <form onSubmit={handleUpdateItem} className={styles.form}>
          <h2>Editar: {editingItem.section_name}</h2>
          {editingItem.section_name === 'hero_title' || editingItem.section_name === 'hero_subtitle' || editingItem.section_name === 'about_me' ? (
            <textarea
              name="content"
              placeholder="Contenido"
              value={editingItem.content || ''}
              onChange={handleInputChange}
              rows={5}
            ></textarea>
          ) : editingItem.section_name === 'hero_image' ? (
            <input
              type="text"
              name="imageUrl"
              placeholder="URL de la Imagen"
              value={editingItem.imageUrl || ''}
              onChange={handleInputChange}
            />
          ) : editingItem.section_name === 'hero_video' ? (
            <input
              type="text"
              name="videoUrl"
              placeholder="URL del Video (YouTube Embed)"
              value={editingItem.videoUrl || ''}
              onChange={handleInputChange}
            />
          ) : null}
          <button type="submit" className={styles.button}>Actualizar Contenido</button>
          <button type="button" onClick={() => setEditingItem(null)} className={styles.button}>Cancelar</button>
        </form>
      ) : (
        <ul className={styles.list}>
          {homeContent.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <h3>{item.section_name}</h3>
              {item.content && <p>{item.content}</p>}
              {item.imageUrl && <p>Imagen: {item.imageUrl}</p>}
              {item.videoUrl && <p>Video: {item.videoUrl}</p>}
              <button onClick={() => setEditingItem(item)} className={styles.button}>Editar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}