import { useState } from "react";
import { supabase } from "../supabase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

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
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($/Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading.." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-slate-300 gap-4 "
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
          <button className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
