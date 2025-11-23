import Button from "@/components/base/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/base/Dialog";

import Spinner from "@/components/base/Spinner";
import LoadingError from "@/components/widget/loadingError";

import { useGeneralUser } from "@/lib/hooks/useGeneralUsers";
import Image from "next/image";
import { useAvatarUrl } from "@/hooks/userAvatarUrl";

import { useEffect, useState, MouseEventHandler } from "react";
import { Teacher, TickCircle, CloseCircle } from "iconsax-react";

import { getProfessionsFn } from "@/lib/endpoints/categoriesFns";
import Request from "@/lib/http";

const ViewUser = (props: {
    id: string | undefined;
    open: boolean | undefined;
    onClose: () => void;
    setEditUser: (arg0: any) => void;
    onDelete: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {

    /** USER DATA */
    const { data: userData, isLoading, isError, error, refetch } =
        useGeneralUser(props.id);

    /** AVATAR HOOK — valid usage */
    const [imageError, setImageError] = useState(false);
    const avatarSrc = useAvatarUrl(userData?.profileImage);

    /** RESET IMAGE ERROR WHEN USER CHANGES */
    useEffect(() => {
        setImageError(false);
    }, [userData?.profileImage, props.open]);

    /** CATEGORY DATA */
    const [professions, setProfessions] = useState<any[]>([]);
    const [specialists, setSpecialists] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        loadCategoryData();
    }, []);

    const loadCategoryData = async () => {
        try {
            const profRes = await getProfessionsFn();
            setProfessions(profRes);

            const allSpecs: any[] = [];

            for (const p of profRes) {
                try {
                    const res = await Request<any[]>({
                        method: "get",
                        url: `/api/specialist?professionId=${p.id}`,
                    });

                    if (res?.data) {
                        allSpecs.push(...res.data);
                    }
                } catch (err) {
                    console.warn("Failed to load specialists for:", p.id);
                }
            }

            setSpecialists(allSpecs);
        } finally {
            setLoadingCategories(false);
        }
    };

    const formatDate = (v: any) =>
        v ? new Date(v).toLocaleDateString() : "—";

    const getProfessionName = (id: string) =>
        professions.find((p) => p.id === id)?.name || id;

    const getSpecialistName = (id: string) =>
        specialists.find((s) => s.id === id)?.name || id;

    return (
        <Dialog open={props.open} onOpenChange={props.onClose}>
            <DialogContent
                className="w-[92%] max-w-[750px] rounded-2xl shadow-xl !p-0 bg-white max-h-[85vh] flex flex-col"
            >

                {/* REQUIRED TO FIX ACCESSIBILITY ERROR */}
                <DialogTitle className="sr-only">
                    View User Details
                </DialogTitle>

                {/* HEADER */}
                <DialogHeader className="p-6 flex flex-col gap-4 border-b bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">

                    <div className="flex items-center gap-6">

                        {/* AVATAR */}
                        {!imageError && avatarSrc ? (
                            <Image
                                src={avatarSrc}
                                height={120}
                                width={120}
                                alt="avatar"
                                className="rounded-full object-cover h-[120px] w-[120px] shadow-md border border-indigo-200"
                                unoptimized
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="h-[120px] w-[120px] rounded-full bg-gray-200 flex items-center justify-center shadow-md border border-indigo-200">
                                <Teacher size={58} />
                            </div>
                        )}

                        {/* RIGHT SIDE INFO */}
                        <div className="flex flex-col gap-2">
                            <div className="text-2xl font-bold text-gray-900">
                                {userData?.name}
                            </div>

                            {userData?.verified ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                    <TickCircle size={16} color="#16a34a" /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full">
                                    Not Verified
                                </span>
                            )}

                            <span className="text-sm text-gray-700">
                                <span className="font-semibold">Country: </span>
                                {userData?.country || "—"}
                            </span>

                            <span className="text-sm text-gray-700">
                                <span className="font-semibold">Mobile: </span>
                                {userData?.contactNumber || "—"}
                            </span>

                            <span className="text-sm text-gray-700">
                                <span className="font-semibold">Since: </span>
                                {formatDate(userData?.createdAt)}
                            </span>
                        </div>
                    </div>
                </DialogHeader>

                {/* BODY */}
                <div className="p-5 flex-1 overflow-y-auto bg-white">

                    {isError ? (
                        <LoadingError error={error.message} reload={refetch} />
                    ) : isLoading || loadingCategories ? (
                        <div className="flex justify-center py-20">
                            <Spinner size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* GENDER */}
                            <div className="border p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white">
                                <p className="text-xs text-gray-500">Gender</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {userData?.gender || "—"}
                                </p>
                            </div>

                            {/* SAME GENDER ALLOWED */}
                            <div className="border p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white">
                                <p className="text-xs text-gray-500">Same Gender Allowed</p>
                                {userData?.sameGenderAllow ? (
                                    <span className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                        <TickCircle size={18} color="#16a34a" /> Allowed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                                        <CloseCircle size={18} color="#b91c1c" /> Not Allowed
                                    </span>
                                )}
                            </div>

                            {/* DESIGNATIONS */}
                            <div className="border p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white">
                                <p className="text-xs text-gray-500">Designations</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {userData?.designations?.length
                                        ? userData.designations
                                              .map((id: string) => getProfessionName(id))
                                              .join(", ")
                                        : "—"}
                                </p>
                            </div>

                            {/* INTERESTS */}
                            <div className="border p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white">
                                <p className="text-xs text-gray-500">Interests</p>
                                <p className="mt-1 font-semibold text-gray-900">
                                    {userData?.interests?.length
                                        ? userData.interests
                                              .map((id: string) => getSpecialistName(id))
                                              .join(", ")
                                        : "—"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <DialogFooter className="p-5">
                    <Button variant="secondary" onClick={props.onDelete}>
                        Remove User
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default ViewUser;
