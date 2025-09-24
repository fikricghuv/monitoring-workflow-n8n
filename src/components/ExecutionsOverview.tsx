import React from 'react'
import { useWorkflowData } from '../hooks/useWorkflowData'
import { MetricsCards } from './MetricsCards'
import { StatusDistributionChart } from './StatusDistributionChart'
import { ExecutionTrendChart } from './ExecutionTrendChart'
import { ExecutionsTable } from './ExecutionsTable'
import { LoadingSpinner } from './LoadingSpinner'
import { Filters } from '../hooks/useWorkflowData'

interface ExecutionsOverviewProps {
  filters: Filters
  onExecutionSelect: (executionId: string) => void
}

export const ExecutionsOverview: React.FC<ExecutionsOverviewProps> = ({ 
  filters, 
  onExecutionSelect 
}) => {
  const { executions, loading, error } = useWorkflowData(filters)

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <MetricsCards executions={executions} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StatusDistributionChart executions={executions} />
        <ExecutionTrendChart executions={executions} />
      </div>

      {/* Executions Table */}
      <ExecutionsTable 
        executions={executions} 
        onExecutionSelect={onExecutionSelect} 
      />
    </div>
  )
}