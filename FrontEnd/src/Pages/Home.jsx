import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Listing from "../Components/Listing";

const Home = () => {
  let [offerListings, setOfferListings] = useState([]);
  let [retnListings, setRentListings] = useState([]);
  let [saleListings, setsaleListings] = useState([]);

  useEffect(() => {
    let fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=3`);
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    // fetchRentListings
    let fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=3`);
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    let fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=3`);
        const data = await res.json();
        setsaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRentListings();
    fetchOfferListings();
    fetchSaleListings();
  }, []);

  console.log(offerListings);

  return (
    <>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-6 my-10">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your next <span className="text-slate-500">Perfect</span> <br />{" "}
          vehicle with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          iftiinsheAuto is the best place to find your next vehicle. <br /> We
          have a wide range of vehicles for you to choose from.
        </div>
        <Link
          className="text-xs sm:text-sm font-bold hover:underline text-blue-800"
          to="/search"
        >
          Let's get started
        </Link>
      </div>

      {/* Swiper Section */}
      <div className=" mx-auto mt-10 mb-40">
        {offerListings.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="rounded-lg shadow-lg"
          >
            {offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageURLs?.[0] || "/noimage.jpg"}
                    alt={listing.name}
                    className="w-full h-[75vh] object-cover "
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500 mt-5">
            No vehicles available yet
          </p>
        )}
      </div>

      {/* part one  */}
      {/* offer lsitings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-xs sm:text-sm  hover:underline text-blue-800"
                to="/search?offer=true"
              >
                Show More offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <Listing listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* par two rent listings  */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {retnListings && retnListings.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Rent
              </h2>
              <Link
                className="text-xs sm:text-sm  hover:underline text-blue-800"
                to="/search?type=rent"
              >
                Show More Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {retnListings.map((listing) => (
                <Listing listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* part three sale listing  */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {saleListings && saleListings.length > 0 && (
          <div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Sale
              </h2>
              <Link
                className="text-xs sm:text-sm  hover:underline text-blue-800"
                to="/search?type=sale"
              >
                Show More Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <Listing listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
