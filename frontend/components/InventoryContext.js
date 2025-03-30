import React, { createContext, useState, useContext } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);

  const addIngredient = (ingredient) => {
    setInventory((prev) => [...prev, ingredient]);
  };

  return (
    <InventoryContext.Provider value={{ inventory, addIngredient }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
