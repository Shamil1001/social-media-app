import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ChatContextProvider } from "@/context/ChatContext";
import Navbar from "@/components/navbar/navbar";
import { auth } from "../../firebase";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <ChatContextProvider>
          <ChakraProvider>
            {/* <span>Shamil</span> */}
            {/* <Navbar /> */}
            {/* {auth.currentUser && <Navbar />} */}
            <Component {...pageProps} />
          </ChakraProvider>
        </ChatContextProvider>
      </SessionProvider>
    </Provider>
  );
}
