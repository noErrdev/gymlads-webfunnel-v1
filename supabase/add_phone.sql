-- Store phone number collected from Stripe Checkout
alter table public.users
  add column if not exists phone text;

alter table public.funnel_staging
  add column if not exists phone text;
