"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/toast";
import LoadingError from "@/components/widget/loadingError";
import UserCardSkeletonList from "@/features/users/skeleton/user";
import { ListEmptyStateWithSearch } from "@/components/widget/ListEmptyStateWithSearch";
import { UserCard } from "@/features/users/cards/userCard";
import AdvancedPagination from "@/components/widget/advancedPagination";
import ViewUser from "@/components/popups/viewUser";
import RemoveDialog from "@/components/widget/removeDialog";
import { useGeneralUsers } from "@/lib/hooks/useGeneralUsers";
import {deleteUserFn, forceDeleteUserFn} from "@/lib/endpoints/usersFns";
import { UserEditPopup } from "@/features/app/components/EditUserPopup";
import Request from "@/lib/http";
import { getProfessionsFn } from "@/lib/endpoints/categoriesFns";
import { Users } from "lucide-react";

type ListUsersProps = {
  search: string;
  clearSearch: () => void;
};

enum PopupType {
  ViewUser = "viewUser",
  AddUser = "addUser",
  EditUser = "editUser",
  DeleteUser = "deleteUser",
  BlockUser = "blockUser",
}

const PAGE_SIZE = 10;
const SEARCH_LIMIT = 1000;

const ListUsers: React.FC<ListUsersProps> = ({ search, clearSearch }) => {
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [editRoleUser, setEditRoleUser] =
    useState<{ id: string; role: string } | null>(null);

  // ---------------------------------------------
  // SEARCH MODE
  // ---------------------------------------------
  const isSearching = Boolean(search);
  const limit = isSearching ? SEARCH_LIMIT : PAGE_SIZE;
  const offset = isSearching ? 0 : (page - 1) * PAGE_SIZE;

  /** 🚫 API SEARCH DISABLED (CLIENT-SIDE SEARCH) */
  const {
    data: userData,
    isLoading,
    error: userLoadingError,
    isError,
    refetch: refetchUsers,
  } = useGeneralUsers({
    limit,
    offset,
    search: "",
  });

  /** -----------------------------
   * CLIENT-SIDE SEARCH
   * ----------------------------*/
  const filteredUsers = useMemo(() => {
    if (!search) return userData?.data || [];
    const q = search.toLowerCase();

    return (userData?.data || []).filter((u: any) =>
      u.name?.toLowerCase().startsWith(q) ||
      u.email?.toLowerCase().startsWith(q)
    );
  }, [userData?.data, search]);

  /** DELETE USER */
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserFn,
    onSuccess: () => {
      refetchUsers();
      Toast.success("User blocked successfully");
      setPopupType(null);
      setSelectedUser(null);
    },
  });

  const { mutate: forceDeleteUser, isPending: isForceDeleting } = useMutation({
    mutationFn: forceDeleteUserFn,
    onSuccess: () => {
      refetchUsers();
      Toast.success("User deleted successfully");
      setPopupType(null);
      setSelectedUser(null);
    },
  });

  const totalPages = Math.max(
    1,
    Math.ceil((userData?.meta?.total ?? 0) / PAGE_SIZE)
  );

  /** AUTO PAGE FIX (NON-SEARCH MODE) */
  useEffect(() => {
    if (!isSearching && filteredUsers.length === 0 && page > 1) {
      setPage((prev) => Math.min(prev - 1, totalPages));
    }
  }, [filteredUsers.length, page, totalPages, isSearching]);

  /** RESET PAGE ON SEARCH */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /** PROFESSIONS & SPECIALISTS */
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
          if (res?.data) allSpecs.push(...res.data);
        } catch {
          console.warn("Failed to load specialists for:", p.id);
        }
      }
      setSpecialists(allSpecs);
    } finally {
      setLoadingCategories(false);
    }
  };

  const getProfessionName = (id: string) =>
    professions.find((p) => p.id === id)?.name || id;

  const getSpecialistName = (id: string) =>
    specialists.find((s) => s.id === id)?.name || id;

  if (isError) {
    return (
      <LoadingError
        error={userLoadingError.message}
        reload={refetchUsers}
      />
    );
  }

  if (isLoading || !userData || loadingCategories) {
    return <UserCardSkeletonList />;
  }

  return (
    <>
      {/* EMPTY STATES */}
      {!filteredUsers.length ? (
        search ? (
          <ListEmptyStateWithSearch
            name="user"
            searchQuery={search}
            onClear={clearSearch}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <Users size={36} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              No Users Available
            </h2>
            <p className="text-gray-600 max-w-sm">
              There are currently no users in the system.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(377px,1fr))] gap-4 py-12">
          {filteredUsers.map((user: any) => (
            <UserCard
              key={user.id}
              data={{
                ...user,
                designations:
                  user.designations?.map((id: string) =>
                    getProfessionName(id)
                  ) || [],
                interests:
                  user.interests?.map((id: string) =>
                    getSpecialistName(id)
                  ) || [],
              }}
              onEdit={() =>
                setEditRoleUser({ id: user.id, role: user.role })
              }
              onForceDelete={
                ()=>{
                  setSelectedUser(user.id);
                  setPopupType(PopupType.DeleteUser);
                }
              }
              onDelete={() => {
                setSelectedUser(user.id);
                setPopupType(PopupType.BlockUser);
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
        setEditUser={(id?: string) => {
          if (id) {
            setSelectedUser(id);
            setPopupType(PopupType.EditUser);
          }
        }}
        onDelete={() => {
          if (selectedUser) forceDeleteUser(selectedUser);
        }}
      />

      {/* DELETE */}
      <RemoveDialog
        name="user"
        open={popupType === PopupType.DeleteUser}
        loading={isForceDeleting}
        onRemove={() => {
          if (selectedUser) forceDeleteUser(selectedUser);
        }}
        onClose={() => {
          setPopupType(null);
          setSelectedUser(null);
        }}
        mode={"DELETE"}
      />

      {/* BLOCK */}
      <RemoveDialog
          name="user"
          open={popupType === PopupType.BlockUser}
          loading={isDeleting}
          onRemove={() => {
            if (selectedUser) deleteUser(selectedUser);
          }}
          onClose={() => {
            setPopupType(null);
            setSelectedUser(null);
          }}
          mode={"BLOCK"}
      />

      {/* EDIT */}
      <UserEditPopup
        open={!!editRoleUser}
        userId={editRoleUser?.id ?? null}
        currentRole={editRoleUser?.role ?? "admin"}
        onClose={() => setEditRoleUser(null)}
        onUpdate={refetchUsers}
      />
    </>
  );
};

export default ListUsers;
