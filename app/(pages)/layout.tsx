"use client";

import { setTheme } from "@/store/reducers/theme";
import { AppDispatch, RootState } from "@/store/store";
import AutoResetPagesScroll from "@/ui/components/AutoResetScroll_sidebar/AutoResetScroll";
// import Footer from "@/ui/components/Footer/Footer";
import Header from "@/ui/components/Header/Header";
import NavBar from "@/ui/components/Navbar/Navbar";
import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  children: React.ReactNode;
};

function GeneralLayout({ children }: Props) {
  const { mode } = useSelector((state: RootState) => state.ThemePreference);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Initial theme detection based on system preferences
    dispatch(setTheme("auto"));
  }, [dispatch]);

  useEffect(() => {
    // Watch for manual darkMode state changes
    if (mode == "dark") {
      // Check if "dark" class is not already added, then add it
      if (!document.querySelector("html")?.classList.contains("dark")) {
        document.querySelector("html")?.classList.add("dark");
      }
    } else {
      // Remove the "dark" class if it's present
      document.querySelector("html")?.classList.remove("dark");
    }
  }, [mode]);
  return (
    <Box className="!size-full !overflow-y-auto !relative !isolate !flex !items-start !justify-start !gap-0 !bg-base-white dark:!bg-base-black">
      <AutoResetPagesScroll />

      <NavBar />

      <Box
        component="main"
        className="!w-full !h-fit !relative !max-h-full !overflow-y-auto !flex !flex-col !items-start !justify-start"
      >
        <Header />
        {children}
        {/* <Footer /> */}
      </Box>
    </Box>
  );
}

export default GeneralLayout;
