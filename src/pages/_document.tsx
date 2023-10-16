import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // mobileM:w-[calc(100vw)] tablet:w-[calc(100%-100px)] h-[100vh]
  return (
    <Html
      lang="en"
      className="mobileM:w-[calc(100vw+300px)] tablet:w-full mobileM:h-[calc(100vh+350px)] tablet:h-full"
    >
      <Head />
      <body className="">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
