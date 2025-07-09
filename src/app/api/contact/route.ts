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
    const messages = await db.all('SELECT * FROM contact_messages');
    await db.close();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);
    return NextResponse.json({ error: 'Error al obtener mensajes de contacto' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, message, date } = await request.json();
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO contact_messages (name, email, message, date) VALUES (?, ?, ?, ?)',
      name, email, message, date
    );
    await db.close();
    return NextResponse.json({ id: result.lastID, name, email, message, date }, { status: 201 });
  } catch (error) {
    console.error('Error al crear mensaje de contacto:', error);
    return NextResponse.json({ error: 'Error al crear mensaje de contacto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, email, message, date } = await request.json();
    const db = await getDb();
    await db.run(
      'UPDATE contact_messages SET name = ?, email = ?, message = ?, date = ? WHERE id = ?',
      name, email, message, date, id
    );
    await db.close();
    return NextResponse.json({ message: 'Mensaje de contacto actualizado' });
  } catch (error) {
    console.error('Error al actualizar mensaje de contacto:', error);
    return NextResponse.json({ error: 'Error al actualizar mensaje de contacto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await getDb();
    await db.run('DELETE FROM contact_messages WHERE id = ?', id);
    await db.close();
    return NextResponse.json({ message: 'Mensaje de contacto eliminado' });
  } catch (error) {
    console.error('Error al eliminar mensaje de contacto:', error);
    return NextResponse.json({ error: 'Error al eliminar mensaje de contacto' }, { status: 500 });
  }
}
