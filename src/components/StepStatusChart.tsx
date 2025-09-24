import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { WorkflowStep } from '../lib/supabase'

interface StepStatusChartProps {
  steps: WorkflowStep[]
}

export const StepStatusChart: React.FC<StepStatusChartProps> = ({ steps }) => {
  const statusCounts = steps
    .filter(step => step.status && step.status.trim() !== '')
    .reduce((acc, step) => {
    acc[step.status] = (acc[step.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }))

  const COLORS = {
    success: '#10B981',
    failed: '#EF4444',
    running: '#3B82F6',
    pending: '#F59E0B'
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Step Status Distribution</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No step status data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Step Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#6B7280'}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}