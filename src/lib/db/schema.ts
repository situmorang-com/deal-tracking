import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const opportunities = sqliteTable('opportunities', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  value: real('value').notNull(),
  stage: text('stage').notNull(), // Discovery, Qualification, Proposal, Negotiation
  probability: integer('probability').notNull().default(50),
  contactName: text('contact_name'),
  contactTitle: text('contact_title'),
  contactId: text('contact_id'),
  expectedCloseDate: text('expected_close_date'),
  description: text('description'),
  lastActivity: text('last_activity'),
  daysInStage: integer('days_in_stage').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export type Opportunity = typeof opportunities.$inferSelect;
export type NewOpportunity = typeof opportunities.$inferInsert;

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  mobile_phone: text('mobile_phone'),
  work_phone: text('work_phone'),
  fax: text('fax'),
  company: text('company'),
  jobTitle: text('job_title'),
  birthday: text('birthday'),
  location: text('location'),
  linkedinUrl: text('linkedin_url'),
  whatsapp: text('whatsapp'),
  contactFrequency: text('contact_frequency'),
  lastContactedAt: text('last_contacted_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
