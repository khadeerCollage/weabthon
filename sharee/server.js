const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://skr7993257687:KwhuWkS46t0Rtq3t@cluster0.dei8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Define models
const User = mongoose.model('User', {
  email: String,
  password: String,
  role: String,
});

const Profile = mongoose.model('Profile', {
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  education: String,
  skills: [String],
  experience: String,
});

const Job = mongoose.model('Job', {
  employerId: mongoose.Schema.Types.ObjectId,
  title: String,
  company: String,
  location: String,
  description: String,
});

const Application = mongoose.model('Application', {
  jobId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  status: String,
});

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes
app.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    const token = jwt.sign({ _id: user._id }, 'your_jwt_secret');
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ _id: user._id }, 'your_jwt_secret');
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/profile', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    res.send(profile);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/profile', auth, async (req, res) => {
  try {
    const profile = new Profile({ ...req.body, userId: req.user._id });
    await profile.save();
    res.status(201).send(profile);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/jobs', auth, async (req, res) => {
  try {
    const { search, location } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    const jobs = await Job.find(query);
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/jobs/:id/apply', auth, async (req, res) => {
  try {
    const application = new Application({
      jobId: req.params.id,
      userId: req.user._id,
      status: 'pending',
    });
    await application.save();
    res.status(201).send(application);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id });
    res.send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/employer/jobs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).send({ error: 'Only employers can post jobs' });
    }
    const job = new Job({ ...req.body, employerId: req.user._id });
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/employer/jobs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).send({ error: 'Access denied' });
    }
    const jobs = await Job.find({ employerId: req.user._id });
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/employer/applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).send({ error: 'Access denied' });
    }
    const jobs = await Job.find({ employerId: req.user._id });
    const jobIds = jobs.map(job => job._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });
    res.send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/employer/applications/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).send({ error: 'Access denied' });
    }
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.send(application);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/resume/export', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).send({ error: 'Profile not found' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Generate HTML for the resume
    const html = `
      <html>
        <body>
          <h1>${profile.name}</h1>
          <h2>Education</h2>
          <p>${profile.education}</p>
          <h2>Skills</h2>
          <ul>
            ${profile.skills.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
          <h2>Experience</h2>
          <p>${profile.experience}</p>
        </body>
      </html>
    `;

    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.send(pdf);
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
