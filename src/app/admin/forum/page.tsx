'use client';

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function AdminForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: '',
    date: '',
  });
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);

  const fetchPosts = async () => {
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
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingPost) {
      setEditingPost({ ...editingPost, [name]: value });
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewPost({ title: '', content: '', author: '', date: '', });
      fetchPosts(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEditClick = (post: ForumPost) => {
    setEditingPost(post);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    try {
      const response = await fetch('/api/forum', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPost),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingPost(null);
      fetchPosts(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      const response = await fetch('/api/forum', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchPosts(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Foro</h1>
        <p>Cargando posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Foro</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gestionar Foro</h1>

      <h2 className={styles.heading}>{editingPost ? 'Editar Post' : 'Agregar Nuevo Post'}</h2>
      <form onSubmit={editingPost ? handleUpdatePost : handleAddPost} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={editingPost ? editingPost.title : newPost.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="content"
          placeholder="Contenido"
          value={editingPost ? editingPost.content : newPost.content}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="text"
          name="author"
          placeholder="Autor"
          value={editingPost ? editingPost.author : newPost.author}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="date"
          placeholder="Fecha (YYYY-MM-DD HH:MM:SS)"
          value={editingPost ? editingPost.date : newPost.date}
          onChange={handleInputChange}
        />
        <button type="submit" className={styles.button}>{editingPost ? 'Actualizar Post' : 'Agregar Post'}</button>
        {editingPost && <button type="button" onClick={() => setEditingPost(null)} className={styles.button}>Cancelar</button>}
      </form>

      <h2 className={styles.heading}>Posts Existentes</h2>
      {
        posts.length === 0 ? (
          <p>No hay posts disponibles.</p>
        ) : (
          <ul className={styles.list}>
            {posts.map((post) => (
              <li key={post.id} className={styles.listItem}>
                <h3>{post.title}</h3>
                <p>Autor: {post.author} - Fecha: {post.date}</p>
                <p>{post.content}</p>
                <button onClick={() => handleEditClick(post)} className={styles.button}>Editar</button>
                <button onClick={() => handleDeletePost(post.id)} className={styles.button}>Eliminar</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
