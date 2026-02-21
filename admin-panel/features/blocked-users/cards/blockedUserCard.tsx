import { useState, useEffect } from "react";
import Image from "next/image";
import { Teacher } from "iconsax-react";
import { useAvatarUrl } from "@/hooks/userAvatarUrl";
import Button from "@/components/base/button"
import {UserData} from "@/types/data";
import {ArrowRight} from "lucide-react";
import { UserEditPopup } from "@/features/app/components/EditUserPopup";

type UserCardProps = { data: UserData;  onUnblock: () => void; onViewDetails: () => void; };

export const BlockedUserCard: React.FC<UserCardProps> = ({ data, ...props }) => {
    const [imageError, setImageError] = useState(false);
    const avatarSrc = useAvatarUrl(data?.profileImage);

    useEffect(() => setImageError(false), [data?.profileImage]);

    return (
        <div className="flex flex-col rounded-2xl border p-6 border-dark-50">
            <div className="flex justify-between">
                <div className="rounded-full bg-primary-50 overflow-hidden h-[60px] w-[60px] flex justify-center items-center">
                    {imageError ? (
                        <Teacher />
                    ) : (
                        <Image
                            src={avatarSrc}
                            height={60}
                            width={60}
                            alt={data.name}
                            className="rounded-full object-cover"
                            unoptimized
                            onError={() => setImageError(true)}
                        />
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <Button variant="secondary" className="py-2 px-4" onClick={props.onUnblock}>Unblock</Button>
                    {/*<Button variant="secondary" className="py-2 px-4" onClick={props.onForceDelete}>Remove</Button>*/}
                    {/*<Button variant="secondary" className="py-2 px-4" onClick={props.onEdit}>Edit</Button>*/}
                </div>
            </div>

            <div className="pt-4 font-bold text-xl font-secondary">{data.name}</div>

            <div className="text-dark-300 text-[13px]">{data.interests}</div>

            <div className="text-dark-300 text-[13px] pt-4 line-clamp-3 mb-auto">
                {data.designations}
            </div>

            <div className="flex gap-2 text-[13px] mt-3">
                <div>{data.averageScore} courses</div>
                <div>•</div>
                {/*<div>{data.courseCount} webinars</div>*/}
                <div>•</div>
                <div>{data.email} students</div>
            </div>

            {/*<Button*/}
            {/*    variant="link"*/}
            {/*    className="text-primary-500 font-medium flex gap-2 items-center mt-5 hover:underline active:text-primary-700 transition-colors duration-150 w-fit px-0"*/}
            {/*    onClick={props.onViewDetails}*/}
            {/*>*/}
            {/*    Read more*/}
            {/*    <ArrowRight size={20} />*/}
            {/*</Button>*/}
        </div>
    );
};
