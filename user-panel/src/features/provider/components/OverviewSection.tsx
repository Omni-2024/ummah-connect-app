import { Card } from "@/components/base/Card";
import { PersonIcon } from "@radix-ui/react-icons";

interface OverviewSectionProps {
  educator: any;
  getInterestsDisplay: () => { id: string; name: string }[];
  cleanedLanguages: string[];
}

export default function OverviewSection({ educator, getInterestsDisplay, cleanedLanguages }: OverviewSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <PersonIcon className="size-5 text-green-600" />
          About Me
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {educator.bio || "No biography provided yet."}
          </p>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Skills & Expertise</h2>
        {getInterestsDisplay().length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getInterestsDisplay().map((interest) => (
              <div
                key={interest.id}
                className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
              >
                <span className="text-green-700 font-medium text-sm">
                  {interest.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No specializations listed yet.
          </p>
        )}
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Languages</h2>
        {cleanedLanguages.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {cleanedLanguages.map((language, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                <p className="font-semibold text-gray-900">{language}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No languages specified.
          </p>
        )}
      </Card>
    </div>
  );
}