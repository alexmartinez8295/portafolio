'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Spinner from '../../components/Spinner';
import styles from './proyectos.module.css'; // Usamos estilos específicos para proyectos

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
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
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Mis Proyectos</h1>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Mis Proyectos</h1>
        <p className={styles.error}>Error al cargar los proyectos: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Mis Proyectos</h1>
      {
        projects.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="mySwiper"
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id}>
                <div className={styles.projectItem}>
                  <h2>{project.title}</h2>
                  {project.imageUrl && (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={400} // Ajusta el tamaño de la imagen para el carrusel
                      height={250}
                      style={{ objectFit: 'cover', marginBottom: '1rem' }}
                    />
                  )}
                  <p>{project.description}</p>
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
                      Ver Proyecto
                    </a>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )
      }
    </div>
  );
}