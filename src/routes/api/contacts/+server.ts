import { json } from '@sveltejs/kit';
import { db, contacts } from '$lib/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

// GET all contacts
export const GET: RequestHandler = async () => {
  try {
    const allContacts = await db.select().from(contacts);
    return json(allContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
};

// POST create new contact
export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const now = new Date().toISOString();

    const newContact = {
      id: data.id || nanoid(),
      ...data,
      createdAt: now,
      updatedAt: now
    };

    await db.insert(contacts).values(newContact);

    return json(newContact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return json({ error: 'Failed to create contact' }, { status: 500 });
  }
};

// PUT update contact
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return json({ error: 'ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db.update(contacts)
      .set({ ...updateData, updatedAt: now })
      .where(eq(contacts.id, id));

    const updated = await db.select().from(contacts).where(eq(contacts.id, id));

    return json(updated[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    return json({ error: 'Failed to update contact' }, { status: 500 });
  }
};

// DELETE contact
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(contacts).where(eq(contacts.id, id));

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return json({ error: 'Failed to delete contact' }, { status: 500 });
  }
};