import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

const Header = () => {
  let { currentUser } = useAppContext();

  // console.log("this is the current user",currentUser)

  let [searchTerm, setSearchTerm] = useState("");

  let navigate = useNavigate();
  let location = useLocation();

  let handleSearch = (e) => {
    e.preventDefault();
    let urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm); // ✅ ku dar searchTerm
    let searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`); // ✅ remove '.' ka dib /search
  };

  useEffect(() => {
    let urlParams = new URLSearchParams(location.search);

    let searchTermFromURL = urlParams.get("searchTerm");

    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search]);

  return (
    <>
      <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-slate-500">Iftiinshe</span>

              <span className="text-slate-700">Auto</span>
            </h1>
          </Link>
          <form
            onSubmit={handleSearch}
            action=""
            className="flex items-center  bg-slate-100 rounded-lg p-3"
          >
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="bg-transparent focus:outline-none w-24 sm:w-64"
              placeholder="Search"
            />
            <button>
              <FaSearch className="text-slate-600" />
            </button>
          </form>
          <ul className="flex gap-4 text-center">
            <Link className="text-slate-700 hover:underline" to="/">
              Home
            </Link>
            <Link className="text-slate-700 hover:underline" to="/about-us">
              About
            </Link>
            {currentUser ? (
              <Link to="/profile">
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link to="/sign-in">
                <li className="text-slate-700 hover:underline">Sign In</li>
              </Link>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
