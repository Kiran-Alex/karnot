import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={GeistSans.className}>
      <Toaster/>
      <Component {...pageProps} />
    </main>
  );
};

export default api.withTRPC(MyApp);
