type RenderDivProps = {
  count?: number;
};

// not a best practice do this couldn't found a better way
// to do grid with alignment
const DivRenderer: React.FC<RenderDivProps> = ({
  count = 5,
}: RenderDivProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: We have to use it there is no other way easy way 🥲
        <div key={i} />
      ))}
    </>
  );
};

export default DivRenderer;
