// seed-companies.js - Script to seed/sync initial company profiles into MongoDB

require('dotenv').config()
const dns = require('dns')
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch (err) {
  // Ignore DNS config error
}

const mongoose = require('mongoose')
const companiesData = require('./companies-data')
const Company = require('./models/Company')
const { MONGODB_URI } = require('./config/env')

async function seedCompanies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB Atlas')

    console.log(`⏳ Seeding/Updating ${companiesData.length} company profiles...`)
    
    for (const company of companiesData) {
      await Company.findOneAndUpdate(
        { id: company.id },
        { ...company, isHidden: false, updatedAt: new Date() },
        { upsert: true, new: true }
      )
      console.log(`   ✓ ${company.name} (${company.fullName || company.id}) — Synced with full rounds, tracks & 7-Day sprint.`)
    }

    console.log('\n🎉 Successfully updated all 5 company profiles (TCS, Cognizant, Accenture, Wipro, Soliton) in MongoDB!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding companies:', error.message)
    process.exit(1)
  }
}

seedCompanies()
