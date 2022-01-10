import React, {createContext, useContext} from "react";
import type {FC} from "react";

export type ToggleContextType = {
    toggle: ()=>void,
};
const defaultContext = {
    toggle: ()=>{},
};
const ToggleContext = createContext<ToggleContextType>(defaultContext);
type ToggleContextProperties = {
    toggle: ()=>void,
};

export const ToggleThemeProvider: FC<ToggleContextProperties> =
({children, toggle}) => {
    const value = {toggle};
    return <ToggleContext.Provider value = {value}>{children}</ToggleContext.Provider>;
}

export const useToggleThemeContext = () => {
    const {toggle} = useContext(ToggleContext);
    return {toggle};
}