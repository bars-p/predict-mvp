import React, { useState, createContext } from 'react';
import getSettingsData from '../data/SettingsData';
import getSitesData from '../data/SitesData';
import getSegmentsData from '../data/SegmentsData';
import getLadsData from '../data/LadsData';
import getTimeTableData from '../data/TimeTableData';
import getRuntimesData from '../data/RuntimesData';
import smoothen from '../utils/sigmoidSmooth';

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [settings, setSettings] = useState(getSettingsData());
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    setDaySpeedCoefs(smoothen(newSettings.dayPeriodCoefficients));
  };

  const [daySpeedCoefs, setDaySpeedCoefs] = useState(
    smoothen(settings.dayPeriodCoefficients)
  );
  const updateDaySpeedCoefs = (newCoefs) => {
    setDaySpeedCoefs(newCoefs);
  };

  const [sites, setSites] = useState(getSitesData());
  const deleteSite = (id) => {
    setSites(sites.filter((site) => site.id != id));
  };
  const addSite = (item) => {
    setSites([...sites, item]);
  };
  const updateSite = (item) => {
    setSites(
      sites.map((site) => {
        if (site.id == item.id) {
          return item;
        } else {
          return site;
        }
      })
    );
  };

  const [segments, setSegments] = useState(getSegmentsData());
  const addSegment = (item) => {
    setSegments([...segments, item]);
  };
  const addSegments = (newSegmentsArray) => {
    setSegments(segments.concat(newSegmentsArray));
  };
  const updateSegment = (item) => {
    setSegments(
      segments.map((segment) => {
        if (segment.id == item.id) {
          return item;
        } else {
          return segment;
        }
      })
    );
  };

  const [lads, setLads] = useState(getLadsData());
  const addLad = (item) => {
    setLads([...lads, item]);
  };
  const deleteLad = (id) => {
    setLads(lads.filter((lad) => lad.id != id));
  };
  const updateLad = (item) => {
    setLads(
      lads.map((lad) => {
        if (lad.id == item.id) {
          return item;
        } else {
          return lad;
        }
      })
    );
  };

  const [timetables, setTimetables] = useState(getTimeTableData());
  const renewTimetables = (newTimetables) => {
    // FIXME:
    setTimetables(newTimetables);
  };
  const addTimetable = (timetable) => {
    setTimetables([...timetables, timetable]);
  };
  const updateTimetable = (timetable) => {
    const newTimetables = timetables.map((tt) => {
      if (tt.id == timetable.id) {
        return timetable;
      } else {
        return tt;
      }
    });
    setTimetables(newTimetables);
  };

  const [runtimes, setRuntimes] = useState(getRuntimesData());
  const renewRuntimes = (newRuntimes) => {
    setRuntimes(newRuntimes); // FIXME: Possible not needed to renew
  };
  const addRuntimes = (rt) => {
    setRuntimes([...runtimes, rt]);
  };
  const updateRuntimes = (rt) => {
    const newRuntimes = runtimes.map((item) => {
      if (item.id == rt.id) {
        return rt;
      } else {
        return item;
      }
    });
    setRuntimes(newRuntimes);
  };

  return (
    <DataContext.Provider
      value={{
        settings,
        updateSettings,
        daySpeedCoefs,
        updateDaySpeedCoefs,
        sites,
        deleteSite,
        addSite,
        updateSite,
        segments,
        addSegment,
        addSegments,
        updateSegment,
        lads,
        addLad,
        deleteLad,
        updateLad,
        timetables,
        renewTimetables,
        addTimetable,
        updateTimetable,
        runtimes,
        renewRuntimes,
        addRuntimes,
        updateRuntimes,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
