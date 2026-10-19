import { Suspense } from "react";
import { Outlet } from "react-router";

import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollManager from "./ScrollManager";
import EnquiryProvider from "../common/EnquiryProvider";
import PageLoading from "../ui/PageLoading";

function Layout() {
  return (
    <EnquiryProvider>
      <ScrollManager />
      <Navbar />

      <main>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </EnquiryProvider>
  );
}

export default Layout;
