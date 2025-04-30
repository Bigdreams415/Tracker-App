
// 1. Required Libraries
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

// 2. App Configuration
const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to serve home.html for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 3. Hardcoded Configuration (instead of .env)
const config = {
  PORT: 5000,
  MONGO_URI: 'mongodb+srv://Broker:mYyJcLJd8Vd.4X5@broker.sxo7n.mongodb.net/?retryWrites=true&w=majority&appName=Broker', // Added database name
  JWT_SECRET: '81dW6VMPpUbPVL6c932w5a5JpgkREe1yeAk9ak3fmmACUrz2SLa1luqRAXodedswx+yV7BdZPvSS3GcHrOUOng=='
};

// 4. Database Models
// Admin Model
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

// Transaction Model
const transactionSchema = new mongoose.Schema({
  trackingNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  personName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  statusUpdates: [{
    stage: {
      type: String,
      enum: [
        'Initiated',
        'Pending Verification',
        'Verified',
        'Under Review',
        'Processing',
        'Awaiting Confirmation',
        'Authorized',
        'Queued for Dispatch',
        'In Transit',
        'Awaiting Final Settlement',
        'Settled',
        'Sent',
        'Recipient Notified',
        'Completed',
        'Failed',
        'On Hold',
        'Cancelled',
        'Refunded',
        'Disputed',
        'Escrow Holding',
        'Escrow Released',
        'Expired'
      ],
      required: true
    },
    message: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

// Ensure trackingNumber index exists
Transaction.collection.createIndex({ trackingNumber: 1 }, { unique: true })
  .then(() => console.log('Tracking number index verified'))
  .catch(err => console.error('Index error:', err));


// 4.1. Seed Initial Admin (NEW)
const seedAdmin = async () => {
  try {
    if (await Admin.findOne({ username: 'admin' })) {
      console.log('Default admin already exists');
      return;
    }
    
    const admin = new Admin({
      username: 'admin',
      password: 'admin123' // Will be auto-hashed by the pre-save hook
    });
    
    await admin.save();
    console.log('✅ Default admin created\nUsername: admin\nPassword: admin123');
  } catch (err) {
    console.error('Admin seeding error:', err.message);
  }
};

// 5. Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.admin = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 6. API Routes (EXISTING CODE REMAINS UNCHANGED)
// Admin Registration
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ username, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, config.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, config.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enhanced transaction registration endpoint
app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    console.log('Received registration data:', req.body); // Debug log
    
    const { trackingNumber, personName, amount, company } = req.body;
    
    // Validation
    if (!trackingNumber || !personName || !amount || !company) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing transaction
    const existing = await Transaction.findOne({ trackingNumber });
    if (existing) {
      return res.status(400).json({ message: 'Tracking number already exists' });
    }

    const transaction = new Transaction({
      trackingNumber,
      personName,
      amount,
      company,
      statusUpdates: [{
        stage: 'Initiated',
        message: 'Your transaction request has been successfully initiated. Awaiting verification.',
        updatedBy: req.admin.id
      }]
    });

    await transaction.save();
    console.log('New transaction saved:', transaction); // Debug log
    res.status(201).json(transaction);
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: err.message || 'Server error during registration' 
    });
  }
});

// Get transaction by tracking number
app.get('/api/transactions/:trackingNumber', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      trackingNumber: req.params.trackingNumber 
    }).populate('statusUpdates.updatedBy', 'username');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add status update (updated version)
app.post('/api/transactions/:id/updates', authMiddleware, async (req, res) => {
  try {
    const { stage, message } = req.body;
    
    // Validate input
    if (!stage || !message) {
      return res.status(400).json({ message: 'Stage and message are required' });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          statusUpdates: {
            stage,
            message,
            updatedBy: req.admin.id
          }
        }
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json({
      success: true,
      message: 'Status update added successfully',
      transaction
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// 7. Database Connection & Server Start (UPDATED)
mongoose.connect(config.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedAdmin(); // Runs only once on startup
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// 8. Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});