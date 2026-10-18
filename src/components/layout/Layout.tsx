import { Suspense } from "react";
import { Outlet } from "react-router";

import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollManager from "./ScrollManager";
import PageLoading from "../ui/PageLoading";

function Layout() {
  return (
    <>
      <ScrollManager />
      <Navbar />

      <main>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

export default Layout;
