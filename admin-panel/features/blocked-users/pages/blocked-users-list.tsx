"use client"

import type React from "react"

import { useState } from "react"
import { useGeneralUsers } from "@/lib/hooks/useGeneralUsers"
import { Card, CardContent } from "@/components/base/card"
import  Button  from "@/components/base/button"
import { Input } from "@/components/base/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base/avatar"
import { Badge } from "@/components/base/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/base/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/base/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Search,
    Filter,
    MoreHorizontal,
    Users,
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    List,
    UserCheck,
    UserX,
    Mail,
    MapPin,
} from "lucide-react"
import {Roles, UserData} from "@/types/data"

const PAGE_SIZE = 12

const USER_ROLES = [
    { value: "admin", label: "Admin", color: "bg-red-100 text-red-800" },
    { value: "operational_admin", label: "Moderator", color: "bg-blue-100 text-blue-800" },
    { value: "user", label: "User", color: "bg-green-100 text-green-800" },
    { value: "root", label: "Guest", color: "bg-gray-100 text-gray-800" },
]

const COUNTRIES = [
    "All Countries",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "India",
    "Brazil",
]

export default function BlockedUsersList() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [countryFilter, setCountryFilter] = useState("All Countries")
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

    const {
        data: usersData,
        isLoading,
        error: userLoadingError,
        isError,
        refetch: refetchUsers,
    } = useGeneralUsers({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        search: search,
    })

    const handleRoleChange = (userId: string, newRole: string) => {
        // Handle role change logic here
        console.log(`Changing role for user ${userId} to ${newRole}`)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
    }

    const getRoleColor = (role: string) => {
        const roleConfig = USER_ROLES.find((r) => r.value === role.toLowerCase())
        return roleConfig?.color || "bg-gray-50 text-gray-700 border-gray-200"
    }

    const totalPages = Math.max(1, Math.ceil((usersData?.meta?.total ?? 0) / PAGE_SIZE))

    if (isError) {
        return (
            <div className="container mx-auto px-6 py-12">
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="p-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 rounded-full bg-destructive/10">
                                <Users className="h-8 w-8 text-destructive" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-foreground">Unable to Load Users</h2>
                                <p className="text-muted-foreground max-w-md">
                                    {userLoadingError?.message || "Something went wrong while fetching user data."}
                                </p>
                            </div>
                            <Button onClick={() => refetchUsers()} className="mt-6">
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-6 py-8 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-balance tracking-tight">User Management</h1>
                    <p className="text-lg text-muted-foreground">
                        Manage user accounts, roles, and permissions across your platform
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted rounded-lg p-1">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "link"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="h-8 px-3"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "secondary" : "link"}
                            size="sm"
                            onClick={() => setViewMode("table")}
                            className="h-8 px-3"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search users by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-12 h-12 text-base border-border/50 focus:border-primary"
                                />
                            </div>
                            <Button type="submit" className="h-12 px-8 font-medium">
                                Search Users
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="h-12 border-border/50">
                                        <div className="flex items-center">
                                            <Filter className="h-4 w-4 mr-3 text-muted-foreground" />
                                            <SelectValue placeholder="Filter by role" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        {USER_ROLES.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Select value={countryFilter} onValueChange={setCountryFilter}>
                                    <SelectTrigger className="h-12 border-border/50">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                                            <SelectValue placeholder="Filter by country" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COUNTRIES.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Users Content */}
            {isLoading ? (
                <div className="space-y-6">
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Card key={i} className="border-border/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <Skeleton className="h-14 w-14 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-5 w-full" />
                                                <Skeleton className="h-4 w-2/3" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-border/50">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <Skeleton className="h-4 w-28" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-36" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-20 rounded-full" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-8 w-8" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}
                </div>
            ) : !usersData?.data?.length ? (
                <Card className="border-border/50">
                    <CardContent className="p-16 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 rounded-full bg-muted">
                                <Users className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold">No Users Found</h2>
                                <p className="text-muted-foreground max-w-md">
                                    {search
                                        ? `No users match your search for "${search}"`
                                        : "No users have been added to your platform yet"}
                                </p>
                            </div>
                            {search && (
                                <Button
                                    variant="secondary"
                                    className="mt-6 bg-transparent"
                                    onClick={() => {
                                        setSearch("")
                                        setPage(1)
                                    }}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {viewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {usersData.data.map((user: UserData) => (
                                <Card
                                    key={user.id}
                                    className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20 hover:bg-card/50"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                <Avatar className="h-14 w-14 ring-2 ring-border group-hover:ring-primary/20 transition-colors">
                                                    <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg truncate text-foreground">{user.name}</h3>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        <span className="truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="h-3 w-3 mr-2" />
                                                    <span>{user.country}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    {user.active ? (
                                                        <UserCheck className="h-4 w-4 text-gray-900 mr-1" />
                                                    ) : (
                                                        <UserX className="h-4 w-4 text-gray-400 mr-1" />
                                                    )}
                                                    <Badge variant={user.active ? "default" : "secondary"} className="text-xs">
                                                        {user.active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                                <span className="text-sm text-muted-foreground">Role:</span>
                                                <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                                                    <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent hover:bg-muted/50 transition-colors">
                                                        <Badge className={`${getRoleColor(user.role)} border font-medium`}>
                                                            {USER_ROLES.find((r) => r.value === user.role)?.label || user.role}
                                                        </Badge>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {USER_ROLES.map((role) => (
                                                            <SelectItem key={role.value} value={role.value}>
                                                                {role.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {viewMode === "table" && (
                        <Card className="border-border/50 shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/30">
                                        <TableHead className="font-semibold text-foreground">User</TableHead>
                                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                                        <TableHead className="font-semibold text-foreground">Country</TableHead>
                                        <TableHead className="font-semibold text-foreground">Role</TableHead>
                                        <TableHead className="font-semibold text-foreground">Status</TableHead>
                                        <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersData.data.map((user: UserData) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors border-border/30">
                                            <TableCell className="py-4">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="h-10 w-10 ring-1 ring-border">
                                                        <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                            {user.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-foreground">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell className="text-foreground">{user.country}</TableCell>
                                            <TableCell>
                                                <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                                                    <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent hover:bg-muted/50 transition-colors">
                                                        <Badge className={`${getRoleColor(user.role)} border font-medium`}>
                                                            {USER_ROLES.find((r) => r.value === user.role)?.label || user.role}
                                                        </Badge>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {USER_ROLES.map((role) => (
                                                            <SelectItem key={role.value} value={role.value}>
                                                                {role.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {user.active ? (
                                                        <UserCheck className="h-4 w-4 text-gray-900 mr-2" />
                                                    ) : (
                                                        <UserX className="h-4 w-4 text-gray-400 mr-2" />
                                                    )}
                                                    <Badge variant={user.active ? "default" : "secondary"}>
                                                        {user.active ? "Active" : "Inactive"}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="primary" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    )}

                    {totalPages > 1 && (
                        <Card className="border-border/50 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>
                      Showing <span className="font-semibold text-foreground">{(page - 1) * PAGE_SIZE + 1}</span> to{" "}
                        <span className="font-semibold text-foreground">
                        {Math.min(page * PAGE_SIZE, usersData.meta?.total || 0)}
                      </span>{" "}
                        of <span className="font-semibold text-foreground">{usersData.meta?.total || 0}</span> users
                    </span>
                                        <Badge variant="secondary" className="text-xs font-medium">
                                            Page {page} of {totalPages}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* First page button */}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPage(1)}
                                            disabled={page <= 1}
                                            className="hidden sm:flex h-9 px-3"
                                        >
                                            First
                                        </Button>

                                        {/* Previous button */}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page <= 1}
                                            className="h-9 px-3"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-1">Previous</span>
                                        </Button>

                                        {/* Page numbers with smart truncation */}
                                        <div className="flex items-center gap-1">
                                            {(() => {
                                                const getPageNumbers = () => {
                                                    const delta = 2
                                                    const range = []
                                                    const rangeWithDots = []

                                                    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
                                                        range.push(i)
                                                    }

                                                    if (page - delta > 2) {
                                                        rangeWithDots.push(1, "...")
                                                    } else {
                                                        rangeWithDots.push(1)
                                                    }

                                                    rangeWithDots.push(...range)

                                                    if (page + delta < totalPages - 1) {
                                                        rangeWithDots.push("...", totalPages)
                                                    } else if (totalPages > 1) {
                                                        rangeWithDots.push(totalPages)
                                                    }

                                                    return rangeWithDots
                                                }

                                                return getPageNumbers().map((pageNum, index) => {
                                                    if (pageNum === "...") {
                                                        return (
                                                            <span key={`dots-${index}`} className="px-3 py-2 text-muted-foreground">
                                ...
                              </span>
                                                        )
                                                    }

                                                    const isCurrentPage = page === pageNum
                                                    return (
                                                        <Button
                                                            key={pageNum}
                                                            variant={isCurrentPage ? "primary" : "secondary"}
                                                            size="sm"
                                                            onClick={() => setPage(pageNum as number)}
                                                            className={`w-10 h-9 p-0 ${isCurrentPage ? "shadow-sm" : ""}`}
                                                            disabled={isCurrentPage}
                                                        >
                                                            {pageNum}
                                                        </Button>
                                                    )
                                                })
                                            })()}
                                        </div>

                                        {/* Next button */}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page >= totalPages}
                                            className="h-9 px-3"
                                        >
                                            <span className="hidden sm:inline mr-1">Next</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>

                                        {/* Last page button */}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPage(totalPages)}
                                            disabled={page >= totalPages}
                                            className="hidden sm:flex h-9 px-3"
                                        >
                                            Last
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center mt-6 pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-muted-foreground">Items per page:</span>
                                        <Select
                                            value={PAGE_SIZE.toString()}
                                            onValueChange={(value) => {
                                                // Handle page size change - you can implement this logic
                                                console.log(`Changing page size to ${value}`)
                                            }}
                                        >
                                            <SelectTrigger className="w-20 h-9 border-border/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="6">6</SelectItem>
                                                <SelectItem value="12">12</SelectItem>
                                                <SelectItem value="24">24</SelectItem>
                                                <SelectItem value="48">48</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    )
}
