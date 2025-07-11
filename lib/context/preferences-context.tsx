import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createNextClient } from "../clients/next";
import { Preferences } from "../types/playlist";
import { useAuth } from "./auth-context";

type PreferenceValue = {
  setPreference: (key: string, value: any) => void;
  preferences: Preferences;
};

const PreferencesContext = createContext({} as PreferenceValue);

const PreferencesProvider = (props) => {
  const client = createNextClient();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>();

  const setPreference = useCallback(
    async (key: string, value) => {
      preferences[key] = value;
      setPreferences({ ...preferences, [key]: value });
      localStorage.setItem("preferences", JSON.stringify(preferences));
      await client.post("preferences/set", { preferences });
    },
    [client, preferences],
  );

  useEffect(() => {
    if (user) {
      const preferences = user.preferences ?? ({} as Preferences);
      localStorage.setItem("preferences", JSON.stringify(preferences));
      setPreferences(preferences);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      setPreference,
      preferences,
    }),
    [setPreference, preferences],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

const usePreferences = () => {
  const context = React.useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

export { PreferencesProvider, usePreferences };
