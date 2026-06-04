import { FaSearch } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";

export default function Header() {
  const {currentUser}=useSelector(state=>state.user);
  const [searchTerm, setSearchTerm]=useState("");
  const navigate=useNavigate();
  
  const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get("searchTerm");
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[location.search])

  return (
    <header className="bg-blue-950 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
            <span className="text-amber-500">Elite</span>
            <span className="text-white">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-white p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent placeholder:text-gray-500 focus:outline-none w-24 sm:w-64 font-semibold"
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-amber-500" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-gray-100 hover:text-amber-500 transition-colors">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-gray-100 hover:text-amber-500 transition-colors">
              About
            </li>
          </Link>
          <Link to={currentUser ? '/profile' : '/sign-in'}>
            {currentUser ? <img
              src={ currentUser?.avatar || "https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"}
              alt="profile"
              className="rounded-full h-7 w-7 object-cover border-2 border-white"
            /> : (
              <li className="sm:inline text-gray-100 hover:text-amber-500 transition-colors">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
