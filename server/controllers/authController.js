const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { JWT_SECRET } = require('../config/env')

exports.register = async (req, res) => {
  try {
    const { name, email, password, course } = req.body

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Full name, email address, and password are required.' })
    }

    const trimmedName = name.trim()
    const cleanEmail = email.toLowerCase().trim()

    // 2. Validate Full Name (letters, spaces, periods, apostrophes only, min 2 chars)
    if (trimmedName.length < 2) {
      return res.status(400).json({ message: 'Full name must be at least 2 characters long.' })
    }
    if (!/^[a-zA-Z\s'.]{2,60}$/.test(trimmedName)) {
      return res.status(400).json({ message: 'Full name should only contain letters, spaces, and standard name characters.' })
    }

    // 3. Validate Email Format (must start with a letter, no consecutive dots, valid TLD)
    if (!/^[a-zA-Z]/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Email address must start with a letter (cannot start with a number or special character).' })
    }
    if (cleanEmail.includes('..')) {
      return res.status(400).json({ message: 'Email address cannot contain consecutive dots.' })
    }
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address (e.g., student@university.edu).' })
    }

    // 4. Validate Password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const validCourses = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT']
    const userCourse = validCourses.includes(course) ? course : 'CSE'

    const newUser = new User({
      name: trimmedName,
      email: cleanEmail,
      passwordHash,
      role: 'Student',
      course: userCourse
    })
    await newUser.save()

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        course: newUser.course,
      }
    })
  } catch (error) {
    console.error('Registration Error:', error)
    res.status(500).json({ message: 'Internal Server Error during registration.' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course || 'CSE',
      }
    })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Internal Server Error during login.' })
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId, '-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course || 'CSE',
        createdAt: user.createdAt,
      }
    })
  } catch (error) {
    console.error('Get Current User Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}
