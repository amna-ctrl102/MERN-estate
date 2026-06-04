import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useSelector } from "react-redux";
import {useNavigate,useParams} from "react-router-dom";

export default function UpdateListing() {
  const {currentUser}=useSelector((state) => state.user);
  const navigate=useNavigate();
  const params=useParams();

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,setError]=useState(false);
  const [loading,setLoading]=useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  useEffect(()=>{
    const fetchListing=async()=>{
        const listingId=params.listingId;
        const res=await fetch(`/api/listing/get/${listingId}`);
        const data=await res.json();
        if(data.success === false){
            console.log(data.message);
            return;
        }
        setFormData(data);
    }
    fetchListing();
  },[params.listingId]);
  
  const handleImageUpload = async () => {
    console.log("Upload button clicked");
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      try {
        const promises = files.map((file) => storeImage(file));
        const urls = await Promise.all(promises);
        setFormData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
        setUploading(false);
      } catch (err) {
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  // Supabase version of storeImage
  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileName = `${Date.now()}-${file.name}`;

        // Upload to Supabase (bucket: state_changed)
        const { data, error } = await supabase.storage
          .from("listingPics")
          .upload(fileName, file);

        if (error) {
          return reject(error);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("listingPics")
          .getPublicUrl(fileName);

        const imageUrl = publicUrlData?.publicUrl;

        if (!imageUrl) {
          return reject("Failed to get image URL");
        }

        resolve(imageUrl);
      } catch (err) {
        reject(err);
      }
    });
  };
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };
  const handleChange = (e) => {
    if(e.target.id==="sale"||e.target.id==="rent"){
      setFormData({
        ...formData,
        type:e.target.id,
      });
    }
    if(e.target.id==="parking"||e.target.id==="furnished"||e.target.id==="offer"){
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked,
      });
    }
    if(e.target.type==="text"||e.target.type==="number"||e.target.type==="textarea"){
      setFormData({
        ...formData,
        [e.target.id]:e.target.value,
      });
    }
  };
  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      if(formData.imageUrls.length<1){
        return setError("You must upload at least one image");
      }
      if(+formData.regularPrice < +formData.discountPrice){
        return setError("Discount Price must be lower than regular price")
      }
      setLoading(true);
      setError(false);
      const res=await fetch(`/api/listing/update/${params.listingId}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id,
        }),
      });
      const data=await res.json();
      setLoading(false);
      if(data.success==false){
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    }catch(error){
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 text-blue-950">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
            id="address"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="text-blue-950">Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="text-blue-950">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="text-blue-950">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="text-blue-950">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span className="text-blue-950">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p className="text-blue-950">Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p className="text-blue-950">Baths</p>
            </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="0"
                  max="1000000"
                  required
                  className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="text-blue-950">Regular Price</p>
                  <span className="text-xs text-gray-500">($/Month)</span>
                </div>
              </div>
              {formData.offer &&(
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="1000000"
                    required
                    className="border border-blue-200 p-3 rounded-lg bg-white text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 hover:shadow-md transition"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p className="text-blue-950">Discount Price</p>
                    <span className="text-xs text-gray-500">($/Month)</span>
                  </div>
                </div>
              )} 
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-blue-950">
            Images:
            <span className="text-blue-500 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-blue-200 rounded w-full bg-white text-blue-950 hover:shadow-md transition"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="p-3 text-amber-500 border border-amber-500 rounded hover:bg-amber-500 hover:text-blue-950 transition-all disabled:opacity-80"
            >
              {uploading ? "Uploading.." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.map((url, index) => (
            <div
              key={index}
              className="bg-white border border-blue-200 rounded-lg p-3 flex justify-between items-center gap-4 hover:shadow-md transition "
            >
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-contain rounded-lg "
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-3 bg-red-700 text-white rounded-lg uppercase hover:opacity-75 cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
          <button disabled={loading || uploading} className="p-3 bg-blue-950 text-white font-semibold uppercase rounded-lg hover:opacity-95 disabled:opacity-80 hover:shadow-md transition">
            {loading?"Updating...":"Update Listing"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

