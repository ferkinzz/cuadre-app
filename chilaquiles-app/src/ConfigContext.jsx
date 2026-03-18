import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAppConfig, saveAppConfig, DEFAULT_CONFIG } from './api/firebase';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppConfig()
      .then(setConfig)
      .finally(() => setLoading(false));
  }, []);

  const updateConfig = async (newConfig) => {
    await saveAppConfig(newConfig);
    setConfig(newConfig);
  };

  if (loading) return null;

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
