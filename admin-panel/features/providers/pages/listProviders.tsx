import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/toast";
import LoadingError from "@/components/widget/loadingError";
import UserCardSkeletonList from "@/features/users/skeleton/user";
import { ListEmptyStateWithSearch } from "@/components/widget/ListEmptyStateWithSearch";
import { Users } from "lucide-react";
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
  EditUser = "editUser",
  DeleteUser = "deleteUser",
}

const PAGE_SIZE = 10;
const SEARCH_LIMIT = 1000;

const ListProviders: React.FC<ListProvidersProps> = ({ search, clearSearch }) => {
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editRoleUser, setEditRoleUser] =
    useState<{ id: string; role: string } | null>(null);

  // ---------------------------------------------
  // SEARCH MODE LOGIC
  // ---------------------------------------------
  const isSearching = Boolean(search);

  const limit = isSearching ? SEARCH_LIMIT : PAGE_SIZE;
  const offset = isSearching ? 0 : (page - 1) * PAGE_SIZE;

  // ---------------------------------------------
  // FETCH PROVIDERS
  // ---------------------------------------------
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch: refetchUsers,
  } = useGeneralProviders({
    limit,
    offset,
    search: "", // client-side filtering
  });

  // ---------------------------------------------
  // CLIENT-SIDE SEARCH
  // ---------------------------------------------
  const filteredProviders = useMemo(() => {
    if (!search) return userData?.data || [];
    const q = search.toLowerCase();
    return (userData?.data || []).filter((u) =>
      u.name.toLowerCase().startsWith(q)
    );
  }, [userData?.data, search]);

  // ---------------------------------------------
  // DELETE USER
  // ---------------------------------------------
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      Toast.success("User deleted successfully");
      refetchUsers();
      setPopupType(null);
      setSelectedUser(null);
    },
  });

  // ---------------------------------------------
  // AUTO PAGE ADJUST (non-search mode)
  // ---------------------------------------------
  useEffect(() => {
    if (!isSearching && filteredProviders.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [filteredProviders.length, page, isSearching]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  if (isError)
    return (
      <LoadingError
        error={(error as Error)?.message}
        reload={refetchUsers}
      />
    );

  if (isLoading || !userData) return <UserCardSkeletonList />;

  return (
    <>
      {/* EMPTY STATES */}
      {!filteredProviders.length ? (
        search ? (
          <ListEmptyStateWithSearch
            name="Freelancers"
            searchQuery={search}
            onClear={clearSearch}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <Users size={36} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              No Providers Available
            </h2>
            <p className="text-gray-600 max-w-sm">
              There are currently no providers in the system.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(377px,1fr))] gap-4 py-12">
          {filteredProviders.map((user) => (
            <ProviderCard
              key={user.id}
              data={user}
              onEdit={() =>
                setEditRoleUser({ id: user.id, role: user.role })
              }
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

      {/* PAGINATION (DISABLED DURING SEARCH) */}
      {userData?.meta?.total > PAGE_SIZE && !isSearching && (
        <AdvancedPagination
          currentPage={page}
          totalPages={Math.ceil(userData.meta.total / PAGE_SIZE)}
          onChange={setPage}
        />
      )}

      {/* VIEW USER */}
      <ViewUser
        open={popupType === PopupType.ViewUser}
        id={selectedUser ?? undefined}
        onClose={() => {
          setPopupType(null);
          setSelectedUser(null);
        }}
        setEditUser={(id) => {
          if (id) {
            setSelectedUser(id);
            setPopupType(PopupType.EditUser);
          }
        }}
        onDelete={() => {}}
      />

      {/* DELETE USER */}
      <RemoveDialog
        name="user"
        open={popupType === PopupType.DeleteUser}
        loading={isDeleting}
        onRemove={() => {
          if (selectedUser) deleteUser(selectedUser);
        }}
        onClose={() => {
          setPopupType(null);
          setSelectedUser(null);
        }}
      />

      {/* EDIT ROLE */}
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
