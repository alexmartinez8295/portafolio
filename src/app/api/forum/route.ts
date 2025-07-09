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
  try {
    const db = await getDb();
    const posts = await db.all('SELECT * FROM forum_posts');
    await db.close();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error al obtener posts del foro:', error);
    return NextResponse.json({ error: 'Error al obtener posts del foro' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, author, date } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO forum_posts (title, content, author, date) VALUES (?, ?, ?, ?)',
      title, content, author, date
    );
    await db.close();
    return NextResponse.json({ id: result.lastID, title, content, author, date }, { status: 201 });
  } catch (error) {
    console.error('Error al crear post del foro:', error);
    return NextResponse.json({ error: 'Error al crear post del foro' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, author, date } = await request.json();
    const db = await getDb();
    await db.run(
      'UPDATE forum_posts SET title = ?, content = ?, author = ?, date = ? WHERE id = ?',
      title, content, author, date, id
    );
    await db.close();
    return NextResponse.json({ message: 'Post del foro actualizado' });
  } catch (error) {
    console.error('Error al actualizar post del foro:', error);
    return NextResponse.json({ error: 'Error al actualizar post del foro' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await getDb();
    await db.run('DELETE FROM forum_posts WHERE id = ?', id);
    await db.close();
    return NextResponse.json({ message: 'Post del foro eliminado' });
  } catch (error) {
    console.error('Error al eliminar post del foro:', error);
    return NextResponse.json({ error: 'Error al eliminar post del foro' }, { status: 500 });
  }
}
