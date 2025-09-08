"use client"
import withAuth from "@/components/withAuth";
import Button from "@/components/base/button";
import Input from "@/components/base/form/Input";
import { useRef, useState } from "react";
import { ADMIN_ROLES } from "@/lib/constants";
import ListUsers from "@/features/users/pages/listUsers";

const SuperAdminCategoriesDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="px-6 py-8">
            <div>
                <form
                    className="flex justify-end gap-3 px-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSearchQuery(
                            (
                                new FormData(e.target as HTMLFormElement).get(
                                    "search"
                                ) as string
                            ).trim()
                        );
                    }}
                >
                    <div className="max-w-md">
                        <Input
                            ref={inputRef}
                            className="py-3 px-6 min-w-72 max-w-96"
                            placeholder="Search here..."
                            name="search"
                        />
                    </div>
                    <Button variant="secondary" className="py-3 h-auto">
                        Search
                    </Button>
                </form>
                {searchQuery.length !== 0 && (
                    <h2 className="text-xl pt-6 font-semibold">
                        Search results for &quot;{searchQuery}&quot;
                    </h2>
                )}
                <ListUsers
                    search={searchQuery}
                    clearSearch={() => {
                        setSearchQuery("");
                        if (inputRef.current) inputRef.current.value = "";
                    }}
                />
            </div>
        </div>
    );
};

export default withAuth(
    SuperAdminCategoriesDashboard,
    [ADMIN_ROLES.ADMIN, ADMIN_ROLES.OPERATIONAL_ADMIN, ADMIN_ROLES.ROOT]
);
