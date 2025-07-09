import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database', 'mydb.sqlite');

async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function GET() {
  let db;
  try {
    db = await getDb();
    const homeContent = await db.all('SELECT * FROM home_content');
    return NextResponse.json(homeContent);
  } catch (error) {
    console.error('Error al obtener contenido del Home:', error);
    return NextResponse.json({ error: 'Error al obtener contenido del Home' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function PUT(request: Request) {
  let db;
  try {
    const { id, section_name, content, imageUrl, videoUrl } = await request.json();
    db = await getDb();
    await db.run(
      'UPDATE home_content SET section_name = ?, content = ?, imageUrl = ?, videoUrl = ? WHERE id = ?',
      section_name, content, imageUrl, videoUrl, id
    );
    return NextResponse.json({ message: 'Contenido del Home actualizado' });
  } catch (error) {
    console.error('Error al actualizar contenido del Home:', error);
    return NextResponse.json({ error: 'Error al actualizar contenido del Home' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}