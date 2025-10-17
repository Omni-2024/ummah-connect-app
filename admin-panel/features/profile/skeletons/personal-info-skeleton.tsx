import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";

export default function PersonalInfoSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 w-40 bg-muted rounded mb-2" />
          <div className="h-3 w-64 bg-muted rounded" />
        </div>
        <div className="h-8 w-24 bg-muted rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((_, i) => (
          <Card key={i} className="bg-card/30 border-[#337f7c]/50 shadow-md">
            <CardHeader>
              <CardTitle className="h-5 w-32 bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((__, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
