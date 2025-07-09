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
    const projects = await db.all('SELECT * FROM projects');
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function POST(request: Request) {
  let db;
  try {
    const { title, description, imageUrl, projectUrl } = await request.json();
    db = await getDb();
    const result = await db.run(
      'INSERT INTO projects (title, description, imageUrl, projectUrl) VALUES (?, ?, ?, ?)',
      title, description, imageUrl, projectUrl
    );
    return NextResponse.json({ id: result.lastID, title, description, imageUrl, projectUrl }, { status: 201 });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function PUT(request: Request) {
  let db;
  try {
    const { id, title, description, imageUrl, projectUrl } = await request.json();
    db = await getDb();
    await db.run(
      'UPDATE projects SET title = ?, description = ?, imageUrl = ?, projectUrl = ? WHERE id = ?',
      title, description, imageUrl, projectUrl, id
    );
    return NextResponse.json({ message: 'Proyecto actualizado' });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function DELETE(request: Request) {
  let db;
  try {
    const { id } = await request.json();
    db = await getDb();
    await db.run('DELETE FROM projects WHERE id = ?', id);
    return NextResponse.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}
