import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    leadTime: {
      type: String,
      default: 'In Stock - Dispatches in 24h',
    },
    color: {
      type: String,
      default: 'Standard',
    },
    colors: {
      type: [String],
      default: ['Standard'],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    defaultSize: {
      type: String,
      default: 'M',
    },
    fabric: {
      type: String,
      default: '100% Natural Fiber',
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    fit: {
      type: String,
      default: 'Relaxed tailored silhouette.',
    },
    craftsmanship: {
      type: String,
      default: 'Hand-finished tailoring, taped interior seams.',
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
