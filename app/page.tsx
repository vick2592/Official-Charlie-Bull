"use client";

import type { NextPage } from "next";
import { Header } from "../components/Header";
import { LandingPage } from "../components/LandingPage";
import { Footer } from "../components/Footer";
import { FixedThemeSwitcher } from "../components/ThemeSwitcher";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <LandingPage />
      <Footer />
      <FixedThemeSwitcher />
    </>
  );
};

export default Home;