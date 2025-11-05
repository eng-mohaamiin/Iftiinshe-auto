import carListing from "../models/listtingModal.js";
import { errorHandler } from "../utils/error.js";

export let createListing = async (req, res, next) => {
  try {
    let listing = await carListing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// deleteListing
export let deleteListing = async (req, res, next) => {
  let listing = await carListing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  // hadii lasoo helo

  if (req.user.id !== listing.sellerRef) {
    return next(errorHandler(404, "You can only delete your own listings"));
  }

  try {
    await carListing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// UpdateteListing

export let UpdateteListing = async (req, res, next) => {
  let listing = await carListing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  // hadii lasoo helo

  if (req.user.id !== listing.sellerRef) {
    return next(errorHandler(404, "You can only update your own listings"));
  }

  try {
    let updatingListing = await carListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatingListing);
  } catch (error) {
    next(error);
  }
};

// getListing
export let getListing = async (req, res, next) => {
  try {
    let listing = await carListing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    console.log(error);
  }
};

// getListings

// export let getListings = async (req, res, next) => {
//   console.log(req.query);
//   try {
//     let limit = parseInt(req.query.limit) || 8;

//     let startIndex = parseInt(req.query.startIndex) || 0;

//     // handle offer
//     let offer = req.query.offer;
//     if (offer === "undefined" || offer === undefined) {
//       offer = { $in: [false, true] };
//     }
//     // handle type
//     let type = req.query.type;
//     if (type === "undefined" || type === undefined) {
//       type = { $in: ["rent", "sale"] };
//     }
//     // handle transmission
//     let transmission = req.query.transmission;
//     if (transmission === "undefined" || transmission === undefined) {
//       transmission = { $in: ["Manual", "Automatic", "CVT"] };
//     }
//     // handle condition
//     let condition = req.query.condition;
//     if (condition === "undefined" || condition === undefined) {
//       condition = { $in: ["New", "Used", "Damaged"] };
//     }
//     // handle fuelType
//     let fuelType = req.query.fuelType;
//     if (fuelType === "undefined" || fuelType === undefined) {
//       fuelType = { $in: ["Petrol", "Diesel", "Electric", "Hybrid"] };
//     }

//     // searching

//     let searchTerm = req.query.searchTerm || "";

//     console.log(searchTerm);

//     let sort = req.query.sort || "createdAt";
//     let order = req.query.order || "desc";

//     const myLising = await carListing.find({
//       offer,
//       type,
//       transmission,
//       condition,
//       fuelType,
//       $or: [{ name: { $regex: searchTerm, $options: "i" } }],
//     });

//     console.log(myLising);

//     let listings = await carListing
//       .find({
//         offer,
//         type,
//         transmission,
//         condition,
//         fuelType,
//         $or: [
//           { name: { $regex: searchTerm, $options: "i" } },
//           { make: { $regex: searchTerm, $options: "i" } },
//           { model: { $regex: searchTerm, $options: "i" } },
//           { description: { $regex: searchTerm, $options: "i" } },
//         ],
//       })
//       .sort({ [sort]: order })
//       .limit(limit)
//       .skip(startIndex);
//     res.status(200).json(listings);
//   } catch (error) {
//     next(error);
//   }
// };

export const getListings = async (req, res, next) => {
  try {
    // limit
    const limit = parseInt(req.query.limit) || 8;

    // start index
    const startIndex = parseInt(req.query.startIndex) || 0;

    // handle offer
    let offer = req.query.offer;

    if (offer === "undefined" || offer === undefined) {
      offer = { $in: [false, true] };
    }

    //handle type
    let type = req.query.type;

    if (type === "undefined" || type === "all" || type === undefined) {
      type = { $in: ["rent", "sale"] };
    }

    //handle transmission
    let transmission = req.query.transmission;

    if (
      transmission === "undefined" ||
      transmission === undefined ||
      transmission === "all"
    ) {
      transmission = { $in: ["Manual", "Automatic", "CVT"] };
    }
    //handle condition
    let condition = req.query.condition;

    if (
      condition === "undefined" ||
      condition === undefined ||
      condition === "all"
    ) {
      condition = { $in: ["New", "Used", "Damaged"] };
    }
    //handle fueltype
    let fuelType = req.query.fuelType;

    if (
      fuelType === "undefined" ||
      fuelType === undefined ||
      fuelType === "all"
    ) {
      fuelType = { $in: ["Petrol", "Diesel", "Electric", "Hybrid"] };
    }

    // search term
    const searchTerm = req.query.searchTerm || "";

    // sort
    const sort = req.query.sort || "createdAt";
    //order
    const order = req.query.order || "desc";
    const listings = await carListing.find({
      offer,
      type,
      transmission,
      condition,
      fuelType,
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { make: { $regex: searchTerm, $options: "i" } },
        { model: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
