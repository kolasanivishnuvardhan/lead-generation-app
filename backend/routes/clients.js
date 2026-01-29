const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { upload, cropImage } = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const tempDir = path.join(__dirname, '../uploads/temp');
const clientsDir = path.join(__dirname, '../uploads/clients');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir, { recursive: true });

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create client
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
    if (!req.body.name || !req.body.description || !req.body.designation) {
      return res.status(400).json({ message: 'Name, description, and designation are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const tempPath = req.file.path;
    const filename = 'client-' + Date.now() + path.extname(req.file.originalname);
    const outputPath = path.join(clientsDir, filename);

    // Crop image to 450x350
    await cropImage(tempPath, outputPath);

    const client = new Client({
      name: req.body.name,
      description: req.body.description,
      designation: req.body.designation,
      image: `/uploads/clients/${filename}`
    });

    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(400).json({ message: error.message || 'Failed to create client' });
  }
});

// Update client
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', client.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      const tempPath = req.file.path;
      const filename = 'client-' + Date.now() + path.extname(req.file.originalname);
      const outputPath = path.join(clientsDir, filename);

      await cropImage(tempPath, outputPath);
      client.image = `/uploads/clients/${filename}`;
    }

    if (req.body.name) client.name = req.body.name;
    if (req.body.description) client.description = req.body.description;
    if (req.body.designation) client.designation = req.body.designation;

    const updatedClient = await client.save();
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', client.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
