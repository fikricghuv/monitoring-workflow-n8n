/*
  # Add missing columns to workflow_executions table

  1. Changes
    - Add `status` column with check constraint for valid values
    - Add other potentially missing columns that are referenced in the code
    - Ensure all columns match the TypeScript interface

  2. Security
    - Maintain existing RLS policies
*/

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'status'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN status text DEFAULT 'pending';
    
    -- Add check constraint for valid status values
    ALTER TABLE workflow_executions ADD CONSTRAINT workflow_executions_status_check 
    CHECK (status IN ('success', 'failed', 'running', 'pending', 'cancelled'));
  END IF;
END $$;

-- Add completed_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Add latency_ms column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'latency_ms'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN latency_ms integer DEFAULT 0;
  END IF;
END $$;

-- Add input_tokens column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'input_tokens'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN input_tokens integer DEFAULT 0;
  END IF;
END $$;

-- Add output_tokens column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'output_tokens'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN output_tokens integer DEFAULT 0;
  END IF;
END $$;

-- Add total_tokens column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'total_tokens'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN total_tokens integer DEFAULT 0;
  END IF;
END $$;

-- Add payload column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'payload'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN payload jsonb;
  END IF;
END $$;

-- Add tool_usage column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'tool_usage'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN tool_usage jsonb;
  END IF;
END $$;

-- Add error_message column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN error_message text;
  END IF;
END $$;

-- Add response_data column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_executions' AND column_name = 'response_data'
  ) THEN
    ALTER TABLE workflow_executions ADD COLUMN response_data jsonb;
  END IF;
END $$;

-- Add missing columns to workflow_steps table if they don't exist

-- Add latency_ms column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'latency_ms'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN latency_ms integer DEFAULT 0;
  END IF;
END $$;

-- Add input_tokens column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'input_tokens'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN input_tokens integer DEFAULT 0;
  END IF;
END $$;

-- Add output_tokens column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'output_tokens'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN output_tokens integer DEFAULT 0;
  END IF;
END $$;

-- Add model_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'model_name'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN model_name text;
  END IF;
END $$;

-- Add error_message column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN error_message text;
  END IF;
END $$;

-- Add response_data column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'response_data'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN response_data jsonb;
  END IF;
END $$;

-- Add completed_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workflow_steps' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE workflow_steps ADD COLUMN completed_at timestamptz;
  END IF;
END $$;