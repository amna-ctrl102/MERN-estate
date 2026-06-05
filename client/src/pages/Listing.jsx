import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact,setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${params.listingId}`,{
          credentials:"include",
        });
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl text-blue-950">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl text-red-600">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => {
              return (
                <SwiperSlide key={url}>
                  <div className="h-62.5 md:h-100 lg:h-125">
                    <img
                      src={url}
                      className="w-full object-contain"
                      alt="listing"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border border-blue-400 rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-blue-800"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-amber-500 text-white shadow-md p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-6 gap-4">
            <p className="text-2xl font-semibold text-blue-950">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-blue-800  text-sm">
              <FaMapMarkerAlt className="text-amber-500" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-blue-950 w-full max-w-50 text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-amber-500 w-full max-w-50 text-blue-950 text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-blue-950">Description - </span>
              {listing.description}
            </p>
            <ul className="text-blue-800 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg text-amber-500" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg text-amber-500" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg text-amber-500" />
                {listing.parking ? "Parking Sport" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg text-amber-500" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id?.toString() && !contact && (
              <button onClick={()=>setContact(true)} className="bg-blue-950 text-white font-semibold rounded-lg uppercase hover:opacity-95 p-3 hover:shadow-md transition">
                Conatct Landlord
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}
