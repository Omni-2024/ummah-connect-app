import { proxy } from "valtio"

export type ChatState = {
    providerId:string
    isOneChat:boolean
}

const initialState: ChatState = {
    providerId: "",
    isOneChat:true
}



export const chatState = proxy<ChatState>(initialState)

export const setProviderId = (id: string) => {
    chatState.providerId = id;
};

export const setIsOneChat = (chatToggle: boolean) => {
    chatState.isOneChat = chatToggle;
};





