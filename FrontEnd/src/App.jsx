import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import Header from "./Components/Header";
import PriveRoute from "./Components/PriveRoute";
import CreatingListing from "./Pages/CreatingListing";
import UpdatingListing from "./Pages/UpdatingListing";
import Listing from "./Pages/Listing";
import Search from "./Pages/Search";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/about-us" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
       
       

        {/* <Route */}
        <Route element={<PriveRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreatingListing />} />
        <Route path="/update-listing/:listingId" element={<UpdatingListing />} />
        </Route>



      </Routes>

      <Footer />
    </>
  );
};

export default App;
