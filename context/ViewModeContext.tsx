import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import axios from "axios";

type ViewMode = "client" | "company";

interface CompanyData {
  id: number;
  name: string;
  photo: string | null;
  backgroundImage: string | null;
  description: string | null;
}

interface ViewModeContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  setViewMode: (mode: ViewMode) => void;
  hasCompany: boolean;
  companyId: string | null;
  companyData: CompanyData | null;
  refreshCompanyData: () => Promise<void>;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
);

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:3001`;
  }
  return "http://192.168.1.10:3001";
};

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("client");
  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  // Carregar modo de visualização e companyId do SecureStore
  useEffect(() => {
    loadViewMode();
  }, []);

  async function loadViewMode() {
    try {
      // Verificar se usuário tem empresa
      const storedCompanyId = await SecureStore.getItemAsync("userCompanyId");
      setCompanyId(storedCompanyId);
      setHasCompany(!!storedCompanyId);

      // Se tem empresa, buscar dados da empresa
      if (storedCompanyId) {
        await fetchCompanyData(storedCompanyId);
      }

      // Se não tem empresa, força modo cliente
      if (!storedCompanyId) {
        setViewModeState("client");
        await SecureStore.setItemAsync("viewMode", "client");
        return;
      }

      // Carregar preferência salva
      const savedMode = await SecureStore.getItemAsync("viewMode");
      if (savedMode === "client" || savedMode === "company") {
        setViewModeState(savedMode);
      } else {
        // Padrão é cliente
        setViewModeState("client");
        await SecureStore.setItemAsync("viewMode", "client");
      }
    } catch (error) {
      console.error("Erro ao carregar modo de visualização:", error);
      setViewModeState("client");
    }
  }

  async function fetchCompanyData(id: string) {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) return;

      const API_URL = getApiUrl();
      const response = await axios.get(`${API_URL}/company/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data && response.data.company) {
        setCompanyData(response.data.company);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da empresa:", error);
    }
  }

  async function refreshCompanyData() {
    if (companyId) {
      await fetchCompanyData(companyId);
    }
  }

  async function setViewMode(mode: ViewMode) {
    try {
      // Se não tem empresa, só permite modo cliente
      if (!hasCompany && mode === "company") {
        return;
      }

      setViewModeState(mode);
      await SecureStore.setItemAsync("viewMode", mode);
    } catch (error) {
      console.error("Erro ao salvar modo de visualização:", error);
    }
  }

  function toggleViewMode() {
    const newMode = viewMode === "client" ? "company" : "client";
    setViewMode(newMode);
  }

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        toggleViewMode,
        setViewMode,
        hasCompany,
        companyId,
        companyData,
        refreshCompanyData,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
