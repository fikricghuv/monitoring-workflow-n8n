import React, { useState } from 'react'
import { Filters } from '../hooks/useWorkflowData'
import { DashboardHeader } from './DashboardHeader'
import { ExecutionsOverview } from './ExecutionsOverview'
import { StepsAnalysis } from './StepsAnalysis'
import { DrilldownView } from './DrilldownView'
import { FilterPanel } from './FilterPanel'

export const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({})
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'drilldown'>('overview')

  const handleExecutionSelect = (executionId: string) => {
    setSelectedExecutionId(executionId)
    setActiveTab('drilldown')
  }

  // Handle URL hash changes for direct execution selection
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#execution-')) {
        const executionId = hash.replace('#execution-', '')
        setSelectedExecutionId(executionId)
        setActiveTab('drilldown')
      } else if (hash === '') {
        setSelectedExecutionId(null)
      }
    }

    handleHashChange() // Handle initial hash
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
        
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Executions Overview' },
              { id: 'steps', label: 'Steps Analysis' },
              { id: 'drilldown', label: 'Drilldown View' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <ExecutionsOverview 
            filters={filters} 
            onExecutionSelect={handleExecutionSelect} 
          />
        )}
        {activeTab === 'steps' && (
          <StepsAnalysis filters={filters} />
        )}
        {activeTab === 'drilldown' && (
          <DrilldownView 
            executionId={selectedExecutionId}
            filters={filters}
          />
        )}
      </div>
    </div>
  )
}