"use client";

import { proxy } from "valtio";

export type EntityType = "profession" | "specialist";
export type ActionType = "add" | "edit";

export type CategoryState = {
    open: boolean;
    entity: EntityType;
    action: ActionType;
    initialValue?: string;
    mutationParams?: Record<string, any>;
    onSubmit?: (payload: { name: string } & Record<string, any>) => Promise<any>;
}

const initialState: CategoryState = {
    open: false,
    entity: "profession" as EntityType,
    action: "add" as ActionType,
    initialValue: "",
    mutationParams: {},
    onSubmit: undefined as CategoryState["onSubmit"],
}

export const categoryState = proxy<CategoryState>(initialState);





