import { createFileRoute } from '@tanstack/react-router'
import { Period } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

export default function PeriodsPage() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  const { data: periods, isPending, error: periodsError } = useQuery(Period, {
    mode: 'public',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Public Periods</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover and explore periods from various public spaces. Select a space below to view the periods available.
          </p>
        </div>
      </div>

      {/* Space Selection */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Public Space</h2>
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">Choose a public space to explore periods...</option>
            {publicSpaces?.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!selectedSpace ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Space</h3>
            <p className="text-gray-500">Choose a public space from the dropdown above to view its periods.</p>
          </div>
        ) : isPending ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading periods...</p>
          </div>
        ) : periodsError ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Periods Schema Not Available</h3>
            <p className="text-gray-500">
              The Periods schema is not yet deployed to this space. Please check back later or try a different space.
            </p>
          </div>
        ) : periods && periods.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Periods ({periods.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {periods.map((period) => (
                <div
                  key={period.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1 z-10"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Period icon/avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <span className="text-white font-bold text-lg">{period.person.charAt(0).toUpperCase()}</span>
                    </div>

                    {/* Period person */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {period.person}
                    </h3>

                    {/* Period ID */}
                    <p className="text-[10px] text-gray-500 mb-2 font-mono">{period.id}</p>

                    {/* Period month */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Month:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {period.month}
                      </span>
                    </div>

                    {/* Period dates */}
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Start:</span>
                        <span className="text-xs text-gray-600">{new Date(period.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">End:</span>
                        <span className="text-xs text-gray-600">{new Date(period.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Period notes */}
                    {period.notes && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{period.notes}</p>
                    )}
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform rotate-45 translate-x-8 -translate-y-8" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Periods Found</h3>
            <p className="text-gray-500">There are currently no public periods available in this space.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/explore-public-knowledge/periods')({
  component: PeriodsPage,
});
