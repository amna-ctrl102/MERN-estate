import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData]= useState({});
  const [error, setError]= useState(null);
  const [loading, setLoading]= useState(false);
  const navigate=useNavigate();
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
  };
  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setError(null);
    const res= await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`,{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify(formData),
    });
    const data= await res.json();
    if(data.success === false){
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    navigate("/sign-in");
    }catch(error){
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-blue-950">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-blue-950 text-white font-semibold rounded-lg uppercase hover:opacity-95 p-3 hover:shadow-md transition disabled:opacity-80" type="submit">
          {loading? "Loading....": "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2">
        <p className="text-blue-950">Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-amber-500">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}
