import { Task } from '@/schema';
import { useQuery, useSpaces } from '@graphprotocol/hypergraph-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/explore-public-knowledge/tasks')({
  component: TaskMarket,
});

function TaskMarket() {
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  const {
    data: tasks,
    isPending,
    error: tasksError,
  } = useQuery(Task, {
    mode: 'public',
    space: selectedSpace,
    first: 100,
  });

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Tasks
        </h2>
      </div>

      {/* Space Selection */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <label htmlFor="space-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Public Space
          </label>
          <select
            id="space-select"
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Choose a public space...</option>
            {publicSpaces?.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">Select a space to view its public tasks</p>
        </div>
      </div>

      {/* Show loading only when a space is selected and querying */}
      {selectedSpace && isPending && <div className="text-center py-16">Loading tasks...</div>}

      {/* Conditional Content Rendering */}
      {!selectedSpace ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Space</h3>
          <p className="text-gray-500">Choose a public space from the dropdown above to view its tasks.</p>
        </div>
      ) : tasksError ? (
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tasks Schema Not Available</h3>
          <p className="text-gray-500">
            The Tasks schema is not yet deployed to the selected space. Please try another space or check back later.
          </p>
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-1 z-10"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <span className="text-white font-bold text-lg">{task.name.charAt(0).toUpperCase()}</span>
                </div>

                {/* Task name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {task.name}
                </h3>

                {/* Task ID */}
                <p className="text-[10px] text-gray-500 mb-2 font-mono">{task.id}</p>

                {/* Task description */}
                {task.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>}

                {/* Task status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {task.status ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300 transform rotate-45 translate-x-8 -translate-y-8" />
            </div>
          ))}
        </div>
      ) : selectedSpace && !isPending ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-500">There are currently no public tasks available in the selected space.</p>
        </div>
      ) : null}
    </>
  );
}
