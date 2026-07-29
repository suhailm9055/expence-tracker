import { Head, Html, Main, NextScript } from "next/document";

// Next.js may load this fallback while collecting build-time page metadata,
// even though the application itself uses the App Router exclusively.
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
