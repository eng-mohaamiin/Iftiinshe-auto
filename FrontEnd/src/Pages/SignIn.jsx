import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAppContext } from "../Context/AppContext";


const SignIn = () => {
  let { currentUser, signInStart, signInFailure, signInSuccess } = useAppContext();
  let [formData, setFormData] = useState({});
  let navigate = useNavigate();

 
  let handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      signInStart();
      if (!(formData.password && formData.email)) {
        toast.error("Please fill all the fields");
        return;
      }

      let res = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = await res.json();
      // console.log("login response data:", data);

      if (data.success === false) {
        signInFailure(data.message);
        toast.error("Login failed");
        return;
      }

      signInSuccess(data); 

      toast.success("Login successfully");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      signInFailure(error.message);
      toast.error("Login failed");
    }
  };


  // currentUser && console.log("this is the current user now",currentUser)

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          className="border p-3 rounded-lg"
          type="email"
          placeholder="email"
          id="email"
        />
        <input
          onChange={handleChange}
          className="border p-3 rounded-lg"
          type="password"
          placeholder="password"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-3">
          Sign In
        </button>
        {/* <OAuth /> */}
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
