import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="mobileM:w-[calc(100vw+200px)] tablet:w-[calc(100%)] h-[100vh]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
