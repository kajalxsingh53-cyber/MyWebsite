import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);

    const refresh = async () => {
        try {
            const { data } = await api.get("/settings");
            setSettings(data);
        } catch (e) {
            setSettings({});
        }
    };

    useEffect(() => { refresh(); }, []);

    return (
        <SettingsContext.Provider value={{ settings: settings || {}, refresh }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
