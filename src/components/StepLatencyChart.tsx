import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { WorkflowStep } from '../lib/supabase'

interface StepLatencyChartProps {
  steps: WorkflowStep[]
}

export const StepLatencyChart: React.FC<StepLatencyChartProps> = ({ steps }) => {
  // Calculate average latency per step name
  const stepLatencies = steps
    .filter(step => step.latency_ms != null && step.latency_ms > 0)
    .reduce((acc, step) => {
    if (!acc[step.step_name]) {
      acc[step.step_name] = { total: 0, count: 0 }
    }
    acc[step.step_name].total += step.latency_ms
    acc[step.step_name].count += 1
    return acc
  }, {} as Record<string, { total: number, count: number }>)

  const data = Object.entries(stepLatencies)
    .map(([stepName, { total, count }]) => ({
      stepName,
      avgLatency: Math.round(total / count)
    }))
    .sort((a, b) => b.avgLatency - a.avgLatency)
    .slice(0, 10) // Top 10 steps by latency

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Latency by Step</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No latency data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Latency by Step</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="stepName" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}ms`, 'Avg Latency']} />
          <Bar dataKey="avgLatency" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}