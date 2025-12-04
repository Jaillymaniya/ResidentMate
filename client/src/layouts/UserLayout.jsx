import React from "react";
import Header from "../homedashboard/Header.jsx";
import Footer from "../homedashboard/Footer.jsx";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      {/* {children} */}
      <main style={{ paddingBottom: "90px" }}>
  {children}
</main>
      <Footer />
    </>
  );
}
