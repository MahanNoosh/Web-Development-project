import React from "react";
import { Box, Dialog } from "@chakra-ui/react";
import {Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
   <Box minH={"100vh"} bg={{base: "gray.200", _dark:"gray.900"}}>
    <Toaster />
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
    </Routes>
   </Box>
  );
};

export default App;