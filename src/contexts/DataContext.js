import React, { useState, createContext } from 'react';
import getSitesData from '../data/SitesData';
import getSegmentsData from '../data/SegmentsData';
import getLadsData from '../data/LadsData';

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

  const [segments, setSegments] = useState(getSegmentsData());

  const [lads, setLads] = useState(getLadsData());

  return (
    <DataContext.Provider value={{ 
      sites, deleteSite, addSite, updateSite, 
      segments,
      lads,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;