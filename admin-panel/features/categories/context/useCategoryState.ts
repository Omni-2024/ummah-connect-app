"use client";

import { useSnapshot } from "valtio";
import { categoryState } from "./categoryState";
import type { ActionType, EntityType, CategoryState } from "./categoryState";

type OpenModalCfg = Omit<CategoryState, "open">;

export function useCategoriesState() {
    const snap = useSnapshot(categoryState);

    const openModal = (cfg: OpenModalCfg) => {
        Object.assign(categoryState, { ...cfg, open: true });
    };

    const closeModal = () => {
        Object.assign(categoryState, {
            open: false,
            initialValue: "",
            mutationParams: {},
            onSubmit: undefined,
        });
    };

    // Optional granular setters (handy if you need them anywhere)
    const setAction = (action: ActionType) => (categoryState.action = action);
    const setEntity = (entity: EntityType) => (categoryState.entity = entity);
    const setInitialValue = (v?: string) => (categoryState.initialValue = v ?? "");
    const setMutationParams = (p?: Record<string, any>) => (categoryState.mutationParams = p ?? {});
    const setOnSubmit = (
        fn?: (payload: { name: string } & Record<string, any>) => Promise<any>,
    ) => (categoryState.onSubmit = fn);

    return {
        // state
        open: snap.open,
        entity: snap.entity,
        action: snap.action,
        initialValue: snap.initialValue,
        mutationParams: snap.mutationParams,
        onSubmit: snap.onSubmit,

        // actions
        openModal,
        closeModal,
        setAction,
        setEntity,
        setInitialValue,
        setMutationParams,
        setOnSubmit,
    };
}
