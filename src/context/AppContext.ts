// import React, { useState, createContext, ReactNode } from "react";

// interface AppContextType {
//   appContext: any;
//   setAppContext: React.Dispatch<React.SetStateAction<any>>;
// }

// export const AppContext = createContext<AppContextType | undefined>(undefined);

// interface AppContextProviderProps {
//   children: ReactNode;
// }

// export const AppContextProvider = ({ children }: AppContextProviderProps) => {
//   const [appContext, setAppContext] = useState({});

//   return (
//     <AppContext.Provider appContext={appContext} setAppContext={setAppContext} value={{ appContext, setAppContext }}>
//       {children}
//     </AppContext.Provider>
//   );
// };
