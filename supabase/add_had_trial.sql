-- Requirement 3: track users who already used their free trial
alter table public.users
  add column if not exists had_trial boolean not null default false;

-- Backfill: anyone who ever had a Stripe subscription already used a trial
update public.users
set had_trial = true
where stripe_subscription_id is not null
  and had_trial = false;
