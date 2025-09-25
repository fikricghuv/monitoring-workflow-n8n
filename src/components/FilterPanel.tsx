import React from 'react'
import { Calendar, Filter, Workflow } from 'lucide-react'
import { Filters } from '../hooks/useWorkflowData'
import { format } from 'date-fns'

interface FilterPanelProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Workflow ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Workflow className="h-4 w-4 inline mr-1" />
            Workflow ID
          </label>
          <input
            type="text"
            value={filters.workflowId || ''}
            onChange={(e) => handleFilterChange('workflowId', e.target.value || undefined)}
            placeholder="Enter workflow ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Execution ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Workflow className="h-4 w-4 inline mr-1" />
            Execution ID
          </label>
          <input
            type="text"
            value={filters.executionId || ''} 
            onChange={(e) => handleFilterChange('executionId', e.target.value || undefined)}
            placeholder="Enter execution ID" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.overall_status || ''}
            onChange={(e) => handleFilterChange('overall_status', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}