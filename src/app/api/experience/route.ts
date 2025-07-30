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
    const experience = await db.all('SELECT * FROM experience');
    await db.close();
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error al obtener experiencia:', error);
    return NextResponse.json({ error: 'Error al obtener experiencia' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, company, startDate, endDate, description } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO experience (title, company, startDate, endDate, description) VALUES (?, ?, ?, ?, ?)',
      title, company, startDate, endDate, description
    );
    await db.close();
    return NextResponse.json({ id: result.lastID, title, company, startDate, endDate, description }, { status: 201 });
  } catch (error) {
    console.error('Error al crear experiencia:', error);
    return NextResponse.json({ error: 'Error al crear experiencia' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, company, startDate, endDate, description } = await request.json();
    const db = await getDb();
    await db.run(
      'UPDATE experience SET title = ?, company = ?, startDate = ?, endDate = ?, description = ? WHERE id = ?',
      title, company, startDate, endDate, description, id
    );
    await db.close();
    return NextResponse.json({ message: 'Experiencia actualizada' });
  } catch (error) {
    console.error('Error al actualizar experiencia:', error);
    return NextResponse.json({ error: 'Error al actualizar experiencia' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await getDb();
    await db.run('DELETE FROM experience WHERE id = ?', id);
    await db.close();
    return NextResponse.json({ message: 'Experiencia eliminada' });
  } catch (error) {
    console.error('Error al eliminar experiencia:', error);
    return NextResponse.json({ error: 'Error al eliminar experiencia' }, { status: 500 });
  }
}
