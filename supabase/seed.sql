-- Default test account for local development.
-- Runs automatically on `supabase start` / `supabase db reset` (see [db.seed] in config.toml).
--
-- Credentials (email + password login succeeds out of the box):
--   Email:    test@example.com
--   Password: password123
--
-- This seed is for LOCAL ONLY. Never run it against a real/production database.

-- Idempotent: clear any prior test account so re-seeding is safe.
delete from auth.identities where user_id = '11111111-1111-1111-1111-111111111111';
delete from auth.users where id = '11111111-1111-1111-1111-111111111111';

-- The auth user. Password is bcrypt-hashed via pgcrypto's crypt(); email is pre-confirmed
-- so the account can sign in immediately without an email round-trip.
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- The matching email identity (GoTrue requires an identities row for the provider).
insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"test@example.com"}',
  'email',
  now(),
  now(),
  now()
);
