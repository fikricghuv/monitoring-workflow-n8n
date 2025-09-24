import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { WorkflowExecution } from '../lib/supabase'
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns'

interface ExecutionTrendChartProps {
  executions: WorkflowExecution[]
}

export const ExecutionTrendChart: React.FC<ExecutionTrendChartProps> = ({ executions }) => {
  // Group executions by date
  const executionsByDate = executions.reduce((acc, execution) => {
    const date = format(new Date(execution.created_at), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = { date, total: 0, success: 0, failed: 0 }
    }
    acc[date].total += 1
    if (execution.status === 'success') {
      acc[date].success += 1
    }
    if (execution.status === 'failed') {
      acc[date].failed += 1
    }
    return acc
  }, {} as Record<string, { date: string, total: number, success: number, failed: number }>)

  // Create data for the last 30 days
  const endDate = new Date()
  const startDate = subDays(endDate, 29)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const data = dateRange.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayData = executionsByDate[dateStr] || { total: 0, success: 0, failed: 0 }
    return {
      date: format(date, 'MMM dd'),
      ...dayData
    }
  })

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Total"
          />
          <Line
            type="monotone"
            dataKey="success"
            stroke="#10B981"
            strokeWidth={2}
            name="Success"
          />
          <Line
            type="monotone"
            dataKey="failed"
            stroke="#EF4444"
            strokeWidth={2}
            name="Failed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}