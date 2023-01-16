import React, { useState, createContext } from 'react';
import getSitesData from '../data/SitesData';

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [sites, setSites] = useState(getSitesData());
  const deleteSite = (id) => {
    setSites(sites.filter(site => site.id != id));
  };
  const addSite = (item) => {
    setSites([...sites, item]);
  };
  const updateSite = (item) => {
    setSites(sites.map(site => {
      if (site.id == item.id) {
        return item;
      } else {
        return site;
      }
    }));
  };

  return (
    <DataContext.Provider value={{ sites, deleteSite, addSite, updateSite }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;