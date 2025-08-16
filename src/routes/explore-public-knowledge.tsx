import { ExploreTabs } from '@/components/explore-tabs';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/explore-public-knowledge')({
  component: ExploreLayout,
});

function ExploreLayout() {
  return (
    <div className="container mx-auto px-4 py-6">
      <ExploreTabs />
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
