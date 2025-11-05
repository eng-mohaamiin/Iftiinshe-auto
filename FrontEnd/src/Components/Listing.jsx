import React from "react";
import { Link } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { BsFillFuelPumpFill } from "react-icons/bs";
import { GiGearStickPattern } from "react-icons/gi";
import { BsSpeedometer } from "react-icons/bs";
import moment from 'moment'


const Listing = ({ listing }) => {
  return (
    <div className="bg-white relative shadow-md hover:shadow-lg overflow-hidden rounded-lg sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[350px] sm:h-[200px] w-full object-cover hover:scale-105  duration-300"
          src={listing.imageURLs}
          alt=""
        />
      </Link>
      <div className="p-3  flex flex-col gap-2 w-full">
        <p className=" truncate text-lg font-semibold text-slate-700">
          {listing.name}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ImLocation className="text-green-700" />
            <p>{listing.location}</p>
          </div>
          <div className="text-red-500 py-2 rounded-lg font-bold italic capitalize">
            {listing.type}
          </div>
        </div>
        <div>
          <p className="truncate">{listing.description}</p>
          <p className="text-slate-700 mt-2 font-semibold">
            ${listing.offer ? listing.discount : listing.price}
            {listing.type === "rent" && "/month"}
          </p>
          <hr   className="my-2"/>
          <div className="flex items-center gap-1  justify-around py-2">
            <GiGearStickPattern />
            <span className=" font-semibold italic">{listing.transmission}</span>
            <BsFillFuelPumpFill />
            <span className=" font-semibold italic">{listing.fuelType}</span>
            <BsSpeedometer />
            <span className=" font-semibold italic">{listing.mileage} km</span>
          </div>
        </div>
      </div>
      <span className=" absolute top-1 right-1 bg-slate-700 text-slate-50 p-2 rounded-lg">{moment(listing.createdAt).fromNow()}</span>
    </div>
  );
};

export default Listing;
