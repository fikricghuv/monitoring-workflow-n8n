import React from 'react'
import { WorkflowStep } from '../lib/supabase'
import { format, parseISO } from 'date-fns'

interface StepsTableProps {
  steps: WorkflowStep[]
}

export const StepsTable: React.FC<StepsTableProps> = ({ steps }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Sort steps by created_at descending to show most recent first
  const sortedSteps = [...steps].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Steps Details</h3>
          <span className="text-sm text-gray-500">
            Showing {Math.min(100, steps.length)} of {steps.length.toLocaleString()} steps
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Execution ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Step Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSteps.slice(0, 100).map((step) => (
              <tr key={step.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="font-mono text-xs">
                    {step.execution_id.slice(0, 8)}...
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {step.step_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {step.step_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(step.status)}`}>
                    {step.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {step.model_name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {step.latency_ms || 0}ms
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {((step.input_tokens || 0) + (step.output_tokens || 0)).toLocaleString()}
                  <div className="text-xs text-gray-500">
                    {step.input_tokens || 0} in / {step.output_tokens || 0} out
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(parseISO(step.created_at), 'MMM dd, HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {steps.length > 100 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Showing first 100 steps. Use filters to narrow down results for better performance.
          </p>
        </div>
      )}
    </div>
  )
}