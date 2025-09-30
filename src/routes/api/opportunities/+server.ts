import { json } from '@sveltejs/kit';
import { db, opportunities } from '$lib/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

// GET all opportunities
export const GET: RequestHandler = async () => {
  try {
    const allOpportunities = await db.select().from(opportunities);
    return json(allOpportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
};

// POST create new opportunity
export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const now = new Date().toISOString();

    const newOpportunity = {
      id: nanoid(),
      ...data,
      createdAt: now,
      updatedAt: now,
      lastActivity: now,
      daysInStage: 0
    };

    await db.insert(opportunities).values(newOpportunity);

    return json(newOpportunity, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return json({ error: 'Failed to create opportunity' }, { status: 500 });
  }
};

// PUT update opportunity
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return json({ error: 'ID is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    await db.update(opportunities)
      .set({ ...updateData, updatedAt: now })
      .where(eq(opportunities.id, id));

    const updated = await db.select().from(opportunities).where(eq(opportunities.id, id));

    return json(updated[0]);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return json({ error: 'Failed to update opportunity' }, { status: 500 });
  }
};

// DELETE opportunity
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { id } = await request.json();

    if (!id) {
      return json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(opportunities).where(eq(opportunities.id, id));

    return json({ success: true });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return json({ error: 'Failed to delete opportunity' }, { status: 500 });
  }
};
