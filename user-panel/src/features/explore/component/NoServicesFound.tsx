import Button from "@/components/base/Button";
import Image from "next/image";
import React from "react";
import {useExploreState} from "@/features/explore/context/exploreState";

type NoServicesFoundProps = {
  onExploreMoreServices: () => void;
};

const NoServiceFound: React.FC<NoServicesFoundProps> = ({
                                                            onExploreMoreServices,
}) => {
    const {
        searchTerm:search,
        profession,
    } =useExploreState()


  let title = "No Services Found";
  let descriptionPart1 =
    "It seems we couldn't find any services matching your criteria.";
  let descriptionPart2 = "";

  if (search && profession) {
    title = `No results found for "${search}" in ${profession}`;
    descriptionPart1 = `We couldn't find any exact matches related to `;
    descriptionPart2 = `"${search}" in ${profession}.`;
  } else if (search) {
    title = `No results found for "${search}"`;
    descriptionPart1 = `We couldn't find any exact matches related to `;
    descriptionPart2 = `${search}`;
  } else if (profession) {
    title = `No services found for ${profession}`;
    descriptionPart1 = `It seems we couldn't find any services in `;
    descriptionPart2 = `${profession}.`;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Image
        src="/icons/filled/hat.svg"
        alt="No Services Found Icon"
        width={64}
        height={64}
        className="h-16 w-16 text-primary-500"
      />
      <h2 className="mt-6 text-center text-2xl font-semibold text-dark-700">
        {title}
      </h2>

      <div className="mt-4 text-center">
        <p className="text-lg font-light text-dark-500">{descriptionPart1}</p>
        <p className="text-lg font-semibold text-dark-500">
          {descriptionPart2}
        </p>
      </div>

      <Button
        onClick={onExploreMoreServices}
        className="mt-8 rounded-full bg-primary-600 px-6 py-2 text-white shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-opacity-50"
      >
        Explore more Services
      </Button>
    </div>
  );
};

export default NoServiceFound;
