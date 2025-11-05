import React, { useContext, useState, createContext, useEffect } from "react";

let AppContext = createContext();

export let AppProvider = ({ children }) => {
  let [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("current-user-data");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);

  // si uu userka haduu uu page refresh dhaho ama brwoserka uu canclegareeyo oo kusoo noqdo wuxuu awood uleeyhaya 
  // inuu login sameeyo ama signin 
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("current-user-data", JSON.stringify(currentUser));
    } 
    // haduu empty yahay 
    else {
      localStorage.removeItem("current-user-data");
    }
  }, [currentUser]);

  // waa marka koowaad uu userka login sameynaayo 
  let signInStart = () => setLoading(true);

  // singinsuccess waxaa loo soo dhiwi doonaa userka login markaas loginka ah 
  // markuu uu login success uu noqdo 
  let signInSuccess = (user) => {
    setCurrentUser(user);
    setLoading(false);
    setError(null);
  };

  // hadii uu usuerka uu ku failgaroowe inuu login sameeyo 
  let signInFailure = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const updateUserStart = () => setLoading(true);

  const updateUserSuccess = (updatedUser) => {
    setCurrentUser(updatedUser);
    setLoading(false);
    setError(null);
  };

  let updateUserFailer = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  // delete 
  const deleteUserStart = () => setLoading(true);

  const deleteUserSuccess = () => {
    setCurrentUser(null);
    setLoading(false);
    setError(null);
    localStorage.removeItem("current-user-data");
  };

  let deleteUserFailer = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  // signout 
  const signoutUserStart = () => setLoading(true);

  const signoutUserSuccess = () => {
    setCurrentUser(null);
    setLoading(false);
    setError(null);
    localStorage.removeItem("current-user-data");
  };

  let signoutUserFailer = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  let value = {
    currentUser,
    error,
    loading,
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserFailer,
    updateUserSuccess,
    deleteUserFailer,
    deleteUserStart,
    deleteUserSuccess,
    signoutUserFailer,
    signoutUserStart,
    signoutUserSuccess,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  let context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
