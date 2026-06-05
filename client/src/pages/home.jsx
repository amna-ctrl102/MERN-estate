import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);

  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&limit=3`,{
          credentials:"include",
        });
        const data = await res.json();
        setOfferListings(data.listings);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&limit=3`,{
          credentials:"include",
        });
        const data = await res.json();
        setRentListings(data.listings);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&limit=3`,{
          credentials:"include",
        });
        const data = await res.json();
        setSaleListings(data.listings);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-7 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-blue-950 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-amber-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-blue-800 text-xs sm:text-sm">
          Elite Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-amber-500 text-xl sm:text-sm font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listings) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listings.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-125"
                key={listings._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length>0 && (
          <div>
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-blue-950'>Recent Offers</h2>
              <Link className='text-sm text-amber-500  hover:underline' to={"/search?offer=true"}>Show More Offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                offerListings.map((listings)=>(
                  <ListingItem listing={listings} key={listings._id} />
                ))
              }
            </div>
          </div>
        )}
        {rentListings && rentListings.length>0 && (
          <div>
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-blue-950'>Recent Places For Rent</h2>
              <Link className='text-sm text-amber-500  hover:underline' to={"/search?type=rent"}>Show More Places For Rent</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                rentListings.map((listings)=>(
                  <ListingItem listing={listings} key={listings._id} />
                ))
              }
            </div>
          </div>
        )}
        {saleListings && saleListings.length>0 && (
          <div>
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-blue-950'>Recent Places For Sale</h2>
              <Link className='text-sm text-amber-500  hover:underline' to={"/search?type=sale"}>Show More Places For Sale</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                saleListings.map((listings)=>(
                  <ListingItem listing={listings} key={listings._id} />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
