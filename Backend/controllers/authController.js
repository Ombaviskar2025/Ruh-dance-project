const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { role } = req.params; 

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide an email and password." });
    }

    // 1. Find user by email AND role
    const user = await User.findOne({ 
      email: String(email).toLowerCase().trim(), 
      role: String(role).toLowerCase() 
    }); 

    if (!user) {
      return res.status(401).json({ message: `Invalid Credentials: No ${role} account found.` });
    }

    if (user.role === 'instructor' && !user.isApproved) {
        return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    // 2. Compare the plain text password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials: Password incorrect." });
    }

    // 3. Generate JWT Token
    // Removed the premature res.status(200) that was here previously to prevent "Headers already sent" error
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'RUH_DANCE_SECRET_KEY_2024', 
      { expiresIn: '24h' }
    );

    // 4. Send success response
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server Error during login" });
  }
};

// --- REGISTER LOGIC ---
exports.register = async (req, res) => {
  try {
    // Added 'username' to destructuring if you still want to collect it from frontend
    const { fullName, username, email, password, phone, gender, age, danceStyle } = req.body;

    // 1. Check if user already exists
    // If username is not provided by the user, we check only by email
    const query = username 
      ? { $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] }
      : { email: email.toLowerCase() };

    let userExists = await User.findOne(query);
    
    if (userExists) {
      return res.status(400).json({ message: "Email or Username already registered." });
    }

    // 2. HASH THE PASSWORD manually before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user object
    const newUser = new User({
      fullName,
      username: username || email.split('@')[0], // Fallback if username isn't sent
      email: email.toLowerCase(),
      password: hashedPassword, 
      phone,
      gender,
      age,
      danceStyle,
      role: req.body.role || 'student', // Dynamic role instead of hardcoded
      isApproved: true // Instantly approve to prevent account lockouts since Admin has no approve button yet!
    });

    // 4. Save to MongoDB
    await newUser.save();
    
    res.status(201).json({ message: "Registration successful! You can now log in." });

  } catch (err) {
    console.error("Registration Error Detail:", err);
    res.status(500).json({ 
      message: "Server Error during registration", 
      error: err.message 
    });
  }
};