const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Section = require('./models/Section');

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({}).populate('section');
    console.log(`Found ${products.length} products`);

    products.forEach(p => {
      console.log(`Product: ${p.name}, Category: ${p.category}, Section: ${p.section ? p.section.slug : 'None'}`);
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
