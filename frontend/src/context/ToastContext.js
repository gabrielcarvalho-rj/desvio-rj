import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

// const { sucesso, erro } = useToast();
export function useToast() {
    return useContext(ToastContext);
}
