import React from 'react'
import { useWorkflowData } from '../hooks/useWorkflowData'
import { StepLatencyChart } from './StepLatencyChart'
import { StepStatusChart } from './StepStatusChart'
import { ModelUsageChart } from './ModelUsageChart'
import { StepsTable } from './StepsTable'
import { LoadingSpinner } from './LoadingSpinner'
import { Filters } from '../hooks/useWorkflowData'

interface StepsAnalysisProps {
  filters: Filters
}

export const StepsAnalysis: React.FC<StepsAnalysisProps> = ({ filters }) => {
  const { executions, loading, error } = useWorkflowData(filters)
  // Flatten all steps from all executions into a single array
  const steps = executions.flatMap(exec => exec.steps)

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="space-y-8">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StepLatencyChart steps={steps} />
        <StepStatusChart steps={steps} />
        <ModelUsageChart steps={steps} />
      </div>

      {/* Steps Table */}
      <StepsTable steps={steps} />
    </div>
  )
}