import React, { useEffect, useState } from 'react'
import { supabase, WorkflowExecution, WorkflowStep } from '../lib/supabase'
import { LoadingSpinner } from './LoadingSpinner'
import { format, parseISO } from 'date-fns'
import { ArrowRight, Code, AlertCircle, Search } from 'lucide-react'
import { Filters } from '../hooks/useWorkflowData'
import { useWorkflowData } from '../hooks/useWorkflowData'

interface DrilldownViewProps {
  executionId: string | null
  filters: Filters
}

export const DrilldownView: React.FC<DrilldownViewProps> = ({ executionId, filters }) => {
  const { executions } = useWorkflowData(filters)
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (executionId) {
      fetchExecutionDetails()
    }
  }, [executionId])

  const fetchExecutionDetails = async () => {
    if (!executionId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch execution details
      const { data: executionData, error: executionError } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('id', executionId)
        .single()

      if (executionError) throw executionError

      // Fetch related steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('execution_id', executionId)
        .order('step_order', { ascending: true })

      if (stepsError) throw stepsError

      setExecution(executionData)
      setSteps(stepsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter executions based on search term
  const filteredExecutions = executions.filter(exec => 
    exec.workflow_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exec.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!executionId) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by workflow ID or execution ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Workflow Executions List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Workflow Execution ({filteredExecutions.length} found)
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredExecutions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No workflow executions found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredExecutions.slice(0, 50).map((exec) => (
                  <div
                    key={exec.id}
                    onClick={() => window.location.hash = `#execution-${exec.id}`}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">
                            {exec.workflow_id}
                          </h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exec.overall_status)}`}>
                            {exec.overall_status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>ID: {exec.id.slice(0, 8)}...</span>
                          <span>{format(parseISO(exec.created_at), 'MMM dd, yyyy HH:mm')}</span>
                          <span>{exec.total_latency_ms || 0}ms</span>
                          <span>{(exec.total_tokens || 0).toLocaleString()} tokens</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!execution) return <div>Execution not found</div>

  return (
    <div className="space-y-8">
      {/* Back to List Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => window.location.hash = ''}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span>Back to Workflow List</span>
        </button>
      </div>

      {/* Execution Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Execution Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Workflow ID</label>
            <p className="text-lg font-semibold">{execution.workflow_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(execution.overall_status)}`}>
                {execution.overall_status}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Total Latency</label>
            <p className="text-lg font-semibold">{execution.total_latency_ms}ms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-500">Created At</label>
            <p className="font-semibold">{format(parseISO(execution.created_at), 'MMM dd, yyyy HH:mm:ss')}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-500">Input Tokens</label>
            <p className="font-semibold">{(execution.input_tokens || 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-500">Output Tokens</label>
            <p className="font-semibold">{(execution.output_tokens || 0).toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="text-sm font-medium text-gray-500">Total Tokens</label>
            <p className="font-semibold">{(execution.total_tokens || 0).toLocaleString()}</p>
          </div>
        </div>

        {execution.error_message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-800">Error Message</h4>
            </div>
            <p className="text-red-700 mt-2">{execution.error_message}</p>
          </div>
        )}

        {/* Payload and Tool Usage */}
        {(execution.payload || execution.tool_usage) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {execution.payload && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Payload</span>
                </h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(execution.payload, null, 2)}
                </pre>
              </div>
            )}

            {execution.tool_usage && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Tool Usage</span>
                </h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(execution.tool_usage, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Steps Flow */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step Execution Flow</h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getStatusColor(step.status)}`}>
                  {step.step_order}
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                )}
              </div>
              
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{step.step_name}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(step.status)}`}>
                    {step.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Latency:</span>
                    <span className="ml-1 font-medium">{step.latency_ms}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tokens:</span>
                    <span className="ml-1 font-medium">{((step.input_tokens || 0) + (step.output_tokens || 0)).toLocaleString()}</span>
                  </div>
                  {step.model_name && (
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <span className="ml-1 font-medium">{step.model_name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-1 font-medium">{format(parseISO(step.created_at), 'HH:mm:ss')}</span>
                  </div>
                </div>

                {step.error_message && (
                  <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <strong>Error:</strong> {step.error_message}
                  </div>
                )}

                {step.response_data && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      View Response Data
                    </summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                      {JSON.stringify(step.response_data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}