'use client';
import ParticlesComponent from '../components/Particles';
import styles from './Home.module.css';
import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import Image from 'next/image'; // Importar el componente Image

interface HomeContentItem {
  id: number;
  section_name: string;
  content: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

export default function Home() {
  const [homeContent, setHomeContent] = useState<Record<string, HomeContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomeContent() {
      try {
        const response = await fetch('/api/home');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HomeContentItem[] = await response.json();
        const contentMap: Record<string, HomeContentItem> = {};
        data.forEach(item => {
          contentMap[item.section_name] = item;
        });
        setHomeContent(contentMap);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeContent();
  }, []);

  if (loading) {
    return (
      <main className={styles.main}>
        <ParticlesComponent id="tsparticles" />
        <div className={styles.hero}>
          <Spinner />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <ParticlesComponent id="tsparticles" />
        <div className={styles.hero}>
          <h1 className={styles.title}>Error al cargar el contenido</h1>
          <p>Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <ParticlesComponent id="tsparticles" />
      <div className={styles.hero}>
        <h1 className={styles.title}>{homeContent.hero_title?.content || '[Tu Nombre]'}</h1>
        <p className={styles.subtitle}>{homeContent.hero_subtitle?.content || 'Ingeniero de Software'}</p>
        <div className={styles.heroContent}> {/* Nuevo contenedor para la descripción y la imagen/video */}
          <div className={styles.heroDescription}> {/* Contenedor para la descripción */}
            <p>{homeContent.about_me?.content || 'Cargando descripción...'}</p>
          </div>
          <div className={styles.heroMedia}> {/* Contenedor para la imagen/video */}
            {homeContent.hero_image?.imageUrl && (
              <Image
                src={homeContent.hero_image.imageUrl}
                alt="Yo merengues 😎"
                width={500} // Ajusta el tamaño según tus necesidades
                height={500}
                style={{ objectFit: 'cover', marginTop: '1rem' }}
              />
            )}
            {homeContent.hero_video?.videoUrl && (
              <div style={{ marginTop: '1rem' }}>
                <iframe
                  width="560"
                  height="315"
                  src={homeContent.hero_video.videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
