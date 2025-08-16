import { createFileRoute } from '@tanstack/react-router';
import { Period } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

export default function PeriodsPage() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  const {
    data: periods,
    isPending,
    error: periodsError,
  } = useQuery(Period, {
    mode: 'public',
    space: selectedSpace,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Community Selection */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Welcome to Our Care Community</h2>
          <p className="text-gray-600 mb-4 text-center">
            Choose a community space to connect with other women and share experiences
          </p>
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
          >
            <option value="">Select a community to join...</option>
            {publicSpaces?.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} Community
              </option>
            ))}
          </select>
          {publicSpaces && (
            <p className="text-sm text-gray-500 mt-2">{publicSpaces.length} community spaces available</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {!selectedSpace ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Join a Community</h3>
            <p className="text-gray-500">Select a community from the dropdown above to start connecting with others.</p>
          </div>
        ) : isPending ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading community discussions...</p>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Not Available</h3>
            <p className="text-gray-500">
              This community space is not yet set up for discussions. Please try a different community or check back
              later.
            </p>
          </div>
        ) : periods && periods.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Community Discussions ({periods.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {periods.map((period) => (
                <div
                  key={period.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200 transform hover:-translate-y-1 z-10"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative p-6">
                    {/* User avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                      <span className="text-white font-bold text-lg">{period.person.charAt(0).toUpperCase()}</span>
                    </div>

                    {/* User name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                      {period.person}
                    </h3>

                    {/* Post date */}
                    <p className="text-xs text-gray-500 mb-3">
                      Posted on {new Date(period.startDate).toLocaleDateString()}
                    </p>

                    {/* Experience period */}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-gray-500">Experience Period:</span>
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {period.month}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Duration:</span> {new Date(period.startDate).toLocaleDateString()}{' '}
                        - {new Date(period.endDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Personal notes/experience */}
                    {period.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{period.notes}</p>
                      </div>
                    )}

                    {/* Forum interaction buttons */}
                    <div className="flex space-x-2 mt-4">
                      <button className="flex-1 px-3 py-2 text-xs bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors">
                        💜 Support
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                        💬 Reply
                      </button>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform rotate-45 translate-x-8 -translate-y-8" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Discussions Yet</h3>
            <p className="text-gray-500">Be the first to share your experience in this community!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/explore-public-knowledge/periods')({
  component: PeriodsPage,
});
