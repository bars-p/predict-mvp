import React, { useState, createContext } from 'react';
import getConfigData from '../data/ConfigData';
import getSitesData from '../data/SitesData';
import getSegmentsData from '../data/SegmentsData';
import getLadsData from '../data/LadsData';
import getTimeTableData from '../data/TimeTableData'
import getRuntimesData from '../data/RuntimesData'

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [config, setConfig] = useState(getConfigData())
  
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
  const addSegment = (item) => {
    setSegments([...segments, item]);
  };
  const addSegments = (newSegmentsArray) => {
    setSegments(segments.concat(newSegmentsArray));
  };
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

  const [timetables,  setTimetables] = useState(getTimeTableData());
  const renewTimetables = (newTimetables) => { // FIXME:
    setTimetables(newTimetables);
  }

  const [runtimes, setRuntimes] = useState(getRuntimesData());
  const renewRuntimes = (newRuntimes) => {
    setRuntimes(newRuntimes); // FIXME:
  };

  return (
    <DataContext.Provider value={{ 
      config,
      sites, deleteSite, addSite, updateSite, 
      segments, addSegment, addSegments, updateSegment,
      lads, addLad, deleteLad, updateLad,
      timetables, renewRuntimes,
      runtimes, renewRuntimes,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;