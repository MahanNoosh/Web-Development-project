import React, { useEffect} from "react";
import { Box } from "@chakra-ui/react";
import {Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Navbar from "./components/ui/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Signup from "./pages/SignUpPage";
import Dashboard from "./pages/DashboardPage";
import ProfileFetcher from "./components/profileFetcher";


const App = () => {
  return (
   <Box minH={"100vh"} bg={{base: "gray.200", _dark:"gray.900"}}>
    <Toaster />
    <Navbar />
    <ProfileFetcher />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
   </Box>
  );
};

export default App;