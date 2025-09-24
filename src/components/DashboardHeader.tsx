import React from 'react'
import { Activity, Database } from 'lucide-react'

export const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <Database className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">N8N Workflow Monitor</h1>
            <p className="text-sm text-gray-500">Real-time workflow execution analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}