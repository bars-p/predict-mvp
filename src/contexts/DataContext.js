import React, { useState, createContext } from 'react';

export const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  const [sites, setSites] = useState([
    {
      id: 1,
      name: 'Factory',
      short: 'A',
      ladsList: ['Lad-1-0-1'],
    },
    {
      id: 2,
      name: 'Main Street',
      short: 'B',
      ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2'],
    },
    {
      id: 3,
      name: 'Central Park',
      short: 'C',
      ladsList: ['Lad-1-0-1', 'Lad-1-0-2'],
    },
    {
      id: 4,
      name: 'City Library',
      short: 'D',
      ladsList: ['Lad-1-0-1', 'Lad-2-0-1', 'Lad-1-0-2', 'Lad-2-0-2'],
    },
    {
      id: 5,
      name: 'City Hall',
      short: 'E',
      ladsList: ['Lad-2-0-2'],
    },
  ]);
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