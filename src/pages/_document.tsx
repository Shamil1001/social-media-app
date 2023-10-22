import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // mobileM:w-[calc(100vw)] tablet:w-[calc(100%-100px)] h-[100vh]
  // mr-[-220px]
  //mobileM:w-[calc(100vw+300px)] tablet:w-full mobileM:h-[calc(100vh+350px)] tablet:h-full
  return (
    <Html lang="en" className="">
      <Head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      </Head>
      <body className="">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
