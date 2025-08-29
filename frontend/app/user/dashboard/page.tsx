export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
        <p className="text-muted-foreground mt-2">Your personal dashboard for Islamic services</p>
      </div>

      <div className="bg-card p-8 rounded-lg border border-border text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">
          The user dashboard will be implemented in a future update. You'll be able to browse services, manage orders,
          and communicate with providers here.
        </p>
      </div>
    </div>
  )
}
