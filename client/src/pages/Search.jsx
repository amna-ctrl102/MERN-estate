import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?${searchQuery}`,{
        credentials:"include",
      });
      const data = await res.json();
      if (data.listings.length > 8) {
        setShowMore(true);
      }else{
        setShowMore(false);
      }
      setListings(data.listings);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick=async()=>{
    const numberOfListings=listings.length;
    const startIndex=numberOfListings;
    const urlParams=new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery=urlParams.toString();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get?${searchQuery}`,{
      credentials:"include",
    });
    const data = await res.json();

    setListings([...listings, ...data.listings]);
    if (listings.length + data.listings.length >=data.totalListings) {
        setShowMore(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-blue-200 border-b md:border-r md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-blue-950 font-semibold">
              Search Term:{" "}
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="bg-white border border-blue-200 rounded-lg p-3 w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="font-semibold text-blue-950">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span className="text-blue-950">Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span className="text-blue-950">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
              />
              <span className="text-blue-950">Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span className="text-blue-950">Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="font-semibold text-blue-950">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span className="text-blue-950">Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span className="text-blue-950">Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-blue-950">Sort:</label>
            <select
              id="sort_order"
              className="bg-white border border-blue-200 rounded-lg p-3 text-blue-950 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-blue-950 text-white p-3 rounded-lg text-center font-semibold uppercase hover:opacity-95 hover:shadow-md transition">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-blue-950 text-3xl font-semibold border-b p-3 border-blue-200 mt-5">
          Listings Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-blue-9500 text-center w-full">
              No listing found!
            </p>
          )}
          {loading && (
            <p className="text-xl text-blue-950 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-amber-500 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
