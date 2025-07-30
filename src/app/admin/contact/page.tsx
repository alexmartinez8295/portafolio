'use client';

import React, { useEffect, useState } from 'react';
import styles from '../admin.module.css';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

export default function AdminContact() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ContactMessage[] = await response.json();
      setMessages(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id: number) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchMessages(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Mensajes de Contacto</h1>
        <p>Cargando mensajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Mensajes de Contacto</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Mensajes de Contacto</h1>
      {
        messages.length === 0 ? (
          <p>No hay mensajes de contacto.</p>
        ) : (
          <ul className={styles.list}>
            {messages.map((message) => (
              <li key={message.id} className={styles.listItem}>
                <h3>De: {message.name} ({message.email})</h3>
                <p>Fecha: {message.date}</p>
                <p>{message.message}</p>
                <button onClick={() => handleDeleteMessage(message.id)} className={styles.button}>Eliminar</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}
