"use client";
import { useMemo } from "react";
import { useExploreState } from "@/features/explore/context/exploreState";
import { useCategories } from "@/lib/hooks/useCategories";

export const useExploreFilters = (onResetPage?: () => void) => {
    const {
        profession,
        setProfession,
        setProfessionName,
        specialties: snapSpecs,
        setSpecialties,
        setOffset,
    } = useExploreState();
    const { data: categories } = useCategories();

    // turn readonly snapshot into mutable array for safe ops
    const specialties = useMemo(() => Array.from(snapSpecs ?? []), [snapSpecs]);

    const resetPaging = () => {
        onResetPage?.();
        setOffset(0);
    };

    const changeProfession = (professionId: string) => {
        const clear = !professionId || professionId === "all";
        onResetPage?.();
        setOffset(0);

        if (clear) {
            setProfession("");
            setProfessionName("");
            setSpecialties([]);
            return;
        }

        if (profession === professionId) {
            // clicking the already-selected one -> clear
            setProfession("");
            setProfessionName("");
            setSpecialties([]);
            return;
        }

        setProfession(professionId);
        setProfessionName(categories?.find((c) => c.id === professionId)?.name || "");
        setSpecialties([]); // switching profession resets specialists
    };

    const toggleSpecialty = (specialtyId: string) => {
        resetPaging();
        const next = specialties.includes(specialtyId)
            ? specialties.filter((id) => id !== specialtyId)
            : [...specialties, specialtyId];
        setSpecialties(next);
    };

    return {
        categories,
        profession,
        specialties,
        changeProfession,
        toggleSpecialty,
    };
};
