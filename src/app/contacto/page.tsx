'use client';

import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import styles from '../admin/admin.module.css'; // Reutilizamos estilos para consistencia

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, date: new Date().toISOString() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setStatus({ type: 'success', message: '¡Gracias por tu mensaje! Pronto me pondré en contacto contigo.' });
      setFormData({ name: '', email: '', phone: '', message: '' }); // Limpiar formulario
    } catch (error: any) {
      console.error('Error al enviar mensaje:', error);
      setStatus({ type: 'error', message: `Error al enviar mensaje: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Contacto</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        ¿Tienes alguna pregunta, propuesta o simplemente quieres saludar? ¡No dudes en contactarme!
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Tu Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Tu Teléfono (opcional)"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Tu Mensaje"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
        ></textarea>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? <Spinner /> : 'Enviar Mensaje'}
        </button>

        {status && (
          <p className={status.type === 'success' ? styles.success : styles.error}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
}
