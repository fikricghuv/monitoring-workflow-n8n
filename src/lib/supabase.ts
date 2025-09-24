import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type WorkflowExecution = {
  id: string
  workflow_id: string
  overall_status: 'success' | 'failed' | 'running' | 'pending' | 'cancelled'
  created_at: string
  updated_at: string
  completed_at?: string
  total_latency_ms: number
  input_tokens: number
  output_tokens: number
  total_tokens: number
  payload?: any
  tool_usage?: any
  error_message?: string
  response_data?: any
}

export type WorkflowStep = {
  id: string
  execution_id: string
  step_name: string
  step_order: number
  status: 'success' | 'failed' | 'running' | 'pending'
  created_at: string
  completed_at?: string
  latency_ms: number
  input_tokens: number
  output_tokens: number
  model_name?: string
  error_message?: string
  response_data?: any
  retrieved_contexts?: any
  start_time?: BigInt
}

export type WorkflowQueue = {
  id: string
  execution_id: string
  workflow_execution_id: string | null
  status: 'pending' | 'updated' | 'failed'
  created_at: string
  updated_at: string
}

export type ExecutionWithRelations = WorkflowExecution & {
  steps: WorkflowStep[]
  queue: WorkflowQueue[]
}