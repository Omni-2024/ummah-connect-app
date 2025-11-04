import { cn } from "@/lib/className";
import CarouselSlider from "@/components/widgets/CarouselSlider";
import CardWrapper from "./CardWrapper";

export interface Props {
  children: React.ReactNode;
  layoutClassName?: string;
  sliderContainerClassName?: string;
  childrenContainerClassName?: string;
  slides?: {
    id: number;
    image: string;
    text: React.ReactNode;
  }[];
}

const AuthCardLayout: React.FC<Props> = ({
  children,
  layoutClassName,
  sliderContainerClassName,
  childrenContainerClassName,
  slides,
}) => {
  const renderQuoteText = ({
    quote,
    author,
  }: {
    quote: string;
    author?: string;
  }) => (
    <p className="w-11/12 text-start font-primary text-base leading-normal text-white">
      {quote}
      {author && (
        <span className="mt-3 block text-xs font-light">- {author}</span>
      )}
    </p>
  );

  return (
    <CardWrapper
      className={cn(
        "container flex min-h-svh w-screen justify-center gap-2 md:h-[90vh] md:min-h-[unset] md:w-[80vw]",
        layoutClassName
      )}
    >
      {/* Left side: children content */}
      <div
        className={cn(
          "flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-dark-50 scrollbar-corner-transparent",
          childrenContainerClassName
        )}
      >
        {children}
      </div>

      {/* Right side: carousel, visible only on large screens */}
      <div className={cn("hidden lg:flex lg:flex-1", sliderContainerClassName)}>
        <CarouselSlider
          slides={
            slides || [
              {
                id: 1,
                image:
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070",
                text: renderQuoteText({
                  quote:
                    "Join the Ummah Community - where faith meets professional excellence.",
                }),
              },
              {
                id: 2,
                image:
                  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=2070",
                text: renderQuoteText({
                  quote:
                    "Build, collaborate, and grow with your Muslim brothers and sisters.",
                }),
              },
            ]
          }
        />
      </div>
    </CardWrapper>
  );
};

export default AuthCardLayout;
