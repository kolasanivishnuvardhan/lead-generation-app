const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { upload, cropImage } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const tempDir = path.join(__dirname, '../uploads/temp');
const projectsDir = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir, { recursive: true });

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
  });
}, async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const tempPath = req.file.path;
    const filename = 'project-' + Date.now() + path.extname(req.file.originalname);
    const outputPath = path.join(projectsDir, filename);

    // Crop image to 450x350
    await cropImage(tempPath, outputPath);

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      image: `/uploads/projects/${filename}`
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message || 'Failed to create project' });
  }
});

// Update project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      const tempPath = req.file.path;
      const filename = 'project-' + Date.now() + path.extname(req.file.originalname);
      const outputPath = path.join(projectsDir, filename);

      await cropImage(tempPath, outputPath);
      project.image = `/uploads/projects/${filename}`;
    }

    if (req.body.name) project.name = req.body.name;
    if (req.body.description) project.description = req.body.description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', project.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
