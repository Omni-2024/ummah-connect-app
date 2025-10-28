const StudentCountLabel = ({ count }: { count: number }) => {
  const getLabel = () => {
    if (count >= 1000) return `${count} Learners`;
    if (count >= 500) return "500+ Learners";
    if (count >= 300) return "300+ Learners";
    if (count >= 100) return "100+ Learners";
    return "50+ Learners";
  };

  return (
    <div className="relative w-full h-full">
      <span className="absolute bottom-1 right-2 text-[13px]">
        {getLabel()}
      </span>
    </div>
  );
};

export default StudentCountLabel;
