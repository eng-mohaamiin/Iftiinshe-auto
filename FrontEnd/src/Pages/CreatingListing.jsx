import { useState } from "react";
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploadingImages, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState({
    name: "",
    description: "",
    make: "",
    model: "",
    year: 1990,
    price: 0,
    mileage: 0,
    discount: 0,
    fuelType: "Petrol",
    transmission: "Automatic",
    condition: "New",
    offer: false,
    imageURLs: [],
    sellerRef: currentUser._id,
    location: "",
    type: "rent",
  });

  // function to handle file changes
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
      setImageUploadError("You can only upload up to 6 files at a time");
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
    setImageUploadError(null);
  };

  // function to upload a single image
  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "car_listing_site");
    data.append("api_key", import.meta.env.CLOUDINARY_API_KEY);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkmpqqo5s/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    if (!res.ok) {
      throw new Error("Failed to upload image");
    }
    const uploadedImage = await res.json();
    return uploadedImage.url;
  };
  // function to handle multiple image uploads

  const uploadImages = async () => {
    if (files.length === 0) {
      setImageUploadError("No files selected for upload");
    }
    setUploadingImage(true);
    setImageUploadError(null);

    const uploadedUrls = [];
    try {
      for (const file of files) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setFiles([]);
      setListingData((prev) => ({
        ...prev,
        imageURLs: [...prev.imageURLs, ...uploadedUrls],
      }));
    } catch (error) {
      console.error(error);
      setImageUploadError("An error occurred while uploading");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setListingData((prev) => ({
      ...prev,
      imageURLs: prev.imageURLs.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setListingData({ ...listingData, type: e.target.id });
    }
    if (e.target.id === "offer") {
      setListingData({ ...listingData, offer: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setListingData({ ...listingData, [e.target.id]: e.target.value });
    }
    if (
      e.target.id === "fuelType" ||
      e.target.id === "transmission" ||
      e.target.id === "condition"
    ) {
      setListingData({ ...listingData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (listingData.imageURLs < 1) {
        return setError("You must upload at least one image");
      }
      if (+listingData.price < +listingData.discount) {
        setLoading(false);
        return setError("Discount price must be less than or equal to price");
      }
      setLoading(true);
      setError(null);
      const res = await fetch("/api/listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });
      const data = await res.json();

      setLoading(false);
      navigate(`/listing/${data._id}`);
      if (!data.success) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-4">
          <input
            onChange={handleChange}
            value={listingData.name}
            type="text"
            id="name"
            placeholder="Name..."
            className="border p-3 rounded-lg"
            required
          />
          <textarea
            onChange={handleChange}
            value={listingData.description}
            id="description"
            placeholder="Description..."
            className="border p-3 rounded-lg"
            required
          />

          <input
            onChange={handleChange}
            value={listingData.make}
            type="text"
            id="make"
            placeholder="Make eg. Toyota, Nissan..."
            className="border p-3 rounded-lg"
            required
          />
          <input
            onChange={handleChange}
            value={listingData.model}
            type="text"
            id="model"
            placeholder="Model eg. Vits, Xtrail"
            className="border p-3 rounded-lg"
            required
          />
          <input
            onChange={handleChange}
            value={listingData.year}
            type="number"
            id="year"
            placeholder="Year eg. 2001, 2020 ..."
            className="border p-3 rounded-lg"
            required
          />
          <input
            onChange={handleChange}
            value={listingData.mileage}
            type="number"
            id="mileage"
            placeholder="Mileage eg. 20000km, 30000km..."
            className="border p-3 rounded-lg"
            required
          />
          <input
            onChange={handleChange}
            value={listingData.location}
            type="text"
            id="location"
            placeholder="Location,eg. Berbera, Mogadishu..."
            className="border p-3 rounded-lg"
            required
          />
          <select
            onChange={handleChange}
            value={listingData.fuelType}
            className="border p-3 rounded-lg"
            id="fuelType"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
          <select
            onChange={handleChange}
            value={listingData.transmission}
            className="border p-3 rounded-lg"
            id="transmission"
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="CVT">CVT</option>
          </select>
          <select
            onChange={handleChange}
            value={listingData.condition}
            id="condition"
            className="border p-3 rounded-lg"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Damaged">Damaged</option>
          </select>

          {/* more options */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={listingData.type === "sale"}
                type="checkbox"
                id="sale"
                className="scale-1.5"
              />
              <span>Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={listingData.type === "rent"}
                type="checkbox"
                id="rent"
                className="scale-1.5"
              />
              <span>Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={listingData.offer}
                type="checkbox"
                id="offer"
                className="scale-1.5"
              />
              <span>Offer</span>
            </div>
          </div>
          {/* pricing */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 items-center">
              <input
                onChange={handleChange}
                value={listingData.price}
                type="number"
                id="price"
                required
                className="p-3 border rounded-lg"
              />
              <div>
                <p>Regular Price</p>
                {listingData.type === "rent" && <span>($ / Month)</span>}
              </div>
            </div>
            {listingData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  onChange={handleChange}
                  value={listingData.discount}
                  type="number"
                  id="discount"
                  required
                  className="p-3 border rounded-lg"
                />
                <div>
                  <p>Discounted Price</p>
                  {listingData.type === "rent" && <span>($ / Month)</span>}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* right */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              onClick={uploadImages}
              disabled={uploadingImages}
              type="button"
              className="p-3 uppercase text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploadingImages ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          <div>
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="border flex justify-between p-3 items-center"
              >
                <img
                  src={url}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button
            disabled={uploadingImages}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>
          <p className="text-sm text-red-700">{error && error}</p>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
