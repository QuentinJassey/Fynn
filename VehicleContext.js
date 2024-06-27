import React, { createContext, useState } from 'react';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicleInfo, setVehicleInfo] = useState({});

  return (
    <VehicleContext.Provider value={{ vehicleInfo, setVehicleInfo }}>
      {children}
    </VehicleContext.Provider>
  );
};