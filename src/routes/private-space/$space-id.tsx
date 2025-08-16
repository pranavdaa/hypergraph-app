import { Button } from '@/components/ui/button';
import { Period } from '@/schema';
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
  const { data: periods } = useQuery(Period, { mode: 'private' });
  const { data: publicSpaces } = useSpaces({ mode: 'public' });
  const [selectedSpace, setSelectedSpace] = useState<string>('');

  const createPeriod = useCreateEntity(Period);
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
          <p className="text-muted-foreground mt-6">Manage your private periods, then publish them to public spaces</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-1">
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
  );
}
