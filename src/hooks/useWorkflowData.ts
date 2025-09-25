import { useState, useEffect } from 'react'
import { supabase, WorkflowExecution, WorkflowStep } from '../lib/supabase'

export interface WorkflowQueue {
  id: string
  execution_id: string
  workflow_execution_id: string | null
  status: 'pending' | 'updated' | 'failed'
  created_at: string
  updated_at: string
}

export interface Filters {
  workflowId?: string
  executionId?: string
  overall_status?: string
  startDate?: Date
  endDate?: Date
}

export const useWorkflowData = (filters: Filters) => {
  const [executions, setExecutions] = useState<(WorkflowExecution & { steps: WorkflowStep[], queue?: WorkflowQueue[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // --- ambil executions ---
      let executionsQuery = supabase
        .from('workflow_executions')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.workflowId) {
        executionsQuery = executionsQuery.ilike('workflow_id::text', `%${filters.workflowId}%`)
      }
      if (filters.executionId) {
        executionsQuery = executionsQuery.ilike('id::text', `%${filters.executionId}%`)
      }
      if (filters.overall_status) {
        executionsQuery = executionsQuery.eq('overall_status', filters.overall_status)
      }
      if (filters.startDate) {
        const startOfDay = new Date(filters.startDate)
        startOfDay.setHours(0, 0, 0, 0)
        executionsQuery = executionsQuery.gte('created_at', startOfDay.toISOString())
      }
      if (filters.endDate) {
        const endOfDay = new Date(filters.endDate)
        endOfDay.setHours(23, 59, 59, 999)
        executionsQuery = executionsQuery.lte('created_at', endOfDay.toISOString())
      }

      const { data: executionsData, error: executionsError } = await executionsQuery
      if (executionsError) throw executionsError

      const executionIds = executionsData?.map(e => e.id) || []

      // --- ambil steps ---
      let stepsData: WorkflowStep[] = []
      if (executionIds.length > 0) {
        const { data, error } = await supabase
          .from('workflow_steps')
          .select('*')
          .in('execution_id', executionIds)
          .order('step_order', { ascending: true })

        if (error) throw error
        stepsData = data || []
      }

      // --- ambil queue ---
      let queueData: WorkflowQueue[] = []
      if (executionIds.length > 0) {
        const { data, error } = await supabase
          .from('workflow_queue')
          .select('*')
          .in('workflow_execution_id', executionIds)

        if (error) throw error
        queueData = data || []
      }

      // group steps
      const stepsByExecution: Record<string, WorkflowStep[]> = {}
      for (const step of stepsData) {
        if (!stepsByExecution[step.execution_id]) {
          stepsByExecution[step.execution_id] = []
        }
        stepsByExecution[step.execution_id].push(step)
      }

      // group queue
      const queueByExecution: Record<string, WorkflowQueue[]> = {}
      for (const q of queueData) {
        if (!queueByExecution[q.workflow_execution_id!]) {
          queueByExecution[q.workflow_execution_id!] = []
        }
        queueByExecution[q.workflow_execution_id!].push(q)
      }

      // gabungkan
      const executionsWithData = (executionsData || []).map(e => ({
        ...e,
        steps: stepsByExecution[e.id] || [],
        queue: queueByExecution[e.id] || []
      }))

      setExecutions(executionsWithData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { executions, loading, error, refetch: fetchData }
}

