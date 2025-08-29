import { proxy } from 'valtio';

export type ForgotPasswordStep = "enter-email" | "check-inbox";

type ForgotPasswordState = {
    forgotPasswordStep: ForgotPasswordStep;
    email: string;
};

const initialState: ForgotPasswordState = {
    forgotPasswordStep: "enter-email",
    email: "",
};

export const forgotPasswordState = proxy<ForgotPasswordState>(initialState);

export const setForgotPasswordStep = (step: ForgotPasswordStep) => {
    forgotPasswordState.forgotPasswordStep = step;
};

export const setEmail = (email: string) => {
    forgotPasswordState.email = email;
};

export const resetForgotPasswordState = () => {
    forgotPasswordState.forgotPasswordStep = "enter-email";
    forgotPasswordState.email = "";
};