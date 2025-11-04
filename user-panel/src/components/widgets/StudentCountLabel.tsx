const StudentCountLabel = ({ count }: { count: number }) => {
  const getLabel = () => {
    if (count >= 1000) return `${count} Learners`;
    if (count >= 500) return "500+ Learners";
    if (count >= 300) return "300+ Learners";
    if (count >= 100) return "100+ Learners";
    return "50+ Learners";
  };

  return (
    <>
      {/* <span>•</span>{" "} */}
<div className="w-full">
  <p className="text-right">{getLabel()}</p>
</div>
    </>
  );
};

export default StudentCountLabel;
