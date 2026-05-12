const Section = require('../models/Section');

// @desc    Get all sections
// @route   GET /api/section
// @access  Public
const getSections = async (req, res) => {
  try {
    const sections = await Section.find({});
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a section
// @route   POST /api/section/add
// @access  Private/Admin
const createSection = async (req, res) => {
  const { title, slug } = req.body;

  try {
    const sectionExists = await Section.findOne({ slug });

    if (sectionExists) {
      return res.status(400).json({ message: 'Section with this slug already exists' });
    }

    const section = await Section.create({ title, slug });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a section
// @route   PUT /api/section/:id
// @access  Private/Admin
const updateSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (section) {
      section.title = req.body.title || section.title;
      section.slug = req.body.slug || section.slug;

      const updatedSection = await section.save();
      res.json(updatedSection);
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a section
// @route   DELETE /api/section/:id
// @access  Private/Admin
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (section) {
      await section.deleteOne();
      res.json({ message: 'Section removed' });
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
};
