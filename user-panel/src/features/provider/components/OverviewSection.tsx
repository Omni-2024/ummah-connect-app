import { Card } from "@/components/base/Card";
import { PersonIcon } from "@radix-ui/react-icons";
import { languages } from "@/lib/constants";

// ==================== OVERVIEW SECTION ====================
interface OverviewSectionProps {
  educator: any;
  getInterestsDisplay: () => { id: string; name: string }[];
  cleanedLanguages: string[];
}

export default function OverviewSection({ 
  educator, 
  getInterestsDisplay, 
  cleanedLanguages 
}: OverviewSectionProps) {
  
  // Convert language codes to full names
  const getLanguageName = (code: string): string => {
    const language = languages.find(
      (lang) => lang.value.toLowerCase() === code.toLowerCase()
    );
    return language ? language.label : code;
  };

  const displayLanguages = cleanedLanguages.map(getLanguageName);

  return (
    <div className="space-y-4">
      {/* About Me */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2">
          <PersonIcon className="size-4 sm:size-5 text-green-600" />
          About Me
        </h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {educator.bio || "No biography provided yet."}
        </p>
      </Card>
      
      {/* Skills & Expertise */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Skills & Expertise</h2>
        {getInterestsDisplay().length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {getInterestsDisplay().map((interest) => (
              <div
                key={interest.id}
                className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center"
              >
                <span className="text-green-700 font-medium text-xs sm:text-sm">
                  {interest.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-sm py-6">
            No specializations listed yet.
          </p>
        )}
      </Card>
      
      {/* Languages */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Languages</h2>
        {displayLanguages.length > 0 ? (
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {displayLanguages.map((language, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3 border">
                <p className="font-semibold text-gray-900 text-sm">{language}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center text-sm py-4">
            No languages specified.
          </p>
        )}
      </Card>
    </div>
  );
}
