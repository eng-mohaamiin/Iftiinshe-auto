import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Listing from "../Components/Listing";

const Search = () => {
  let navigate = useNavigate();
  let [showMore, setSHowMore] = useState(false)

  let location = useLocation(); // <-- Halkan ayaad ku heshaa location

  let [sideBarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    sort: "created_at",
    order: "desc",
    condition: "all",
    transmission: "all",
    fuelType: "all",
  });

  let handleSubmit = (e) => {
    e.preventDefault();
    let urlParams = new URLSearchParams();

    urlParams.set("searchTerm", sideBarData.searchTerm);

    urlParams.set("type", sideBarData.type);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    urlParams.set("condition", sideBarData.condition);
    urlParams.set("transmission", sideBarData.transmission);
    urlParams.set("fuelType", sideBarData.fuelType);

    let searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // handleChange

  let [listings, setListings] = useState([]);
  let [loading, setLoading] = useState(false);

  let handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (e.target.id === "offer") {
      setSidebarData({
        ...sideBarData,
        offer: e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "condition") {
      setSidebarData({ ...sideBarData, condition: e.target.value });
    }
    if (e.target.id === "transmission") {
      setSidebarData({ ...sideBarData, transmission: e.target.value });
    }
    if (e.target.id === "fuelType") {
      setSidebarData({ ...sideBarData, fuelType: e.target.value });
    }
    if (e.target.id === "sort_order") {
      let sort = e.target.value.split("_")[0] || "created_at";
      let order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sideBarData, sort, order });
    }
  };

  useEffect(() => {
    let urlParams = new URLSearchParams(location.search);
    let searchTermFromUrl = urlParams.get("searchTerm");
    let typeFromUrl = urlParams.get("type");
    let offerFromUrl = urlParams.get("offer");
    let sortFromUrl = urlParams.get("sort");
    let orderFromUrl = urlParams.get("order");
    let conditionFromUrl = urlParams.get("condition");
    let fuelTypeFromUrl = urlParams.get("fuelType");
    let transmissionFromUrl = urlParams.get("transmission");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "creted_at",
        order: orderFromUrl || "desc",
        condition: conditionFromUrl || "all",
        fuelType: fuelTypeFromUrl || "all",
        transmission: transmissionFromUrl || "all",
      });
    }

    let fetchListing = async () => {
      setLoading(true);
      let searchQuery = urlParams.toString();
      let res = await fetch(`/api/listing/get?${searchQuery}`);
      let data = await res.json();


      setListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  {
    !loading && console.log("this is listing", listings);
  }




 let showMoreListing = async ()=>{
    let numberOfListing = listings.length
    let startIndex = numberOfListing
    let urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex", startIndex)
    let searchQuery = urlParams.toString()
    let res = await fetch(`/api/listing/get?${searchQuery}`);
    let data = await res.json();
    setListings((prev) => [...prev, ...data]);

  if (data.length < 8) {
    setSHowMore(false);
  }
  else{
    setSHowMore(true)
  }
  }









  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2  md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className=" whitespace-nowrap font-semibold">
              Search Term:{" "}
            </label>
            <input
              onChange={handleChange}
              value={sideBarData.searchTerm}
              type="text"
              id="searchTerm"
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <hr />

          <div className="flex gap-2 items-center flex-wrap">
            <label className=" font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sideBarData.type === "all"}
                type="checkbox"
                id="all"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sideBarData.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <hr />
          {/* conditions  */}

          <div className="flex items-center gap-2">
            <label className=" font-semibold ">Condition</label>
            <select
              onChange={handleChange}
              id="condition"
              className="border rounded-lg p-3"
            >
              <option value="all">Any</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>
          </div>
          <hr />
          {/* transmition  */}

          <div className="flex items-center gap-2">
            <label className=" font-semibold ">Transmission</label>
            <select
              onChange={handleChange}
              id="transmission"
              className="border rounded-lg p-3"
            >
              <option value="all">Anny</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          <hr />
          {/* Fueltype  */}

          <div className="flex items-center gap-2">
            <label className=" font-semibold ">fuelType</label>
            <select
              onChange={handleChange}
              id="fuelType"
              className="border rounded-lg p-3"
            >
              <option value="all">Anny</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <hr />
          {/* sorting  */}

          <div className="flex items-center gap-2">
            <label className=" font-semibold ">Sort</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="price_desc">Price High to Low</option>
              <option value="price_asc">Price low to high</option>
              <option value="createAt_desc">Latest</option>
              <option value="createAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white uppercase hover:opacity-95 cursor-pointer p-3 rounded-lg">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Result
        </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {loading || (listings.length === 0 && <p>No Listing Found</p>)}
        
        {!loading &&
          listings.length > 0 &&
          listings.map((listing) => <Listing listing={listing} />)}</div>
        {showMore &&(
          <button onClick={showMoreListing} className=" mx-auto  text-center text-green-700 hover:underline p-7">Show More</button>
        )}   
      </div>
     
    </div>
  );
};

export default Search;
