/*
  # Create app_config table for secure credential storage

  1. New Tables
    - `app_config`
      - `key` (text, primary key) - config key name
      - `value` (text) - config value
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - No public access; only service role can read (used by edge functions)
*/

CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
