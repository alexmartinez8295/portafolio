'use client';

import { Roboto_Mono } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});


interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingProject) {
      setEditingProject({ ...editingProject, [name]: value });
    } else {
      setNewProject({ ...newProject, [name]: value });
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewProject({ title: '', description: '', imageUrl: '', projectUrl: '' });
      fetchProjects(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProject),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingProject(null);
      fetchProjects(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchProjects(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Proyectos</h1>
        <p>Cargando proyectos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Proyectos</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gestionar Proyectos</h1>

      <h2 className={styles.heading}>{editingProject ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}</h2>
      <form onSubmit={editingProject ? handleUpdateProject : handleAddProject} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={editingProject ? editingProject.title : newProject.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={editingProject ? editingProject.description : newProject.description}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="text"
          name="imageUrl"
          placeholder="URL de la Imagen"
          value={editingProject ? editingProject.imageUrl : newProject.imageUrl}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="projectUrl"
          placeholder="URL del Proyecto"
          value={editingProject ? editingProject.projectUrl : newProject.projectUrl}
          onChange={handleInputChange}
        />
        <button type="submit" className={styles.button}>{editingProject ? 'Actualizar Proyecto' : 'Agregar Proyecto'}</button>
        {editingProject && <button type="button" onClick={() => setEditingProject(null)} className={styles.button}>Cancelar</button>}
      </form>

      <h2 className={styles.heading}>Proyectos Existentes</h2>
      {
        projects.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <ul className={styles.list}>
            {projects.map((project) => (
              <li key={project.id} className={styles.listItem}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button onClick={() => handleEditClick(project)} className={styles.button}>Editar</button>
                <button onClick={() => handleDeleteProject(project.id)} className={styles.button}>Eliminar</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
