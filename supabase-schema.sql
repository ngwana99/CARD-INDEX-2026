-- GHS Mbonjo Limbe — Staff Card Index
-- Run this once in Supabase → SQL Editor.
-- The browser never talks to Supabase directly — only the Vercel
-- serverless functions in /api do, using the service_role key (which
-- always bypasses Row Level Security). So this table is locked to
-- deny ordinary (anon/authenticated) access entirely.

create extension if not exists pgcrypto;

create table if not exists card_index_submissions (
  id                            uuid primary key default gen_random_uuid(),
  submitted_at                  timestamptz not null default now(),
  full_name                     text,
  mat_no                        text,
  dob                           text,
  pob                           text,
  sex                           text,
  marital_status                text,
  ethnic_group                  text,
  first_language                text,
  region_origin                 text,
  division_origin               text,
  subdivision_origin            text,
  employment_status             text,
  date_entry_public_service     text,
  cert_access_public_service    text,
  last_certificate              text,
  cert_degree_level             text,
  grade                         text,
  region_work                   text,
  division_work                 text,
  subdivision_work              text,
  place_of_work                 text,
  duty_post                     text,
  date_entry_present_position   text,
  phone                         text,
  whatsapp                      text,
  redeployed                    text,
  place_redeployment            text,
  division_redeployment         text,
  subdivision_redeployment      text
);

-- Enable Row Level Security with NO policies for anon/authenticated.
-- That makes the table unreachable from the browser under any key.
-- Only the service_role key (used exclusively inside /api/submit.js
-- and /api/roster.js on the server) can read or write — it bypasses
-- RLS by design, so no policy is needed for it.
alter table card_index_submissions enable row level security;
