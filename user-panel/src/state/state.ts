import { count } from "console";
import { proxy } from "valtio";

export const state= proxy({
    count: 0,
});