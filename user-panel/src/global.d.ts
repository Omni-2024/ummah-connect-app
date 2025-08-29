export {};

declare global {
    interface Window {
        gtag: (
            command: 'event' | 'config' | 'set' | 'js',
            eventName: string,
            eventParams?: Record<string, any>
        ) => void;
        dataLayer: any[];
    }
    interface IOneSignalOneSignal {
        Slidedown: IOneSignalSlidedown;
        Notifications: IOneSignalNotifications;
        Session: IOneSignalSession;
        User: IOneSignalUser;
        Debug: IOneSignalDebug;
        login(externalId: string, jwtToken?: string): Promise<void>;
        logout(): Promise<void>;
        init(options: IInitObject): Promise<void>;
        setConsentGiven(consent: boolean): Promise<void>;
        setConsentRequired(requiresConsent: boolean): Promise<void>;
    }
}