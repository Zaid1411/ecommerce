import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const initialProducts = [
  {
    id: "fash-001",
    name: "Pleated Relaxed Wool Flannel Trousers",
    category: "Pants",
    price: 340,
    rating: 4.9,
    numReviews: 38,
    countInStock: 14,
    isFeatured: true,
    leadTime: "In Stock - Dispatches in 24h",
    color: "Black",
    colors: ["Black", "Midnight Navy", "Charcoal Melange"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "M",
    fabric: "100% Super 120s Italian Virgin Wool",
    image: "/assets/prod_pants_pleated.jpg",
    images: ["/assets/prod_pants_pleated.jpg"],
    description: "An architectural trouser cut with a subtle double reverse pleat and generous relaxed drape. Tailored from premium Italian virgin wool flannel with horn button closures and adjustable side tabs.",
    fit: "Relaxed straight leg with gentle break. Model is 186cm wearing size M.",
    craftsmanship: "Hand-finished waistband, taped hems, crafted in Portugal."
  },
  {
    id: "fash-002",
    name: "Regular Fit Oxford Button-Down Shirt",
    category: "Shirts",
    price: 220,
    rating: 4.8,
    numReviews: 54,
    countInStock: 22,
    isFeatured: true,
    leadTime: "In Stock - Ships next day",
    color: "Sky Blue",
    colors: ["Sky Blue", "Raw Ecru", "Crisp White"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "L",
    fabric: "100% Organic Combed Cotton (240 GSM)",
    image: "/assets/prod_shirt_oxford.jpg",
    images: ["/assets/prod_shirt_oxford.jpg"],
    description: "The quintessential modern Oxford shirt reimagined with relaxed dropped shoulders and a substantial heavyweight cotton weave. Finished with mother-of-pearl buttons and a soft unlined collar.",
    fit: "Boxy, relaxed silhouette. Take your normal size for an easy drape.",
    craftsmanship: "Single-needle stitching throughout, reinforced split yoke."
  },
  {
    id: "fash-003",
    name: "Structured Cotton Twill Overshirt",
    category: "Outerwear",
    price: 380,
    rating: 5.0,
    numReviews: 29,
    countInStock: 8,
    isFeatured: true,
    leadTime: "Limited Edition - Only 8 Remaining",
    color: "Espresso Brown",
    colors: ["Espresso Brown", "Midnight Black", "Olive Twill"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "M",
    fabric: "100% Heavyweight Cotton Twill (320 GSM)",
    image: "/assets/prod_jacket_harrington.jpg",
    images: ["/assets/prod_jacket_harrington.jpg"],
    description: "A commanding tailored statement piece with twin chest utility pockets and a relaxed boxy cut. Woven from durable combed cotton twill with real horn button closures.",
    fit: "Structured shoulder with relaxed torso, accommodates layered knitwear.",
    craftsmanship: "Fully lined in breathable cotton viscose, taped interior seams."
  },
  {
    id: "fash-004",
    name: "Relaxed French Linen Camp Collar Shirt",
    category: "Shirts",
    price: 260,
    rating: 4.9,
    numReviews: 47,
    countInStock: 16,
    isFeatured: true,
    leadTime: "In Stock - Dispatches in 24h",
    color: "Rich Espresso",
    colors: ["Rich Espresso", "Sage Moss", "Cream Linen"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "M",
    fabric: "100% French Natural Linen (180 GSM)",
    image: "/assets/prod_shirt_linen.jpg",
    images: ["/assets/prod_shirt_linen.jpg"],
    description: "Effortless warm-weather tailoring crafted from Normandy long-staple flax linen. Pre-washed for a soft tumbled handfeel and featuring an open notched camp collar.",
    fit: "Straight hem, casual relaxed drape designed to be worn untucked.",
    craftsmanship: "Mother-of-pearl buttons, felled French seams for comfort."
  },
  {
    id: "fash-005",
    name: "Double-Breasted Wool Twill Overcoat",
    category: "Outerwear",
    price: 680,
    rating: 5.0,
    numReviews: 22,
    countInStock: 6,
    isFeatured: true,
    leadTime: "Made in Portugal - Dispatches in 48h",
    color: "Camel Melange",
    colors: ["Camel Melange", "Charcoal Grey", "Midnight Navy"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "L",
    fabric: "100% Heavy Wool Twill (520 GSM)",
    image: "/assets/prod_coat_overcoat.jpg",
    images: ["/assets/prod_coat_overcoat.jpg"],
    description: "An imposing, beautifully proportioned double-breasted overcoat. Tailored with peak lapels, deep welt pockets, and a generous back vent for fluid movement.",
    fit: "Tailored to wear comfortably over knitwear and tailored suiting jackets.",
    craftsmanship: "Full cupro lining, natural horn buttons, interior chest passport pocket."
  },
  {
    id: "fash-006",
    name: "Chunky Ribbed Wool Fisherman Knit",
    category: "Knitwear",
    price: 310,
    rating: 4.8,
    numReviews: 31,
    countInStock: 11,
    isFeatured: true,
    leadTime: "In Stock - Ships next day",
    color: "Oatmeal Melange",
    colors: ["Oatmeal Melange", "Deep Charcoal", "Forest Green"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "M",
    fabric: "100% Scottish Lambswool (7-Gauge)",
    image: "/assets/prod_knit_sweater.jpg",
    images: ["/assets/prod_knit_sweater.jpg"],
    description: "Knitted from dense 7-gauge Scottish lambswool in an authentic brioche fisherman rib. Offers substantial warmth with an enduring, textured silhouette.",
    fit: "Relaxed regular fit with saddle shoulders. Model is 184cm wearing size M.",
    craftsmanship: "Fully fashioned knitting with zero yarn waste, reinforced collar."
  },
  {
    id: "fash-007",
    name: "Heavyweight Boxy Jersey T-Shirt",
    category: "Shirts",
    price: 95,
    rating: 4.7,
    numReviews: 68,
    countInStock: 35,
    isFeatured: false,
    leadTime: "In Stock - Immediate Dispatch",
    color: "Vintage Chalk",
    colors: ["Vintage Chalk", "Washed Black", "Olive Drab"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "L",
    fabric: "100% Organic Combed Cotton Jersey (280 GSM)",
    image: "/assets/prod_tshirt_heavy.jpg",
    images: ["/assets/prod_tshirt_heavy.jpg"],
    description: "The definitive luxury t-shirt. Cut from an ultra-dense 280 GSM cotton jersey with a structured boxy torso and a tight 1-inch bound crewneck collar.",
    fit: "Boxy drape with dropped shoulder seams.",
    craftsmanship: "Double-needle coverstitching, pre-shrunk organic yarn."
  },
  {
    id: "fash-008",
    name: "Straight-Leg Selvedge Denim Jean",
    category: "Pants",
    price: 290,
    rating: 4.9,
    numReviews: 41,
    countInStock: 18,
    isFeatured: true,
    leadTime: "In Stock - Dispatches in 24h",
    color: "Raw Indigo",
    colors: ["Raw Indigo", "Washed Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    defaultSize: "M",
    fabric: "14oz Japanese Red-Line Selvedge Cotton",
    image: "/assets/prod_pants_denim.jpg",
    images: ["/assets/prod_pants_denim.jpg"],
    description: "Woven in Kojima, Japan on vintage shuttle looms. Raw, unwashed 14oz red-line selvedge denim designed to mold uniquely to the wearer over years of wear.",
    fit: "Mid-rise, straight leg with clean red-line selvedge ID at cuff.",
    craftsmanship: "Solid copper rivets, custom embossed Atelier waistband patch."
  }
];

const initialUsers = [
  {
    name: "Studio Director",
    email: "admin@atelier.com",
    isAdmin: true,
    passwordHash: bcrypt.hashSync("admin123", 10),
  },
  {
    name: "Sophie Montgomery",
    email: "client@example.com",
    isAdmin: false,
    passwordHash: bcrypt.hashSync("client123", 10),
  }
];

const seedData = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('Cannot seed: MongoDB is not connected. Please check your MONGO_URI.');
    process.exit(1);
  }

  try {
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing MongoDB collections.');

    // Seed products and users
    await Product.insertMany(initialProducts);
    await User.insertMany(initialUsers);

    console.log(`✓ Successfully seeded ${initialProducts.length} garments and ${initialUsers.length} users into MongoDB Atlas!`);
    process.exit(0);
  } catch (error) {
    console.error(`Error during MongoDB seeding: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('Cannot destroy: MongoDB is not connected.');
    process.exit(1);
  }

  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('✓ Successfully cleared all collections from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying MongoDB data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
