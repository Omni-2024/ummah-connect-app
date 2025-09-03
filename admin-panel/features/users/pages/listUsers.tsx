import DivRenderer from "@/components/widget/renderDivs";
import { useEffect, useState } from "react";
import RemoveDialog from "@/components/widget/removeDialog";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/Toast";
import LoadingError from "@/components/widget/loadingError";
import AdvancedPagination from "@/components/widget/advancedPagination";
import { ListEmptyStateWithSearch } from "@/components/widget/ListEmptyStateWithSearch";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGeneralUsers} from "@/lib/hooks/useGeneralUsers";
import ViewUser from "@/components/popups/viewUser";
import UserCardSkeletonList from "@/features/users/skeleton/user";
import {deleteUserFn} from "@/lib/endpoints/usersFns";
import {UserCard} from "@/features/users/cards/userCard";

type ListUsersProps = {
    search: string;
    clearSearch: () => void;
};

enum PopupType {
    ViewUser = "viewUser",
    AddUser = "addUser",
    EditUser = "editUser",
    DeleteUser = "deleteUser",
    DeleteUserError = "deleteUserError",
}

const PAGE_SIZE = 10;

const ListUsers: React.FC<ListUsersProps> = (props) => {
    const [popupType, setPopupType] = useState<PopupType | null>();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const {
        data: userData,
        isLoading,
        error: userLoadingError,
        isError,
        refetch: refetchUsers,
    } = useGeneralUsers({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        search: props.search,
    });

    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
        mutationFn: deleteUserFn,
        onSuccess: () => {
            refetchUsers();
            Toast.success("User deleted successfully");
            setPopupType(null);
            setSelectedUser(null);
        },
    });

    const totalPages = Math.max(
        1,
        Math.ceil((userData?.meta.total ?? 0) / PAGE_SIZE)
    );

    useEffect(() => {
        if (userData?.data.length === 0 && page > 1) {
            setPage((prev) => Math.min(prev - 1, totalPages));
        }
    }, [userData?.data.length, page, totalPages]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        setPage(1);
    }, [props.search]);

    if (isError)
        return (
            <LoadingError
                error={userLoadingError.message}
                reload={refetchUsers}
            />
        );
    if (isLoading || !userData) return <UserCardSkeletonList />;

    const renderContent = () => {
        if (userData.data.length === 0) {
            if (props.search) {
                return (
                    <ListEmptyStateWithSearch
                        name="user"
                        searchQuery={props.search}
                        onClear={props.clearSearch}
                    />
                );
            }

            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                            No Hosts Yet
                        </h2>
                        <p className="text-gray-600">
                            Start by adding your first host to the platform
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setPopupType(PopupType.AddUser);
                            setSelectedUser(null);
                        }}
                    >
                        <Plus />
                        Add New Host
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(377px,1fr))] gap-4 py-12">
                {userData.data.map((user) => (
                    <UserCard
                        key={user.id}
                        data={user}
                        onEdit={() => {
                            setSelectedUser(user.id);
                            setPopupType(PopupType.EditUser);
                        }}
                        onDelete={() => {
                            setSelectedUser(user.id);
                            setPopupType(PopupType.DeleteUser);
                        }}
                        onViewDetails={() => {
                            setSelectedUser(user.id);
                            setPopupType(PopupType.ViewUser);
                        }}
                    />
                ))}
                <DivRenderer />
            </div>
        );
    };

    return (
        <>
            {renderContent()}
            {userData?.meta?.total > PAGE_SIZE && (
                <AdvancedPagination
                    currentPage={page}
                    totalPages={Math.ceil(userData.meta.total / PAGE_SIZE)}
                    onChange={setPage}
                />
            )}

            <ViewUser
                open={popupType === PopupType.ViewUser}
                id={selectedUser ?? undefined}
                onClose={() => {
                    setPopupType(null);
                    setSelectedUser(null);
                }}
                setEditUser={(id: string | undefined) => {
                    if (id) {
                        setSelectedUser(id);
                        setPopupType(PopupType.EditUser);
                    }
                }}
                onDelete={() => {
                    if (userData?.data[0]) {
                        setSelectedUser(userData.data[0].id);
                        setPopupType(PopupType.DeleteUser);
                    }
                }}
            />

            {/*<EditEducatorPopup*/}
            {/*    open={popupType === PopupType.AddEducator}*/}
            {/*    onClose={(refresh) => {*/}
            {/*        setPopupType(null);*/}
            {/*        setSelectedEducator(null);*/}
            {/*        if (refresh) refetchEducators();*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<EditEducatorPopup*/}
            {/*    open={popupType === PopupType.EditEducator}*/}
            {/*    id={selectedEducator ?? undefined}*/}
            {/*    onClose={(refresh) => {*/}
            {/*        setPopupType(null);*/}
            {/*        setSelectedEducator(null);*/}
            {/*        if (refresh) refetchEducators();*/}
            {/*    }}*/}
            {/*/>*/}

            <RemoveDialog
                name="user"
                onRemove={() => {
                    if (selectedUser) deleteUserFn(selectedUser);
                }}
                onClose={() => {
                    setPopupType(null);
                    setSelectedUser(null);
                }}
                open={popupType === PopupType.DeleteUser}
                loading={isDeleting}
            />
        </>
    );
};

export default ListUsers;
