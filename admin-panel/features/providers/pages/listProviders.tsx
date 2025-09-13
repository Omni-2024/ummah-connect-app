import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/toast";
import LoadingError from "@/components/widget/loadingError";
import UserCardSkeletonList from "@/features/users/skeleton/user";
import { ListEmptyStateWithSearch } from "@/components/widget/ListEmptyStateWithSearch";
import Button from "@/components/base/button";
import { Plus } from "lucide-react";
import { ProviderCard } from "@/features/providers/cards/providerCard";
import AdvancedPagination from "@/components/widget/advancedPagination";
import ViewUser from "@/components/popups/viewUser";
import RemoveDialog from "@/components/widget/removeDialog";
import { useGeneralProviders } from "@/lib/hooks/useGeneralProviders";
import { deleteUserFn } from "@/lib/endpoints/usersFns";
import { EditProviderRolePopup } from "@/features/app/components/EditProviderPopup";

type ListProvidersProps = {
  search: string;
  clearSearch: () => void;
};

enum PopupType {
  ViewUser = "viewUser",
  AddUser = "addUser",
  EditUser = "editUser",
  DeleteUser = "deleteUser",
}

const ListProviders: React.FC<ListProvidersProps> = ({ search, clearSearch }) => {
  const PAGE_SIZE = 10;

  const [popupType, setPopupType] = useState<PopupType | null>();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editRoleUser, setEditRoleUser] = useState<{ id: string; role: string } | null>(null);

  const { data: userData, isLoading, error: userLoadingError, isError, refetch: refetchUsers } =
    useGeneralProviders({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      search,
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

  const totalPages = Math.max(1, Math.ceil((userData?.meta?.total ?? 0) / PAGE_SIZE));

    useEffect(() => {
        if ((userData?.data?.length ?? 0) === 0 && page > 1) {
            setPage((prev) => Math.min(prev - 1, totalPages));
        }
    }, [userData?.data?.length, page, totalPages]);


  useEffect(() => {
    setPage(1);
  }, [search]);

  if (isError)
    return <LoadingError error={userLoadingError.message} reload={refetchUsers} />;

  if (isLoading || !userData) return <UserCardSkeletonList />;

  return (
    <>
      {userData?.data?.length === 0 ? (
        search ? (
          <ListEmptyStateWithSearch
            name="user"
            searchQuery={search}
            onClear={clearSearch}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">No Providers Yet</h2>
              <p className="text-gray-600">Start by adding your first provider</p>
            </div>
            <Button onClick={() => setPopupType(PopupType.AddUser)}>
              <Plus />
              Add New Provider
            </Button>
          </div>
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(377px,1fr))] gap-4 py-12">
          {userData?.data?.map((user) => (
            <ProviderCard
              key={user.id}
              data={user}
              onEdit={() => setEditRoleUser({ id: user.id, role: user.role })}
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
        </div>
      )}

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
              } }
              setEditUser={(id: string | undefined) => {
                  if (id) {
                      setSelectedUser(id);
                      setPopupType(PopupType.EditUser);
                  }
              } } onDelete={function (): void {
                  throw new Error("Function not implemented.");
              } }      />

      <RemoveDialog
        name="user"
        onRemove={() => {
          if (selectedUser) deleteUser(selectedUser);
        }}
        onClose={() => {
          setPopupType(null);
          setSelectedUser(null);
        }}
        open={popupType === PopupType.DeleteUser}
        loading={isDeleting}
      />

      <EditProviderRolePopup
        open={!!editRoleUser}
        userId={editRoleUser?.id ?? null}
        currentRole={editRoleUser?.role ?? "admin"}
        onClose={() => setEditRoleUser(null)}
        onUpdate={refetchUsers}
      />
    </>
  );
};

export default ListProviders;
