// import { onAuthStateChanged } from "firebase/auth";
// import React, { createContext, useEffect, useState } from "react";
// import { auth } from "../../firebase";

// interface AppContextType {
//   currentUser: any; // Change this to the type of your user object
//   setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
// }

// export const AuthContext = createContext<AppContextType | undefined>(undefined);

// interface AppContextProviderProps {
//   children: React.ReactNode;
// }

// export const AuthContextProvider = ({ children }: AppContextProviderProps) => {
//   const [currentUser, setCurrentUser] = useState({});

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       console.log(user);
//     });

//     return () => {
//       // Unsubscribe from the Firebase listener when the component unmounts
//       unsubscribe();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
