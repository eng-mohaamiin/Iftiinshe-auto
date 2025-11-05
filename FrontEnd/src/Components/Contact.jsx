import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  let [owner, setOwner] = useState(null);
  let [message, setMessage] = useState("");

  let handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
  let fetchOwner = async () => {
    try {
      const res = await fetch(`/api/user/${listing.sellerRef}`);
      const data = await res.json();
      setOwner(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (listing?.sellerRef) {
    fetchOwner();
  }
}, [listing?.sellerRef]);


  return (
    <>
      {owner && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className=" font-semibold"> this is owner {owner.userName}</span>
          </p>
          <textarea
            onChange={handleChange}
            name="message"
            id="message"
            className=" w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            className="bg-slate-700 text-white text-center uppercase rounded-lg hover:opacity-95 p-3"
            to={`mailto:${owner.email}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
