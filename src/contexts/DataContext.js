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
  const updateSegment = (item) => {
    setSegments(segments.map(segment => {
      if (segment.id == item.id) {
        return item;
      } else {
        return segment;
      }
    }));
  };

  const [lads, setLads] = useState(getLadsData());
  const addLad = (item) => {
    setLads([...lads, item]);
  };
  const deleteLad = (id) => {
    setLads(lads.filter(lad => lad.id != id));
  };
  const updateLad = (item) => {
    setLads(lads.map(lad => {
      if (lad.id == item.id) {
        return item;
      } else {
        return lad;
      }
    }));
  };

  return (
    <DataContext.Provider value={{ 
      sites, deleteSite, addSite, updateSite, 
      segments, updateSegment,
      lads, addLad, deleteLad, updateLad,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;