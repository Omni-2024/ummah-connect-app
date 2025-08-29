export type LoginAction = "enroll" | "purchase" | undefined;

export const createLoginUrl = (callback: string, action?: LoginAction) => {
    const params = new URLSearchParams();
    if (callback) params.set("_callback", callback);
    if (action) params.set("_action", action);
    return `/user/login?${params.toString()}`;
};

export const getCallbackUrl = (path: string, action?: LoginAction) => {
    const params = new URLSearchParams();
    if (action) params.set("_action", action);
    return params.toString() ? `${path}?${params.toString()}` : path;
};
