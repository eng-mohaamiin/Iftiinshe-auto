import mongoose from "mongoose";

let carListingSchema = new mongoose.Schema({
    name: {
        type : String,
        require: true
    },
    description: {
        type : String,
        require: true
    },
    make: {
        type : String,
        require: true
    },
    model: {
        type : String,
        require: true
    },
    year: {
        type : Number,
        require: true
    },
    price: {
        type : Number,
        require: true
    },
    discount: {
        type : Number,
    },
      offer: {
      type: Boolean,
    },
    mileage: {
        type : Number,
        require: true
    },
    fuelType: {
        type : String,
        require: true,
        enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
     transmission: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual", "CVT"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Used", "Damaged"],
    },
     imageURLs: {
      type: Array,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["sale", "rent"],
    },
    sellerRef: {
      type: String,
      required: true
    }
},

{
    timestamps: true,
  }

)



let carListing = mongoose.model("carListing", carListingSchema)


export default carListing