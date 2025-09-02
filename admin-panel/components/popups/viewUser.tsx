import Button from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/base/Dialog";
import Spinner from "@/components/base/Spinner";
import LoadingError from "@/components/widget/loadingError";
import {useGeneralUser} from "@/lib/hooks/useGeneralUsers";
import Image from "next/image";
import {useAvatarUrl} from "@/hooks/userAvatarUrl";
import {useEffect, useState} from "react";
import {Teacher} from "iconsax-react";

type ViewUsersProps = {
    children?: React.ReactNode;
    id?: string;
    open: boolean;
    onClose: () => void;
    setEditUser: (id: string | undefined) => void;
    onDelete: () => void;
};

const ViewUser: React.FC<ViewUsersProps> = (props) => {
    const {
        data: userData,
        isLoading,
        isError,
        error: educatorLoadingError,
        refetch: refetchEducator,
    } = useGeneralUser(props.id);

    const [imageError, setImageError] = useState(false);
    const avatarSrc = useAvatarUrl(userData?.profileImage);

    useEffect(() => setImageError(false), [userData?.profileImage]);

    return (
        <Dialog
            open={props.open}
            onOpenChange={() => {
                props.onClose();
            }}
        >
            <DialogContent className="sm:max-w-[1020px]">
                <DialogHeader className="p-6">
                    <DialogTitle className="font-primary font-bold text-xl">
                        Educator details
                    </DialogTitle>

                    <DialogDescription className="hidden">
                        details of the educator
                    </DialogDescription>
                </DialogHeader>

                {isError ? (
                    <LoadingError
                        error={educatorLoadingError.message}
                        reload={refetchEducator}
                    />
                ) : isLoading ? (
                    <div className="flex justify-center items-center py-36">
                        <Spinner size={40} />
                    </div>
                ) : (
                    <div className="space-y-6 p-6">
                        <div className="flex gap-4 items-center">
                            {imageError ? (
                                <Teacher />
                            ) : (
                                <Image
                                    src={avatarSrc}
                                    height={60}
                                    width={60}
                                    alt={"profile"}
                                    className="rounded-full h-[124px] w-[124px] object-cover"
                                    unoptimized
                                    onError={() => setImageError(true)}
                                />
                            )}
                            <div>
                                <div className="font-bold text-[25px] font-primary">
                                    {userData?.name}
                                </div>
                                <div className="text-dark-300 font-normal">
                                    {userData?.company}
                                </div>
                            </div>
                        </div>

                        <div className="font-light">{userData?.country}</div>
                    </div>
                )}

                <DialogFooter className="block pt-3">
                    <Button
                        className="!w-fit"
                        onClick={() => {
                            props.setEditUser(props.id);
                        }}
                    >
                        Edit details
                    </Button>
                    <Button variant="secondary" onClick={props.onDelete}>
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewUser;
