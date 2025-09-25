import React from 'react'
import { useWorkflowData } from '../hooks/useWorkflowData'
import { StepLatencyChart } from './StepLatencyChart'
import { StepStatusChart } from './StepStatusChart'
import { ModelUsageChart } from './ModelUsageChart'
import { StepsTable } from './StepsTable'
import { LoadingSpinner } from './LoadingSpinner'
import { Filters } from '../hooks/useWorkflowData'
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react'

interface StepsAnalysisProps {
  filters: Filters
}

export const StepsAnalysis: React.FC<StepsAnalysisProps> = ({ filters }) => {
  const { executions, loading, error } = useWorkflowData(filters)
  // Flatten all steps from all executions into a single array
  const steps = executions.flatMap(exec => exec.steps)

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Error: {error}</div>

  // Calculate step statistics
  const totalSteps = steps.length
  const successfulSteps = steps.filter(step => step.status === 'success').length
  const failedSteps = steps.filter(step => step.status === 'failed').length
  const avgLatency = steps.length > 0 
    ? Math.round(steps.reduce((sum, step) => sum + (step.latency_ms || 0), 0) / steps.length)
    : 0

  return (
    <div className="space-y-8">
      {/* Steps Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Steps</p>
              <p className="text-2xl font-bold text-gray-900">{totalSteps.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">From {executions.length} executions</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successful Steps</p>
              <p className="text-2xl font-bold text-green-600">{successfulSteps.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalSteps > 0 ? ((successfulSteps / totalSteps) * 100).toFixed(1) : 0}% success rate
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Steps</p>
              <p className="text-2xl font-bold text-red-600">{failedSteps.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalSteps > 0 ? ((failedSteps / totalSteps) * 100).toFixed(1) : 0}% failure rate
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Latency</p>
              <p className="text-2xl font-bold text-purple-600">{avgLatency}ms</p>
              <p className="text-xs text-gray-500 mt-1">Per step execution</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

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