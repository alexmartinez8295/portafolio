'use client';

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  startDate: date;
  endDate: date;
  description: string;
}

export default function AdminExperience() {
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);

  const fetchExperience = async () => {
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
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewItem({ title: '', company: '', startDate: '', endDate: '', description: '' });
      fetchExperience(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEditClick = (item: ExperienceItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const response = await fetch('/api/experience', {
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
      fetchExperience(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch('/api/experience', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchExperience(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Experiencia</h1>
        <p>Cargando experiencia...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Gestionar Experiencia</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Gestionar Experiencia</h1>

      <h2 className={styles.heading}>{editingItem ? 'Editar Elemento de Experiencia' : 'Agregar Nuevo Elemento de Experiencia'}</h2>
      <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Título del Puesto"
          value={editingItem ? editingItem.title : newItem.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Empresa"
          value={editingItem ? editingItem.company : newItem.company}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="startDate"
          placeholder="Fecha de Inicio (YYYY-MM-DD)"
          value={editingItem ? editingItem.startDate : newItem.startDate}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="Fecha de Fin (YYYY-MM-DD o 'Presente')"
          value={editingItem ? editingItem.endDate : newItem.endDate}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={editingItem ? editingItem.description : newItem.description}
          onChange={handleInputChange}
        ></textarea>
        <button type="submit" className={styles.button}>{editingItem ? 'Actualizar Experiencia' : 'Agregar Experiencia'}</button>
        {editingItem && <button type="button" onClick={() => setEditingItem(null)} className={styles.button}>Cancelar</button>}
      </form>

      <h2 className={styles.heading}>Experiencia Existente</h2>
      {
        experience.length === 0 ? (
          <p>No hay elementos de experiencia disponibles.</p>
        ) : (
          <ul className={styles.list}>
            {experience.map((item) => (
              <li key={item.id} className={styles.listItem}>
                <h3>{item.title} en {item.company}</h3>
                <p>{item.startDate} - {item.endDate}</p>
                <p>{item.description}</p>
                <button onClick={() => handleEditClick(item)} className={styles.button}>Editar</button>
                <button onClick={() => handleDeleteItem(item.id)} className={styles.button}>Eliminar</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}