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
    author: string;
  }) => (
    <p className="w-11/12 text-start font-primary text-base leading-normal text-white">
      {quote}
      <span className="mt-3 block text-xs font-light">- {author}</span>
    </p>
  );

  return (
    <CardWrapper
      className={cn(
        "container flex min-h-svh w-screen justify-center gap-2 md:h-[90vh] md:min-h-[unset] md:w-[80vw]",
        layoutClassName,
      )}
    >
      <div
        className={cn(
          "flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-dark-50 scrollbar-corner-transparent",
          childrenContainerClassName,
        )}
      >
        {children}
      </div>

      <div className={cn("flex-[0] lg:flex-1", sliderContainerClassName)}>
        <CarouselSlider
          slides={[
            {
              id: 1,
              image: "/images/auth-card.jpeg",
              text: renderQuoteText({
                quote:
                  "“Nobody can go back and start a new beginning, but anyone can start today and make a new ending.”",
                author: "Maria Robinson",
              }),
            },
            {
              id: 2,
              image: "/images/course-card.jpeg",
              text: renderQuoteText({
                quote:
                  "“The only way to do great work is to love what you do.”",
                author: "Steve Jobs",
              }),
            },
          ]}
        />
      </div>
    </CardWrapper>
  );
};

export default AuthCardLayout;
