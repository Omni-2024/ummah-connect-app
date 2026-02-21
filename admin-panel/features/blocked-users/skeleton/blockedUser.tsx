import { Skeleton } from "@/components/base/skeleton";

const UserCardSkeleton = () => {
    return (
        <div className="flex flex-col rounded-2xl border p-6 border-dark-50">
            {/* Top section: Image and buttons */}
            <div className="flex justify-between">
        {/* Skeleton for the profile image */}
        <div className="rounded-full bg-primary-50 overflow-hidden h-[60px] w-[60px] flex justify-center items-center">
    <Skeleton className="w-[60px] h-[60px] rounded-full" />
        </div>

    {/* Skeleton for the buttons */}
    <div className="flex gap-2 items-center">
    <Skeleton className="w-[70px] h-[36px] rounded-md" />
    <Skeleton className="w-[70px] h-[36px] rounded-md" />
        </div>
        </div>

    {/* Name */}
    <div className="pt-4">
    <Skeleton className="w-[150px] h-[20px]" />
        </div>

    {/* Designation */}
    <div className="pt-2">
    <Skeleton className="w-[180px] h-[16px]" />
        </div>

    {/* Bio section */}
    <div className="pt-4 mb-auto">
    <Skeleton className="w-full h-[60px]" />
        </div>

    {/* Courses and students */}
    <div className="flex gap-2 text-[13px] mt-3">
    <Skeleton className="w-[80px] h-[14px]" />
        <div>•</div>
    <Skeleton className="w-[80px] h-[14px]" />
        </div>

    {/* Read more link */}
    <div className="mt-5 flex gap-2 items-center">
    <Skeleton className="w-[100px] h-[14px]" />
    <Skeleton className="w-[20px] h-[20px]" />
        </div>
        </div>
);
};

const UserCardSkeletonList = ({ count = 12 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(377px,1fr))] gap-4 py-12">
            {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey:
        <UserCardSkeleton key={index} />
))}
    </div>
);
};

export default UserCardSkeletonList;
