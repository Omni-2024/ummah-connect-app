import { useSnapshot } from 'valtio';
import { forgotPasswordState, resetForgotPasswordState, setEmail, setForgotPasswordStep } from './ForgotPasswordState';

export const useForgotPasswordState = () => {
    const snap = useSnapshot(forgotPasswordState);
    return {
        forgotPasswordStep: snap.forgotPasswordStep,
        email: snap.email,
        //
        setForgotPasswordStep: setForgotPasswordStep,
        setEmail: setEmail,
        resetForgotPasswordState: resetForgotPasswordState,
    };
};
