import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/scrollbar";
import { useParams } from "react-router-dom";
import { FaShare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { ImLocation } from "react-icons/im";
import { IoLogoModelS } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";
import { BsSpeedometer } from "react-icons/bs";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { GiGearStickPattern } from "react-icons/gi";
import { useAppContext } from "../Context/AppContext";
import Contact from "../Components/Contact";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const { currentUser } = useAppContext();
  const params = useParams();
  const listingId = params.listingId;

  useEffect(() => {
    const fetchingListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (!data) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    fetchingListing();
  }, [listingId]);

  return (
    <>
      <main>
        {loading && <p className="text-center my-7 text-3xl">Loading....</p>}
        {error && (
          <p className="text-center text-red-500 text-3xl">Something went wrong!</p>
        )}

        {listing && !loading && !error && (
          <div>
            {/* 🖼️ Swiper Slider */}
            <Swiper
              modules={[Navigation, Pagination, Autoplay, Scrollbar]}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop={true}
              scrollbar={{ draggable: true }}
              className="rounded-lg shadow-lg"
            >
              {listing.imageURLs.map((url, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="h-[75vh] bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* 📤 Share button */}
            <div
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                toast.success("Link copied successfully!");
                setTimeout(() => setCopied(false), 2000);
              }}
              className="fixed top-[13%] z-10 right-[3%] border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer shadow-md"
            >
              <FaShare className="text-slate-500" />
            </div>

            {/* 🚘 Listing Details */}
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <p className="text-2xl font-semibold">{listing.name}</p>
              <p className="text-lg">
                ${" "}
                {listing.offer
                  ? listing.discount.toLocaleString("en-US")
                  : listing.price.toLocaleString("en-US")}
                {listing.type === "rent" && " / month"}
              </p>

              <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                <ImLocation className="text-green-700" />
                {listing.location}
              </p>

              <div>
                <p className="bg-red-900 mt-5 w-full max-w-[200px] text-center p-1 rounded-md text-white">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-green-900 mt-3 w-full max-w-[200px] text-center p-1 rounded-md text-white">
                    Save: {(listing.price - listing.discount).toLocaleString("en-US")}
                  </p>
                )}
              </div>

              <div>
                <span className="text-black">
                  Description: {listing.description}
                </span>
              </div>

              <hr />

              <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <IoLogoModelS className="text-xl" />
                  Model: {listing.model}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <MdCalendarMonth className="text-xl" />
                  Year: {listing.year}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <BsSpeedometer className="text-xl" />
                  Mileage: {listing.mileage}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <BsFillFuelPumpFill className="text-xl" />
                  Fuel Type: {listing.fuelType}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <GiGearStickPattern className="text-xl" />
                  Transmission: {listing.transmission}
                </li>
              </div>

              {/* 📞 Contact button */}
              {currentUser && currentUser._id !== listing.sellerRef && !contact && (
                <button
                  onClick={() => {
                    setContact(true);
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                  }}
                  className="bg-slate-700 mt-4 text-white rounded-lg hover:opacity-90 p-3 w-full"
                >
                  Contact The Owner
                </button>
              )}

              {contact && <Contact listing={listing} />}
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </>
  );
};

export default Listing;
