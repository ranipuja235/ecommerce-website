import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.model';
import { User } from './models/User.model';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB Connected for Seeding');
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const sampleProducts = [
  // Jewelry
  {
    name: 'Diamond Eternity Ring',
    description: 'A stunning 18k white gold ring encrusted with round brilliant-cut diamonds, representing eternal love.',
    price: 3500,
    category: 'jewelry',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    rating: 4.8,
    numReviews: 4,
    featured: true,
  },
  {
    name: 'Sapphire Pendant Necklace',
    description: 'Deep blue sapphire surrounded by a halo of diamonds on a platinum chain.',
    price: 2100,
    category: 'jewelry',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'],
    stock: 8,
    rating: 4.5,
    numReviews: 2,
    featured: false,
  },
  {
    name: 'Pearl Drop Earrings',
    description: 'Elegant South Sea pearl drop earrings with diamond accents.',
    price: 1800,
    category: 'jewelry',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
    stock: 15,
    rating: 4.7,
    numReviews: 6,
    featured: true,
  },
  {
    name: 'Gold Tennis Bracelet',
    description: 'Classic 14k yellow gold tennis bracelet featuring flawless diamonds.',
    price: 4200,
    category: 'jewelry',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800'],
    stock: 5,
    rating: 4.9,
    numReviews: 8,
    featured: false,
  },
  {
    name: 'Ruby Cocktail Ring',
    description: 'A vibrant oval-cut ruby set in a vintage-inspired rose gold setting.',
    price: 2800,
    category: 'jewelry',
    images: ['https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&q=80&w=800'],
    stock: 3,
    rating: 5.0,
    numReviews: 1,
    featured: true,
  },

  // Fashion
  {
    name: 'Classic Leather Tote',
    description: 'Handcrafted full-grain Italian leather tote bag, perfect for everyday elegance.',
    price: 850,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'],
    stock: 25,
    rating: 4.6,
    numReviews: 12,
    featured: true,
  },
  {
    name: 'Silk Evening Scarf',
    description: '100% pure silk scarf with a unique artisanal print, adds a touch of luxury to any outfit.',
    price: 250,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800'],
    stock: 40,
    rating: 4.3,
    numReviews: 5,
    featured: false,
  },
  {
    name: 'Designer Stiletto Heels',
    description: 'Iconic patent leather stiletto heels featuring a signature red sole.',
    price: 795,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'],
    stock: 10,
    rating: 4.8,
    numReviews: 15,
    featured: true,
  },
  {
    name: 'Cashmere Trench Coat',
    description: 'A timeless double-breasted trench coat crafted from premium Mongolian cashmere.',
    price: 1950,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'],
    stock: 6,
    rating: 4.9,
    numReviews: 7,
    featured: false,
  },
  {
    name: 'Quilted Crossbody Bag',
    description: 'Elegant quilted leather crossbody bag with a gold-tone chain strap.',
    price: 1250,
    category: 'fashion',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'],
    stock: 18,
    rating: 4.7,
    numReviews: 22,
    featured: true,
  },

  // Watches
  {
    name: 'Chronograph Masterpiece',
    description: 'Precision Swiss-made chronograph watch with a brushed steel case and sapphire crystal.',
    price: 5400,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
    stock: 7,
    rating: 4.9,
    numReviews: 11,
    featured: true,
  },
  {
    name: 'Rose Gold Automatic',
    description: 'A sophisticated automatic timepiece enclosed in an 18k rose gold case with a leather strap.',
    price: 8200,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'],
    stock: 4,
    rating: 5.0,
    numReviews: 3,
    featured: true,
  },
  {
    name: 'Minimalist Dress Watch',
    description: 'Ultra-thin dress watch featuring a clean white dial and a minimalist index.',
    price: 1500,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800'],
    stock: 20,
    rating: 4.4,
    numReviews: 9,
    featured: false,
  },
  {
    name: 'Diver Pro',
    description: 'Professional dive watch water-resistant up to 300 meters with a unidirectional ceramic bezel.',
    price: 3800,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    rating: 4.6,
    numReviews: 14,
    featured: false,
  },
  {
    name: 'Vintage Aviator',
    description: 'Inspired by early aviation, featuring a large dial, luminescent hands, and a distressed leather strap.',
    price: 2900,
    category: 'watches',
    images: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800'],
    stock: 8,
    rating: 4.5,
    numReviews: 6,
    featured: true,
  },

  // Accessories
  {
    name: 'Signature Monogram Belt',
    description: 'Reversible leather belt featuring a prominent signature monogram buckle.',
    price: 450,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800'],
    stock: 35,
    rating: 4.7,
    numReviews: 19,
    featured: true,
  },
  {
    name: 'Oversized Sunglasses',
    description: 'Chic oversized sunglasses with gradient lenses and UV400 protection.',
    price: 320,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'],
    stock: 45,
    rating: 4.5,
    numReviews: 24,
    featured: false,
  },
  {
    name: 'Continental Zip Wallet',
    description: 'Spacious continental wallet made from textured Saffiano leather.',
    price: 580,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&q=80&w=800'],
    stock: 22,
    rating: 4.8,
    numReviews: 13,
    featured: true,
  },
  {
    name: 'Silk Tie & Pocket Square',
    description: 'Matching 100% woven silk tie and pocket square set for formal occasions.',
    price: 195,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&q=80&w=800'],
    stock: 30,
    rating: 4.4,
    numReviews: 8,
    featured: false,
  },
  {
    name: 'Leather Gloves',
    description: 'Supple Napa leather gloves lined with cashmere for ultimate warmth and style.',
    price: 240,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'],
    stock: 16,
    rating: 4.6,
    numReviews: 10,
    featured: false,
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    // await User.deleteMany(); // Uncomment if you want to wipe users too

    await Product.insertMany(sampleProducts);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

importData();
