import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { WorkflowStep } from '../lib/supabase'

interface ModelUsageChartProps {
  steps: WorkflowStep[]
}

export const ModelUsageChart: React.FC<ModelUsageChartProps> = ({ steps }) => {
  const modelCounts = steps
    .filter(step => step.model_name && step.model_name.trim() !== '')
    .reduce((acc, step) => {
      acc[step.model_name!] = (acc[step.model_name!] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const data = Object.entries(modelCounts)
    .map(([model, count]) => ({
      model,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8) // Top 8 models

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Models</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No model usage data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Models</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}