import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  let navigate = useNavigate();

  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);

  // how to manage  changes of the input elements

  let handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // checking form data first

      setLoading(true);
      setError(null);

      // formData wuxuu kuu hayaa all inputs qiimahooda

      if (!(formData.userName && formData.password && formData.email)) {
        toast.error("Please fill all the fields");
        setLoading(false);
        return;
      }

      let res = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // console.log("this is res",res)
      let data = await res.json();
      // console.log("this is data", data)
      // console.log("this is data success", data.message)
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        toast.error("Registration failed");
        return;
      }
      toast.success("registration successfully");

      setTimeout(() => {
        navigate("/sign-in");
      }, 6000);
    } catch (error) {
      toast.error("registration fail");
      setError(error.message);
      setLoading(false);
    }
  };

  // console.log("this is formdata ", formData)

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
          <input
            onChange={handleChange}
            className="border p-3 rounded-lg"
            type="text"
            placeholder="user Name"
            id="userName"
          />
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
            Sign Up
          </button>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Have an acount?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Sign In</span>
          </Link>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SignUp;
