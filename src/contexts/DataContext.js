import React, { useState, createContext } from 'react';
import getSitesData from '../data/SitesData';

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [sites, setSites] = useState(getSitesData());
  const deleteSite = (id) => {
    setSites(sites.filter(site => site.id != id));
  };

  return (
    <DataContext.Provider value={{ sites, deleteSite }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;