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
    const posts = await db.all('SELECT * FROM Posts ORDER BY createdAt DESC');
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener posts del foro:', error);
    return NextResponse.json({ error: 'Error al obtener posts del foro' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function POST(request: Request) {
  let db;
  try {
    const { title, content, author } = await request.json();
    db = await getDb();
    const result = await db.run(
      'INSERT INTO Posts (title, content, author) VALUES (?, ?, ?)',
      title, content, author
    );
    const newPost = await db.get('SELECT * FROM Posts WHERE id = ?', result.lastID);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error al crear post del foro:', error);
    return NextResponse.json({ error: 'Error al crear post del foro' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function PUT(request: Request) {
  let db;
  try {
    const { id, title, content, author } = await request.json();
    db = await getDb();
    await db.run(
      'UPDATE Posts SET title = ?, content = ?, author = ? WHERE id = ?',
      title, content, author, id
    );
    return NextResponse.json({ message: 'Post del foro actualizado' });
  } catch (error) {
    console.error('Error al actualizar post del foro:', error);
    return NextResponse.json({ error: 'Error al actualizar post del foro' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}

export async function DELETE(request: Request) {
  let db;
  try {
    const { id } = await request.json();
    db = await getDb();
    await db.run('DELETE FROM Posts WHERE id = ?', id);
    return NextResponse.json({ message: 'Post del foro eliminado' });
  } catch (error) {
    console.error('Error al eliminar post del foro:', error);
    return NextResponse.json({ error: 'Error al eliminar post del foro' }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}