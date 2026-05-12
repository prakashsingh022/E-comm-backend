const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all banners (for admin)
// @route   GET /api/banners/admin
// @access  Private/Admin
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
  const { title, image, link, isActive } = req.body;

  try {
    const banner = await Banner.create({
      title,
      image,
      link,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = req.body.title || banner.title;
      banner.image = req.body.image || banner.image;
      banner.link = req.body.link || banner.link;
      banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      await banner.deleteOne();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
