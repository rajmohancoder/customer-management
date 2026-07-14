import { PageHeader } from '../components/PageHeader';

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4 h-20 rounded-md bg-gray-50" />
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your customer management preferences."
      />

      <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">
          Settings are not yet available in this module.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlaceholderCard
          title="Notification Preferences"
          description="Configure email and in-app notification settings for customer events."
        />
        <PlaceholderCard
          title="Default View Settings"
          description="Customize default table views, column visibility, and display options."
        />
        <PlaceholderCard
          title="Export Configuration"
          description="Set up data export formats, schedules, and delivery preferences."
        />
      </div>
    </div>
  );
}
