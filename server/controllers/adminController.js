const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Progress = require('../models/Progress')
const { JWT_SECRET } = require('../config/env')

// Auto-initialize Default Super Admin on server startup
async function ensureDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: 'Admin' })
    if (!existingAdmin) {
      const defaultEmail = 'admin@campus2career.com'
      const defaultPassword = 'admin123'
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(defaultPassword, salt)

      const defaultAdmin = new User({
        name: 'Super Admin',
        email: defaultEmail,
        passwordHash,
        role: 'Admin'
      })
      await defaultAdmin.save()
      console.log(`👑 Initialized Default Admin Account: ${defaultEmail} / ${defaultPassword}`)
    }
  } catch (err) {
    console.error('⚠️ Default admin check error:', err.message)
  }
}

// POST /api/admin/login — Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials.' })
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      message: 'Admin login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Admin Login Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

// POST /api/admin/create-admin — Existing Admin creating another Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const cleanEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ email: cleanEmail })
    if (existing) {
      if (existing.role === 'Admin') {
        return res.status(400).json({ message: 'A user with this email is already an Admin.' })
      }
      existing.role = 'Admin'
      await existing.save()
      return res.json({
        message: `Existing account for ${cleanEmail} promoted to Admin.`,
        user: { id: existing._id, name: existing.name, email: existing.email, role: existing.role }
      })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newAdmin = new User({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'Admin'
    })
    await newAdmin.save()

    res.status(201).json({
      message: `Admin account for ${cleanEmail} created successfully.`,
      user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
    })
  } catch (error) {
    console.error('Create Admin Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

// GET /api/admin/users — list all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 })
    res.json({ users })
  } catch (error) {
    console.error('Admin Users GET Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

// DELETE /api/admin/users/:id — delete user & progress
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (id === req.userId.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' })
    }
    const deleted = await User.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'User not found.' })
    
    await Progress.deleteMany({ userId: id })
    res.json({ message: `User ${deleted.email} deleted successfully.` })
  } catch (error) {
    console.error('Admin Delete User Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

// PUT /api/admin/users/:id/role — update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body
    const validRoles = ['Student', 'Mentor', 'Admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` })
    }
    
    const existingUser = await User.findById(id)
    if (!existingUser) return res.status(404).json({ message: 'User not found.' })
    
    if (existingUser.email === 'admin@campus2career.com') {
      return res.status(403).json({ message: 'Cannot change the role of the primary admin.' })
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true, select: '-passwordHash' })
    res.json({ message: `Role updated to ${role}.`, user })
  } catch (error) {
    console.error('Admin Role Update Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

// GET /api/admin/stats — platform-wide analytics
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalAdmins = await User.countDocuments({ role: 'Admin' })
    const totalMentors = await User.countDocuments({ role: 'Mentor' })
    const totalStudents = await User.countDocuments({ role: 'Student' })
    const totalProgressRecords = await Progress.countDocuments()

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    const recentUsers = await User.find({}, '-passwordHash').sort({ createdAt: -1 }).limit(5)

    const topSubjects = await Progress.aggregate([
      { $group: { _id: '$subjectSlug', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    res.json({
      totalUsers,
      totalAdmins,
      totalMentors,
      totalStudents,
      totalProgressRecords,
      newUsersThisWeek,
      recentUsers,
      topSubjects,
    })
  } catch (error) {
    console.error('Admin Stats Error:', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
}

module.exports.ensureDefaultAdmin = ensureDefaultAdmin
