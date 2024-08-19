import { AppProps } from "next/app";
import { globalStyles } from "../styles/globals";
import { SessionProvider } from "next-auth/react";

globalStyles();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
