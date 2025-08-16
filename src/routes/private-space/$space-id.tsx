import { Button } from '@/components/ui/button';
import { Project, Task, Period } from '@/schema';
import {
  HypergraphSpaceProvider,
  useCreateEntity,
  usePublishToPublicSpace,
  useQuery,
  useSpace,
  useSpaces,
} from '@graphprotocol/hypergraph-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/private-space/$space-id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { 'space-id': spaceId } = Route.useParams();

  return (
    <HypergraphSpaceProvider space={spaceId}>
      <PrivateSpace />
    </HypergraphSpaceProvider>
  );
}

function PrivateSpace() {
  const { name, ready, id: spaceId } = useSpace({ mode: 'private' });
  const { data: projects } = useQuery(Project, { mode: 'private' });
  const { data: tasks } = useQuery(Task, { mode: 'private' });
  const { data: periods } = useQuery(Period, { mode: 'private' });
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  const createProject = useCreateEntity(Project);
  const createTask = useCreateEntity(Task);
  const createPeriod = useCreateEntity(Period);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [person, setPerson] = useState('');
  const [notes, setNotes] = useState('');
  const { mutate: publishToPublicSpace, isPending } = usePublishToPublicSpace({
    onSuccess: () => alert('Entity published to your public space'),
    onError: () => alert('Error publishing entity to your public space'),
  });

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading space...</p>
        </div>
      </div>
    );
  }

  const handleProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProject({ name: projectName, description: projectDescription, x: '' });
    setProjectName('');
    setProjectDescription('');
  };

  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTask({ name: taskName, description: taskDescription, status: taskStatus });
    setTaskName('');
    setTaskDescription('');
    setTaskStatus(false);
  };

  const handlePeriodSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPeriod({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      month,
      person,
      notes,
    });
    setStartDate('');
    setEndDate('');
    setMonth('');
    setPerson('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-slate-600 mt-1 text-sm">Private Space</p>
          <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
          <p className="text-slate-600 mt-1 text-sm">ID: {spaceId}</p>
          <p className="text-muted-foreground mt-6">
            Manage your private projects, tasks, and periods, then publish them to public spaces
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Project Form */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Create New Project</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="project-name" className="text-sm font-medium text-card-foreground">
                    Project Name
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="project-description" className="text-sm font-medium text-card-foreground">
                    Project Description
                  </label>
                  <input
                    id="project-description"
                    type="text"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Enter project description..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!projectName.trim()}>
                  Create Project
                </Button>
              </form>
            </div>

            {/* Create Task Form */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Create New Task</h2>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="task-name" className="text-sm font-medium text-card-foreground">
                    Task Name
                  </label>
                  <input
                    id="task-name"
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="task-description" className="text-sm font-medium text-card-foreground">
                    Task Description
                  </label>
                  <input
                    id="task-description"
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Enter task description..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="task-status" className="text-sm font-medium text-card-foreground">
                    Task Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      id="task-status"
                      type="checkbox"
                      checked={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-sm text-muted-foreground">Mark as completed</span>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={!taskName.trim()}>
                  Create Task
                </Button>
              </form>
            </div>

            {/* Create Period Form */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Create New Period</h2>
              <form onSubmit={handlePeriodSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="start-date" className="text-sm font-medium text-card-foreground">
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="end-date" className="text-sm font-medium text-card-foreground">
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="month" className="text-sm font-medium text-card-foreground">
                    Month
                  </label>
                  <select
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select month...</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="person" className="text-sm font-medium text-card-foreground">
                    Person
                  </label>
                  <input
                    id="person"
                    type="text"
                    value={person}
                    onChange={(e) => setPerson(e.target.value)}
                    placeholder="Enter person's name..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium text-card-foreground">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={!startDate || !endDate || !month || !person}>
                  Create Period
                </Button>
              </form>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">
                Your Projects ({projects?.length || 0})
              </h2>

              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">{project.name}</h3>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">ID: {project.id}</p>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label htmlFor="space" className="text-xs font-medium text-muted-foreground">
                            Select Public Space to Publish
                          </label>
                          <select
                            name="space"
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          >
                            <option value="">Choose a public space...</option>
                            {publicSpaces?.map((space) => (
                              <option key={space.id} value={space.id}>
                                {space.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          onClick={() => publishToPublicSpace({ entity: project, spaceId: selectedSpace })}
                          disabled={!selectedSpace || isPending}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Publish to Public Space
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No projects created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first project using the form</p>
                </div>
              )}
            </div>

            {/* Tasks List */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Your Tasks ({tasks?.length || 0})</h2>

              {tasks && tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">{task.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {task.status ? 'Completed' : 'Pending'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">ID: {task.id}</p>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label htmlFor="space" className="text-xs font-medium text-muted-foreground">
                            Select Public Space to Publish
                          </label>
                          <select
                            name="space"
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          >
                            <option value="">Choose a public space...</option>
                            {publicSpaces?.map((space) => (
                              <option key={space.id} value={space.id}>
                                {space.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          onClick={() => publishToPublicSpace({ entity: task, spaceId: selectedSpace })}
                          disabled={!selectedSpace || isPending}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Publish to Public Space
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No tasks created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first task using the form</p>
                </div>
              )}
            </div>

            {/* Periods List */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Your Periods ({periods?.length || 0})</h2>

              {periods && periods.length > 0 ? (
                <div className="space-y-4">
                  {periods.map((period) => (
                    <div key={period.id} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-foreground">{period.person}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {period.month}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-muted-foreground">ID: {period.id}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Start Date</p>
                          <p className="text-sm text-foreground">{new Date(period.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">End Date</p>
                          <p className="text-sm text-foreground">{new Date(period.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {period.notes && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground">Notes</p>
                          <p className="text-sm text-muted-foreground">{period.notes}</p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label htmlFor="space" className="text-xs font-medium text-muted-foreground">
                            Select Public Space to Publish
                          </label>
                          <select
                            name="space"
                            value={selectedSpace}
                            onChange={(e) => setSelectedSpace(e.target.value)}
                            className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          >
                            <option value="">Choose a public space...</option>
                            {publicSpaces?.map((space) => (
                              <option key={space.id} value={space.id}>
                                {space.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          onClick={() => publishToPublicSpace({ entity: period, spaceId: selectedSpace })}
                          disabled={!selectedSpace || isPending}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Publish to Public Space
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    <svg
                      className="mx-auto h-12 w-12 mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">No periods created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first period using the form</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
