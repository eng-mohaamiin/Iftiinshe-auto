import React, { useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import {Link} from "react-router-dom"




const Profile = () => {
  let {
    currentUser,
    loading,
    error,
    updateUserStart,
    updateUserSuccess,
    updateUserFailer,
    deleteUserSuccess,
    deleteUserStart,
    deleteUserFailer,
    signoutUserFailer,
    signoutUserStart,
    signoutUserSuccess
  } = useAppContext();

  let fileRefrence = useRef(null);

  let [imageUrl, setImageUrl] = useState();
  let [updateData, setUpdateData] = useState({});
  let [imageLoading, setImageLoadding] = useState(false);
  let [showListingError, setShowListingError]  = useState(false)
  let [userListing, setUserListing] = useState([])

  // handleFileCHange one image is updloaded

  let handleFileCHange = async (e) => {
    setImageLoadding(true);
    // array ayuu soo celinaya marka ka dooro fileka ugu horeeoy
    let file = e.target.files[0];
    // console.log("this is all fils",file)

    // fileka hadii wax lasoo gelinin jooji codeka

    if (!file) {
      setImageLoadding(false);
      return;
    }

    let data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "car_listing_site");
    data.append("api_key", import.meta.env.CLOUDINARY_API_KEY);

    let res = await fetch(
      "https://api.cloudinary.com/v1_1/dxvct5s5e/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    // wuxuu kuu hayaa imageka profileka
    let uploadedImage = await res.json();
    setImageUrl(uploadedImage.url);
    // console.log("this is uploaded image",uploadedImage)
    setUpdateData((prev) => ({ ...prev, avatar: uploadedImage.url }));
    setImageLoadding(false);
  };

  let handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.id]: e.target.value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      updateUserStart();
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!data) {
        updateUserFailer(data.message);
        toast.error("Failed to update ");
        return;
      }

      updateUserSuccess(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      updateUserFailer(error.message);
      toast.error("failed to update");
    }
  };

  useEffect(() => {
    if (imageLoading) {
      toast.success("Image is uploading...");
    }
  }, [imageLoading]);

  // deltete

  let handleDelte = async () => {
    try {
      deleteUserStart();
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        deleteUserFailer(data.message);
        toast.error("Failed to delete account");
        return;
      }
      deleteUserSuccess();
      toast.success("Account deleted successfully");
    } catch (error) {
      deleteUserFailer(error.message);
      toast.error("Failed to delete account");
    }
  };

  // signout

  let handleSignOut = async () => {
    try {
      signoutUserStart();
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      if (!data.success) {
        signoutUserFailer(data.message);
        toast.error("Failed to sign out");
        return;
      }

      signoutUserSuccess();

      return;
    } catch (error) {
      signoutUserFailer(error.message);
      toast.error("Failed to sign out");
    }
  };

 



  let handleShowListing = async ()=>{
    try {
      setShowListingError(false)
      let res = await fetch(`/api/user/listings/${currentUser._id}`)
      let data = await res.json()
      if(!data){
        return setShowListingError(true)
      }

      setUserListing(data)


      


    } catch (error) {
      setShowListingError(true)
    }
  }

  console.log(userListing)




  let handleListinDelete = async (listingId)=>{
    

    try {
      let res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",

      })

      let data = await res.json()

      if(!data){
        return
      }

      setUserListing((prev)=> prev.filter((listing) => listing._id !== listingId))

      toast.success("Listing deleted sucucessfully")


    } catch (error) {
      console.log(error)
    }


  }





















  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleFileCHange}
          className="hidden"
          type="file"
          ref={fileRefrence}
        />
        <img
          onClick={() => fileRefrence.current.click()}
          src={imageUrl ? imageUrl : currentUser.avatar}
          alt="profile Image"
          className="w-24 h-24 rounded-full cursor-pointer  object-cover self-center my-7"
        />
        <input
          onChange={handleChange}
          type="text"
          placeholder="username"
          id="userName"
          className="rounded p-3"
          defaultValue={currentUser.userName}
        />
        <input
          onChange={handleChange}
          type="email"
          placeholder="email"
          id="email"
          className="rounded p-3"
          defaultValue={currentUser.email}
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="password"
          id="password"
          className="rounded p-3"
          defaultValue={currentUser.password}
        />
        <button
          disabled={loading || imageLoading}
          className="uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
        >
          Update
        </button>
        <Link 
          to="/create-listing"
          className="uppercase bg-green-700 text-white text-center rounded-lg p-3 hover:opacity-95 disabled:opacity-80"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex  justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelte}>
          Delete acount
        </span>
        <span
          className="text-red-700 cursor-pointer"

          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>

      <button

      onClick={handleShowListing}
      
      className="text-green-700 w-full">Show Listing</button>

    <p>{showListingError ? "There is error for showing listing": ""}</p>


    {
      userListing && userListing.length>0 &&(
        <div>
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {
            userListing.map((listing)=>(
              <div className="flex justify-between items-center gap-4 border rounded-lg p-3" key={listing._id}>
               <Link className="flex-1" to={`/listing/${listing._id}`}>
                <img className="w-16 h-16 object-contain" src={listing.imageURLs[0]} alt=""/>
                </Link>
                <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
                <p className="text-right">{listing.name}</p>
                </Link>
                <div  className="flex flex-col items-center">
                  <button onClick={()=> handleListinDelete(listing._id)}  className="text-red-700 uppercase">Delete</button>
                 {/* <Link to={`/update-listing/ ${listing._id}`}> */}
                 <Link to={`/update-listing/${listing._id}`}>

                  <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      )
    }




      <ToastContainer />
    </div>
  );
};

export default Profile;
