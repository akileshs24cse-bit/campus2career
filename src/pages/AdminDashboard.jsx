import React, { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/adminService'
import { companyService } from '../services/companyService'

function navigate(to, replace = false) {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function redirectToAdminLogin() {
  adminService.logout()
  navigate('/admin', true)
}

function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '10px 12px',
          color: '#fff',
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
        }}
      >
        <span>{value}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8bfba" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: '#132f2a',
            border: '1px solid rgba(215,255,117,0.2)',
            borderRadius: 10,
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt)
                setIsOpen(false)
              }}
              style={{
                padding: '10px 14px',
                color: value === opt ? '#d7ff75' : '#a8bfba',
                background: value === opt ? 'rgba(215,255,117,0.15)' : 'transparent',
                cursor: 'pointer',
                fontSize: 13,
                borderLeft: value === opt ? '3px solid #d7ff75' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (value !== opt) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.color = '#d7ff75'
                }
              }}
              onMouseLeave={e => {
                if (value !== opt) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#a8bfba'
                }
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'analytics', label: 'Analytics', title: 'Platform Analytics' },
  { id: 'users', label: ' Users', title: 'User Management' },
  { id: 'roles', label: 'Roles', title: 'Role Assignment' },
  { id: 'companies', label: 'Companies', title: 'Company Data' },
  { id: 'history', label: 'History', title: 'Hidden Companies Archive' },
]

const ROLE_COLORS = {
  Admin: { bg: 'rgba(215,255,117,0.15)', color: '#d7ff75', border: 'rgba(215,255,117,0.3)' },
  Student: { bg: 'rgba(255,255,255,0.07)', color: '#a8bfba', border: 'rgba(255,255,255,0.1)' },
}

const SKILL_SUBJECTS = [
  { slug: 'data-structures', label: 'DSA' },
  { slug: 'database-management-system', label: 'DBMS' },
  { slug: 'object-oriented-programming', label: 'OOPS' },
  { slug: 'operating-systems', label: 'Operating Systems' },
  { slug: 'computer-networks', label: 'Computer Networks' },
]

const TECHNICAL_AREAS = [
  ['dsa', 'DSA'], ['dbms', 'DBMS'], ['oops', 'OOPS'], ['os', 'OS'], ['cn', 'CN'],
]

// Predefined Technical Weightage Templates
const FOCUS_WEIGHT_TEMPLATES = [
  { label: 'Balanced (DSA Focus)', value: { dsa: 40, dbms: 20, oops: 20, os: 10, cn: 10 } },
  { label: 'DBMS Heavy', value: { dsa: 25, dbms: 40, oops: 15, os: 10, cn: 10 } },
  { label: 'OOPS & Design', value: { dsa: 30, dbms: 20, oops: 35, os: 10, cn: 5 } },
  { label: 'Full Stack (Balanced)', value: { dsa: 30, dbms: 25, oops: 25, os: 10, cn: 10 } },
  { label: 'Systems (OS & CN)', value: { dsa: 25, dbms: 15, oops: 20, os: 25, cn: 15 } },
]

// Predefined Skill Gap Breakdown
const SKILL_GAP_TEMPLATES = [
  {
    label: 'Core DSA & Coding Focus',
    value: [
      { slug: 'data-structures', name: 'Data Structures & Algorithms', priority: 'Critical' },
      { slug: 'object-oriented-programming', name: 'OOPs & Design Patterns', priority: 'High' },
    ]
  },
  {
    label: 'Backend & Database Focus',
    value: [
      { slug: 'data-structures', name: 'Data Structures & Algorithms', priority: 'High' },
      { slug: 'database-management-system', name: 'DBMS & SQL', priority: 'Critical' },
      { slug: 'operating-systems', name: 'Operating Systems', priority: 'Medium' },
    ]
  },
  {
    label: 'Full Stack & System Design',
    value: [
      { slug: 'data-structures', name: 'Data Structures & Algorithms', priority: 'High' },
      { slug: 'database-management-system', name: 'DBMS & SQL', priority: 'High' },
      { slug: 'object-oriented-programming', name: 'OOPs & Design Patterns', priority: 'High' },
      { slug: 'operating-systems', name: 'Operating Systems', priority: 'Medium' },
      { slug: 'computer-networks', name: 'Computer Networks', priority: 'Medium' },
    ]
  },
  {
    label: 'Infrastructure & Systems',
    value: [
      { slug: 'operating-systems', name: 'Operating Systems', priority: 'Critical' },
      { slug: 'computer-networks', name: 'Computer Networks', priority: 'Critical' },
      { slug: 'data-structures', name: 'Data Structures & Algorithms', priority: 'High' },
    ]
  },
  {
    label: 'Data & Analytics Focus',
    value: [
      { slug: 'database-management-system', name: 'DBMS & SQL', priority: 'Critical' },
      { slug: 'data-structures', name: 'Data Structures & Algorithms', priority: 'Medium' },
    ]
  },
]

// Predefined Round Types
const ROUND_TEMPLATES = [
  { label: 'Online Coding Test (60 mins)', value: { name: 'Online Coding Test', duration: '60 mins', type: 'Coding' } },
  { label: 'Technical Interview (45 mins)', value: { name: 'Technical Interview', duration: '45 mins', type: 'Technical' } },
  { label: 'HR Round (30 mins)', value: { name: 'HR Round', duration: '30 mins', type: 'HR' } },
  { label: 'Group Discussion', value: { name: 'Group Discussion', duration: '30 mins', type: 'GD' } },
  { label: 'Aptitude Test (90 mins)', value: { name: 'Aptitude & Logical Reasoning', duration: '90 mins', type: 'Aptitude' } },
]

// Predefined Sprint Plans
const SPRINT_TEMPLATES = [
  {
    label: '7-Day DSA Crash Course',
    value: [
      { day: 1, focus: 'Arrays & Strings - Basics', topics: ['Array Manipulation', 'String Problems'] },
      { day: 2, focus: 'Searching & Sorting', topics: ['Binary Search', 'Quick Sort', 'Merge Sort'] },
      { day: 3, focus: 'Linked Lists & Stacks', topics: ['LL Operations', 'Stack Applications'] },
      { day: 4, focus: 'Queues & Trees', topics: ['Queue Implementation', 'Tree Traversal'] },
      { day: 5, focus: 'Graphs & DP Intro', topics: ['Graph Basics', 'Dynamic Programming Intro'] },
      { day: 6, focus: 'DP Advanced & Greedy', topics: ['DP Optimization', 'Greedy Algorithms'] },
      { day: 7, focus: 'Mock Interviews & Review', topics: ['Code Review', 'Mock Interview'] },
    ]
  },
  {
    label: '7-Day SQL Mastery',
    value: [
      { day: 1, focus: 'SQL Basics & Queries', topics: ['SELECT', 'WHERE', 'ORDER BY'] },
      { day: 2, focus: 'Joins & Aggregations', topics: ['INNER/LEFT/RIGHT JOIN', 'GROUP BY'] },
      { day: 3, focus: 'Subqueries & CTEs', topics: ['Subqueries', 'Common Table Expressions'] },
      { day: 4, focus: 'Window Functions', topics: ['RANK', 'ROW_NUMBER', 'LEAD/LAG'] },
      { day: 5, focus: 'Query Optimization', topics: ['Indexing', 'Query Plans', 'Performance'] },
      { day: 6, focus: 'Real-world Scenarios', topics: ['Case Studies', 'Complex Joins'] },
      { day: 7, focus: 'Assessment & Practice', topics: ['SQL Challenges', 'Final Review'] },
    ]
  },
  {
    label: '7-Day System Design Prep',
    value: [
      { day: 1, focus: 'Scalability & Design Basics', topics: ['Load Balancing', 'Database Sharding'] },
      { day: 2, focus: 'Caching & Databases', topics: ['Redis', 'Database Design', 'Partitioning'] },
      { day: 3, focus: 'Message Queues & APIs', topics: ['RabbitMQ', 'Kafka', 'REST API Design'] },
      { day: 4, focus: 'Microservices', topics: ['Service Architecture', 'Communication Patterns'] },
      { day: 5, focus: 'Monitoring & Logging', topics: ['Observability', 'Distributed Tracing'] },
      { day: 6, focus: 'Case Study Designs', topics: ['Netflix Architecture', 'Twitter System Design'] },
      { day: 7, focus: 'Mock Interviews', topics: ['System Design Interview', 'Problem Solving'] },
    ]
  },
]

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.Student
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {role}
    </span>
  )
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${accent || 'rgba(255,255,255,0.1)'}`,
      borderRadius: 16,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#a8bfba' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#6b8f87' }}>{sub}</div>}
    </div>
  )
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [admin, setAdmin] = useState(() => adminService.getCurrentAdmin())
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: '',
    fullName: '',
    tagline: '',
    ctcRange: '',
    badge: 'New Recruiter',
    tier: 'Tier 2',
    logoEmoji: '🏢',
    description: '',
    tracks: [
      { name: 'Associate Engineer', ctc: '₹4.5 - ₹6.5 LPA', difficulty: 'Moderate' },
      { name: 'Advanced Specialist', ctc: '₹8.0 - ₹12.0 LPA', difficulty: 'Hard' }
    ],
    rounds: [
      { roundNumber: 1, title: 'Online Assessment (Cognitive + Technical MCQ)', duration: '75 Mins', detail: 'Numerical, Verbal, Reasoning Ability + Core CS MCQs (DSA, DBMS, OS, Networks).' },
      { roundNumber: 2, title: 'Hands-on Coding Assessment', duration: '90 Mins', detail: '2 Coding problems (1 Foundation/Standard, 1 Advanced Algorithmic).' },
      { roundNumber: 3, title: 'Technical Interview', duration: '45 Mins', detail: 'Live coding problem solving, Final Year Project, Core CS fundamentals & SQL queries.' },
      { roundNumber: 4, title: 'HR / Behavioral Interview', duration: '20 Mins', detail: 'Cultural fit, communication skills, shift flexibility, and background verification.' }
    ],
    focusWeightsTemplate: 'Full Stack (Balanced)',
    skillGapTemplate: 'Full Stack & System Design',
    sprintTemplate: '7-Day DSA Crash Course',
  })
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [roleEdit, setRoleEdit] = useState({})
  const [editingCompanyId, setEditingCompanyId] = useState(null)
  const [editingCompanyData, setEditingCompanyData] = useState({})
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })
  const [creatingAdmin, setCreatingAdmin] = useState(false)

  // Guard: redirect to login if not admin
  useEffect(() => {
    if (!adminService.isLoggedIn()) redirectToAdminLogin()
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchCompanies = useCallback(async () => {
    setLoadingCompanies(true)
    const res = await companyService.getAdminCompanies()
    setLoadingCompanies(false)
    if (res.success && res.companies) {
      setCompanyList(res.companies)
    } else {
      if (/token|access denied/i.test(res.error || '')) {
        redirectToAdminLogin()
        return
      }
      showToast(res.error || 'Failed to load companies', 'error')
    }
  }, [])

  const fetchStats = useCallback(async () => {
    setLoadingStats(true)
    const res = await adminService.getStats()
    setLoadingStats(false)
    if (res.success) setStats(res)
    else if (/token|access denied/i.test(res.error || '')) redirectToAdminLogin()
    else showToast(res.error || 'Failed to load stats', 'error')
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    const res = await adminService.getUsers()
    setLoadingUsers(false)
    if (res.success) {
      setUsers(res.users)
      setRoleEdit(Object.fromEntries(res.users.map(u => [u._id, u.role])))
    } else if (/token|access denied/i.test(res.error || '')) {
      redirectToAdminLogin()
    } else {
      showToast(res.error || 'Failed to load users', 'error')
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'analytics') fetchStats()
    if (activeTab === 'users' || activeTab === 'roles') fetchUsers()
    if (activeTab === 'companies' || activeTab === 'history') fetchCompanies()
  }, [activeTab, fetchStats, fetchUsers, fetchCompanies])

  const handleDelete = async (id) => {
    const res = await adminService.deleteUser(id)
    setDeleteConfirm(null)
    if (res.success) {
      showToast(res.message)
      setUsers(u => u.filter(x => x._id !== id))
    } else {
      showToast(res.message, 'error')
    }
  }

  const handleRoleUpdate = async (id) => {
    const newRole = roleEdit[id]
    const res = await adminService.updateUserRole(id, newRole)
    if (res.success) {
      showToast(`Role updated to ${newRole}`)
      setUsers(u => u.map(x => x._id === id ? { ...x, role: newRole } : x))
    } else {
      showToast(res.message, 'error')
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      showToast('Name, email, and password are required.', 'error')
      return
    }
    setCreatingAdmin(true)
    const res = await adminService.createAdmin(newAdmin.name, newAdmin.email, newAdmin.password)
    setCreatingAdmin(false)
    if (res.success) {
      showToast(res.message || 'Admin account created successfully!')
      setNewAdmin({ name: '', email: '', password: '' })
      setShowAddAdmin(false)
      fetchUsers()
    } else {
      showToast(res.error || 'Failed to create admin.', 'error')
    }
  }

  const handleAddCompany = async () => {
    const name = newCompany.name.trim()
    const fullName = newCompany.fullName.trim() || name
    if (!name) {
      showToast('Company name is required.', 'error')
      return
    }

    const safeId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Get selected templates
    const focusWeightTemplate = FOCUS_WEIGHT_TEMPLATES.find(t => t.label === newCompany.focusWeightsTemplate)
    const skillGapTemplate = SKILL_GAP_TEMPLATES.find(t => t.label === newCompany.skillGapTemplate)
    const sprintTemplate = SPRINT_TEMPLATES.find(t => t.label === newCompany.sprintTemplate)
    const selectedRounds = newCompany.roundsTemplate.map(roundLabel => 
      ROUND_TEMPLATES.find(t => t.label === roundLabel)?.value
    ).filter(Boolean)

    const validTracks = (newCompany.tracks || []).filter(t => t.name?.trim())
    const computedCtcRange = newCompany.ctcRange?.trim() 
      || (validTracks.length > 0 ? `${validTracks[0].ctc}${validTracks.length > 1 ? ` – ${validTracks[validTracks.length - 1].ctc}` : ''}` : '₹4.0 LPA – ₹10.0 LPA')

    const validRounds = (newCompany.rounds || [])
      .filter(r => r.title?.trim())
      .map((r, i) => ({
        roundNumber: i + 1,
        title: r.title.trim(),
        duration: r.duration?.trim() || '45 Mins',
        detail: r.detail?.trim() || 'Assessment and interview evaluation stage.'
      }))

    const company = {
      id: safeId,
      name,
      fullName,
      logoEmoji: newCompany.logoEmoji || '🏢',
      brandColor: '#1d4ed8',
      accentColor: '#3b82f6',
      bgSoft: '#eff6ff',
      badge: newCompany.badge || 'New Recruiter',
      tier: newCompany.tier || 'Tier 2',
      ctcRange: computedCtcRange,
      tracks: validTracks,
      tagline: newCompany.tagline || 'New employer opportunity for campus candidates',
      description: newCompany.description || 'Company profile added by admin.',
      rounds: validRounds,
      focusWeights: focusWeightTemplate?.value || { dsa: 30, dbms: 25, oops: 25, os: 10, cn: 10 },
      targetTopics: (skillGapTemplate?.value || []).map(topic => ({
        subjectSlug: topic.slug,
        topicTitle: topic.name,
        priority: topic.priority,
      })),
      sprintPlan: sprintTemplate?.value || [],
      drills: [],
    }

    const res = await companyService.createCompany(company)
    if (res.success) {
      setCompanyList(prev => [...prev, res.company])
      setNewCompany({
        name: '',
        fullName: '',
        tagline: '',
        ctcRange: '',
        badge: 'New Recruiter',
        tier: 'Tier 2',
        logoEmoji: '🏢',
        description: '',
        tracks: [
          { name: 'Associate Engineer', ctc: '₹4.5 - ₹6.5 LPA', difficulty: 'Moderate' },
          { name: 'Advanced Specialist', ctc: '₹8.0 - ₹12.0 LPA', difficulty: 'Hard' }
        ],
        rounds: [
          { roundNumber: 1, title: 'Online Assessment (Cognitive + Technical MCQ)', duration: '75 Mins', detail: 'Numerical, Verbal, Reasoning Ability + Core CS MCQs (DSA, DBMS, OS, Networks).' },
          { roundNumber: 2, title: 'Hands-on Coding Assessment', duration: '90 Mins', detail: '2 Coding problems (1 Foundation/Standard, 1 Advanced Algorithmic).' },
          { roundNumber: 3, title: 'Technical Interview', duration: '45 Mins', detail: 'Live coding problem solving, Final Year Project, Core CS fundamentals & SQL queries.' },
          { roundNumber: 4, title: 'HR / Behavioral Interview', duration: '20 Mins', detail: 'Cultural fit, communication skills, shift flexibility, and background verification.' }
        ],
        focusWeightsTemplate: 'Full Stack (Balanced)',
        skillGapTemplate: 'Full Stack & System Design',
        sprintTemplate: '7-Day DSA Crash Course',
      })
      showToast(`${name} was added successfully.`)
    } else {
      showToast(res.error || 'Failed to add company', 'error')
    }
  }

  const handleRemoveCompany = async (companyId) => {
    const companyName = companyList.find(company => company.id === companyId)?.name || 'This company'
    if (!window.confirm(`Hide ${companyName} from students? You can edit or restore it later from History.`)) return

    const res = await companyService.hideCompany(companyId)
    if (res.success) {
      setCompanyList(prev => prev.map(c => c.id === companyId ? res.company : c))
      showToast(res.message || `${companyName} was hidden and saved to History.`)
    } else {
      showToast(res.error || 'Failed to hide company', 'error')
    }
  }

  const handleRestoreCompany = async (companyId) => {
    const res = await companyService.restoreCompany(companyId)
    if (res.success) {
      setCompanyList(prev => prev.map(c => c.id === companyId ? res.company : c))
      showToast(res.message || 'Company restored and visible to students.')
    } else {
      showToast(res.error || 'Failed to restore company', 'error')
    }
  }

  const handleEditCompany = (company) => {
    setEditingCompanyId(company.id)
    setEditingCompanyData({
      ...company,
      tagline: company.tagline || '',
      description: company.description || '',
      tracks: (company.tracks || []).map(t => ({
        name: t.name || '',
        ctc: t.ctc || '',
        difficulty: t.difficulty || 'Moderate',
        focus: t.focus || ''
      })),
      rounds: (company.rounds || []).map((r, i) => ({
        roundNumber: r.roundNumber || i + 1,
        title: r.title || '',
        duration: r.duration || '45 Mins',
        detail: r.detail || ''
      })),
      focusWeights: { dsa: 0, dbms: 0, oops: 0, os: 0, cn: 0, ...(company.focusWeights || {}) },
      targetTopics: (company.targetTopics || []).map(topic => ({
        subjectSlug: topic.subjectSlug || topic.slug || 'data-structures',
        topicTitle: topic.topicTitle || topic.name || '',
        priority: topic.priority || 'Medium',
      })),
      sprintPlan: (company.sprintPlan || []).map((day, index) => ({
        day: day.day || index + 1,
        title: day.title || day.focus || '',
        focus: day.focus || '',
      })),
    })
  }

  const handleEditHiddenCompany = handleEditCompany

  const handleSaveEditedCompany = async () => {
    const focusWeights = Object.fromEntries(
      TECHNICAL_AREAS.map(([key]) => [key, Number(editingCompanyData.focusWeights?.[key]) || 0])
    )
    const totalWeight = Object.values(focusWeights).reduce((total, weight) => total + weight, 0)
    if (totalWeight !== 100) {
      showToast(`Technical weights must total 100%. Current total: ${totalWeight}%.`, 'error')
      return
    }

    const updateData = {
      ...editingCompanyData,
      tagline: editingCompanyData.tagline?.trim() || '',
      description: editingCompanyData.description?.trim() || '',
      tracks: (editingCompanyData.tracks || []).filter(t => t.name?.trim()),
      rounds: (editingCompanyData.rounds || [])
        .filter(r => r.title?.trim())
        .map((r, i) => ({
          roundNumber: i + 1,
          title: r.title.trim(),
          duration: r.duration?.trim() || '45 Mins',
          detail: r.detail?.trim() || 'Assessment and interview stage.'
        })),
      focusWeights,
      targetTopics: (editingCompanyData.targetTopics || []).filter(topic => topic.subjectSlug && topic.topicTitle?.trim()),
      sprintPlan: (editingCompanyData.sprintPlan || [])
        .filter(day => day.title?.trim() || day.focus?.trim())
        .map((day, index) => ({ ...day, day: Number(day.day) || index + 1 }))
        .sort((a, b) => a.day - b.day),
    }
    const res = await companyService.updateCompany(editingCompanyId, updateData)
    if (res.success) {
      setCompanyList(prev => 
        prev.map(c => c.id === editingCompanyId ? res.company : c)
      )
      setEditingCompanyId(null)
      setEditingCompanyData({})
      showToast('Company details updated successfully!')
    } else {
      showToast(res.error || 'Failed to update company', 'error')
    }
  }

  const handlePermanentlyDeleteCompany = async (companyId) => {
    const company = companyList.find(c => c.id === companyId)
    if (!window.confirm(`Permanently delete ${company?.name}? This cannot be undone.`)) return

    const res = await companyService.deleteCompany(companyId)
    if (res.success) {
      setCompanyList(prev => prev.filter(c => c.id !== companyId))
      showToast(`${company?.name} has been permanently deleted.`)
    } else {
      showToast(res.error || 'Failed to delete company', 'error')
    }
  }

  const handleLogout = () => {
    adminService.logout()
    navigate('/admin')
  }

  const S = styles

  if (!admin || !adminService.isLoggedIn()) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0d1f1b', color: '#a8bfba', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        Redirecting to secure admin login…
      </div>
    )
  }

  return (
    <div style={S.page} className="admin-page-container">
      <div style={S.bgGrid} />

      {/* Toast */}
      {toast && (
        <div style={{
          ...S.toast,
          background: toast.type === 'error' ? 'rgba(232,98,42,0.95)' : 'rgba(19,47,42,0.97)',
          borderColor: toast.type === 'error' ? 'rgba(232,98,42,0.5)' : 'rgba(215,255,117,0.3)',
        }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
            <div style={S.modalTitle}>Delete User?</div>
            <div style={S.modalSub}>
              This will permanently delete <strong style={{ color: '#f4a07a' }}>{deleteConfirm.email}</strong> and all their progress data.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button style={S.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={S.deleteBtn} onClick={() => handleDelete(deleteConfirm.id)}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={S.sidebar} className="admin-sidebar">
        {/* Logo */}
        <div style={S.sidebarLogo}>
          <div style={S.shieldIcon}>🛡️</div>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: 15, letterSpacing: '-0.5px' }}>
              Campus<span style={{ color: '#e8622a' }}>2</span>Career
            </div>
            <div style={{ fontSize: 10, color: '#6b8f87', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 0' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                ...S.navBtn,
                background: activeTab === t.id ? 'rgba(215,255,117,0.1)' : 'transparent',
                color: activeTab === t.id ? '#d7ff75' : '#8aada4',
                borderLeft: activeTab === t.id ? '3px solid #d7ff75' : '3px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Admin info */}
        <div style={S.adminInfo}>
          <div style={S.adminAvatar}>{admin.name?.charAt(0).toUpperCase() || 'A'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {admin.name}
            </div>
            <div style={{ color: '#6b8f87', fontSize: 11 }}>Administrator</div>
          </div>
          <button onClick={handleLogout} style={S.logoutBtn} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={S.main} className="admin-main">
        <div style={S.pageHeader}>
          <h1 style={S.pageTitle}>{TABS.find(t => t.id === activeTab)?.title}</h1>
          <div style={{ fontSize: 12, color: '#6b8f87' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* ── Analytics Tab ─────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div>
            {loadingStats ? (
              <div style={S.loading}>Loading analytics…</div>
            ) : stats ? (
              <>
                {/* Stat Cards */}
                <div style={S.statsGrid}>
                  <StatCard icon="👥" label="Total Users" value={stats.totalUsers} accent="rgba(215,255,117,0.2)" />
                  <StatCard icon="🎓" label="Students" value={stats.totalStudents} />
                  <StatCard icon="🛡️" label="Admins" value={stats.totalAdmins} />
                  <StatCard icon="📈" label="Progress Records" value={stats.totalProgressRecords} sub="Total topic completions saved" />
                  <StatCard icon="🆕" label="New This Week" value={stats.newUsersThisWeek} sub="Last 7 days" accent="rgba(232,98,42,0.2)" />
                </div>

                {/* Recent Users */}
                <div style={S.section}>
                  <div style={S.sectionTitle}>Recently Joined</div>
                  <div style={S.tableWrap}>
                    <table style={S.table}>
                      <thead>
                        <tr>
                          {['Name', 'Email', 'Role', 'Joined'].map(h => (
                            <th key={h} style={S.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentUsers?.map(u => (
                          <tr key={u._id} style={S.tr}>
                            <td style={S.td}>
                              <div style={S.userCell}>
                                <div style={S.miniAvatar}>{u.name?.charAt(0).toUpperCase()}</div>
                                {u.name}
                              </div>
                            </td>
                            <td style={{ ...S.td, color: '#8aada4' }}>{u.email}</td>
                            <td style={S.td}><RoleBadge role={u.role} /></td>
                            <td style={{ ...S.td, color: '#6b8f87', fontSize: 12 }}>
                              {new Date(u.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Subjects */}
                {stats.topSubjects?.length > 0 && (
                  <div style={S.section}>
                    <div style={S.sectionTitle}>Most Active Subjects</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {stats.topSubjects.map((s, i) => (
                        <div key={s._id} style={S.subjectRow}>
                          <div style={{ color: '#d7ff75', fontWeight: 800, width: 20, textAlign: 'right', fontSize: 13 }}>
                            #{i + 1}
                          </div>
                          <div style={{ flex: 1, color: '#fff', fontWeight: 600, fontSize: 14 }}>
                            {s._id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </div>
                          <div style={{ color: '#a8bfba', fontSize: 13 }}>{s.count} learner{s.count !== 1 ? 's' : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={S.empty}>No data yet. Make sure the server is running.</div>
            )}
          </div>
        )}

        {/* ── Users Tab ─────────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Registered Accounts</h3>
                <p style={{ fontSize: 13, color: '#8aada4', margin: '4px 0 0' }}>Manage platform students, mentors, and administrators.</p>
              </div>
              <button
                onClick={() => setShowAddAdmin(v => !v)}
                style={{
                  ...S.applyBtn,
                  background: showAddAdmin ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #d7ff75 0%, #b8ed45 100%)',
                  color: showAddAdmin ? '#d7ff75' : '#10251f',
                  border: showAddAdmin ? '1px solid rgba(215,255,117,0.3)' : 'none',
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {showAddAdmin ? '✕ Cancel' : '👑 + Add New Admin'}
              </button>
            </div>

            {showAddAdmin && (
              <div style={{
                background: 'rgba(215,255,117,0.04)',
                border: '1px solid rgba(215,255,117,0.2)',
                borderRadius: 16,
                padding: '20px 22px',
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#d7ff75', marginBottom: 12 }}>
                  Create Additional Administrator
                </div>
                <p style={{ fontSize: 13, color: '#9bb4af', margin: '0 0 16px' }}>
                  Newly created admins will have full permission to add companies, modify 7-day preparation sprints, and manage student learning data.
                </p>
                <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8aada4', textTransform: 'uppercase' }}>Admin Name</label>
                    <input
                      value={newAdmin.name}
                      onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      placeholder="e.g. Placement Officer"
                      style={S.input}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8aada4', textTransform: 'uppercase' }}>Admin Email</label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="e.g. tpo@college.edu"
                      style={S.input}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#8aada4', textTransform: 'uppercase' }}>Password</label>
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder="Min 6 characters"
                      style={S.input}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingAdmin}
                    style={{
                      ...S.applyBtn,
                      background: 'linear-gradient(135deg, #d7ff75 0%, #b8ed45 100%)',
                      color: '#10251f',
                      padding: '12px 20px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: 10,
                      height: 42,
                    }}
                  >
                    {creatingAdmin ? 'Creating...' : 'Create Admin'}
                  </button>
                </form>
              </div>
            )}
            {loadingUsers ? (
              <div style={S.loading}>Loading users…</div>
            ) : users.length === 0 ? (
              <div style={S.empty}>No users found.</div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={S.tr}>
                        <td style={S.td}>
                          <div style={S.userCell}>
                            <div style={S.miniAvatar}>{u.name?.charAt(0).toUpperCase()}</div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff' }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: '#6b8f87' }}>ID: {u._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...S.td, color: '#8aada4' }}>{u.email}</td>
                        <td style={S.td}><RoleBadge role={u.role} /></td>
                        <td style={{ ...S.td, color: '#6b8f87', fontSize: 12 }}>
                          {new Date(u.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td style={S.td}>
                          {u.role !== 'Admin' && (
                            <button
                              onClick={() => setDeleteConfirm({ id: u._id, email: u.email })}
                              style={S.deleteMiniBtn}
                              title="Delete user"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Roles Tab ─────────────────────────────────────────────────── */}
        {activeTab === 'roles' && (
          <div>
            {loadingUsers ? (
              <div style={S.loading}>Loading users…</div>
            ) : users.length === 0 ? (
              <div style={S.empty}>No users found.</div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      {['User', 'Email', 'Current Role', 'Change Role', 'Apply'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={S.tr}>
                        <td style={S.td}>
                          <div style={S.userCell}>
                            <div style={S.miniAvatar}>{u.name?.charAt(0).toUpperCase()}</div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ ...S.td, color: '#8aada4' }}>{u.email}</td>
                        <td style={S.td}><RoleBadge role={u.role} /></td>
                        <td style={S.td}>
                          <select
                            value={roleEdit[u._id] || u.role}
                            onChange={e => setRoleEdit(r => ({ ...r, [u._id]: e.target.value }))}
                            style={S.select}
                          >
                            {['Student', 'Admin'].map(r => (
                              <option key={r} value={r} style={{ background: '#132f2a', color: '#fff' }}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td style={S.td}>
                          <button
                            onClick={() => handleRoleUpdate(u._id)}
                            disabled={roleEdit[u._id] === u.role}
                            style={{
                              ...S.applyBtn,
                              opacity: roleEdit[u._id] === u.role ? 0.4 : 1,
                              cursor: roleEdit[u._id] === u.role ? 'default' : 'pointer',
                            }}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Companies Tab ─────────────────────────────────────────────── */}
        {activeTab === 'companies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}>
              <div style={S.formGroup}>
                <label style={S.label}>Company Name</label>
                <input
                  value={newCompany.name}
                  onChange={e => setNewCompany(v => ({ ...v, name: e.target.value }))}
                  placeholder="Google"
                  style={S.input}
                />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Full Name</label>
                <input
                  value={newCompany.fullName}
                  onChange={e => setNewCompany(v => ({ ...v, fullName: e.target.value }))}
                  placeholder="Google LLC"
                  style={S.input}
                />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Logo Emoji</label>
                <input
                  value={newCompany.logoEmoji}
                  onChange={e => setNewCompany(v => ({ ...v, logoEmoji: e.target.value }))}
                  placeholder="🏢"
                  style={S.input}
                />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>CTC Range</label>
                <input
                  value={newCompany.ctcRange}
                  onChange={e => setNewCompany(v => ({ ...v, ctcRange: e.target.value }))}
                  placeholder="₹4.0 LPA – ₹8.0 LPA"
                  style={S.input}
                />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Badge</label>
                <input
                  value={newCompany.badge}
                  onChange={e => setNewCompany(v => ({ ...v, badge: e.target.value }))}
                  placeholder="Top Recruiter"
                  style={S.input}
                />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Tier</label>
                <input
                  value={newCompany.tier}
                  onChange={e => setNewCompany(v => ({ ...v, tier: e.target.value }))}
                  placeholder="Tier 1"
                  style={S.input}
                />
              </div>
              <div style={{ ...S.formGroup, gridColumn: '1 / -1' }}>
                <label style={S.label}>Tagline</label>
                <input
                  value={newCompany.tagline}
                  onChange={e => setNewCompany(v => ({ ...v, tagline: e.target.value }))}
                  placeholder="Build products that impact millions"
                  style={S.input}
                />
              </div>
              <div style={{ ...S.formGroup, gridColumn: '1 / -1' }}>
                <label style={S.label}>Description</label>
                <textarea
                  value={newCompany.description}
                  onChange={e => setNewCompany(v => ({ ...v, description: e.target.value }))}
                  placeholder="Short company overview for students"
                  style={{ ...S.input, minHeight: 88, resize: 'vertical' }}
                />
              </div>

              {/* Multi-Tier Hiring Tracks & CTC Packages */}
              <div style={{ ...S.formGroup, gridColumn: '1 / -1', background: 'rgba(215,255,117,0.03)', border: '1px solid rgba(215,255,117,0.15)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <label style={{ ...S.label, color: '#d7ff75', fontSize: 13 }}>🏢 Multi-Tier Hiring Tracks & CTC Ranges</label>
                    <div style={{ fontSize: 11, color: '#8aada4', marginTop: 2 }}>
                      Add multiple job roles & packages (e.g. Ninja: ₹3.6 LPA, Digital: ₹7.5 LPA, Prime: ₹11.5 LPA)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewCompany(v => ({
                      ...v,
                      tracks: [...(v.tracks || []), { name: '', ctc: '', difficulty: 'Hard' }]
                    }))}
                    style={{
                      ...S.applyBtn,
                      background: 'rgba(215,255,117,0.15)',
                      color: '#d7ff75',
                      border: '1px solid rgba(215,255,117,0.3)',
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 8,
                    }}
                  >
                    + Add Another CTC Track
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(newCompany.tracks || []).map((track, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 130px auto', gap: 8, alignItems: 'center' }}>
                      <input
                        value={track.name}
                        placeholder="Track Name (e.g. Ninja, Digital, Prime, SDE-1)"
                        onChange={e => setNewCompany(v => ({
                          ...v,
                          tracks: v.tracks.map((t, i) => i === index ? { ...t, name: e.target.value } : t)
                        }))}
                        style={S.input}
                      />
                      <input
                        value={track.ctc}
                        placeholder="CTC Package (e.g. ₹3.6 - ₹4.0 LPA)"
                        onChange={e => setNewCompany(v => ({
                          ...v,
                          tracks: v.tracks.map((t, i) => i === index ? { ...t, ctc: e.target.value } : t)
                        }))}
                        style={S.input}
                      />
                      <select
                        value={track.difficulty}
                        onChange={e => setNewCompany(v => ({
                          ...v,
                          tracks: v.tracks.map((t, i) => i === index ? { ...t, difficulty: e.target.value } : t)
                        }))}
                        style={S.select}
                      >
                        {['Easy', 'Moderate', 'Hard', 'Very Hard', 'Extreme'].map(diff => (
                          <option key={diff} value={diff} style={{ background: '#132f2a', color: '#fff' }}>{diff}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setNewCompany(v => ({
                          ...v,
                          tracks: v.tracks.filter((_, i) => i !== index)
                        }))}
                        style={S.deleteMiniBtn}
                        title="Remove Track"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campus Recruitment Process & Selection Rounds */}
              <div style={{ ...S.formGroup, gridColumn: '1 / -1', background: 'rgba(215,255,117,0.03)', border: '1px solid rgba(215,255,117,0.15)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <label style={{ ...S.label, color: '#d7ff75', fontSize: 13 }}>🏢 Campus Recruitment Process & Selection Rounds</label>
                    <div style={{ fontSize: 11, color: '#8aada4', marginTop: 2 }}>
                      Customize assessment stages, duration, and test descriptions (e.g. R1: NQT 75 Mins, R2: Coding 90 Mins, R3: Tech Interview)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewCompany(v => ({
                      ...v,
                      rounds: [...(v.rounds || []), { roundNumber: (v.rounds?.length || 0) + 1, title: '', duration: '45 Mins', detail: '' }]
                    }))}
                    style={{
                      ...S.applyBtn,
                      background: 'rgba(215,255,117,0.15)',
                      color: '#d7ff75',
                      border: '1px solid rgba(215,255,117,0.3)',
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 800,
                      borderRadius: 8,
                    }}
                  >
                    + Add Selection Round
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(newCompany.rounds || []).map((round, index) => (
                    <div key={index} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr auto', gap: 8, alignItems: 'center' }}>
                        <div style={{
                          background: '#1d4ed8',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: 12,
                          height: 38,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          R{index + 1}
                        </div>
                        <input
                          value={round.title}
                          placeholder="Round Title (e.g. Technical + Managerial Interview)"
                          onChange={e => setNewCompany(v => ({
                            ...v,
                            rounds: v.rounds.map((r, i) => i === index ? { ...r, title: e.target.value } : r)
                          }))}
                          style={S.input}
                        />
                        <input
                          value={round.duration}
                          placeholder="Duration (e.g. 45 Mins)"
                          onChange={e => setNewCompany(v => ({
                            ...v,
                            rounds: v.rounds.map((r, i) => i === index ? { ...r, duration: e.target.value } : r)
                          }))}
                          style={S.input}
                        />
                        <button
                          type="button"
                          onClick={() => setNewCompany(v => ({
                            ...v,
                            rounds: v.rounds.filter((_, i) => i !== index)
                          }))}
                          style={S.deleteMiniBtn}
                          title="Remove Round"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={round.detail}
                        placeholder="Round Description & Topics Tested (e.g. In-depth questions on Project, SQL Joins & Normalization, OOPS 4 pillars...)"
                        onChange={e => setNewCompany(v => ({
                          ...v,
                          rounds: v.rounds.map((r, i) => i === index ? { ...r, detail: e.target.value } : r)
                        }))}
                        style={{ ...S.input, minHeight: 46, resize: 'vertical', fontSize: 13 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Technical Weightage & Readiness</label>
                <CustomSelect
                  options={FOCUS_WEIGHT_TEMPLATES.map(t => t.label)}
                  value={newCompany.focusWeightsTemplate}
                  onChange={(val) => setNewCompany(v => ({ ...v, focusWeightsTemplate: val }))}
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Skill Gap Breakdown</label>
                <CustomSelect
                  options={SKILL_GAP_TEMPLATES.map(t => t.label)}
                  value={newCompany.skillGapTemplate}
                  onChange={(val) => setNewCompany(v => ({ ...v, skillGapTemplate: val }))}
                />
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>7-Day Preparation Sprint</label>
                <CustomSelect
                  options={SPRINT_TEMPLATES.map(t => t.label)}
                  value={newCompany.sprintTemplate}
                  onChange={(val) => setNewCompany(v => ({ ...v, sprintTemplate: val }))}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleAddCompany} style={S.applyBtn}>
                  + Add Company to Website
                </button>
              </div>
            </div>

            {companyList.filter(c => !c.isHidden).map(c => (
              <div key={c.id} style={{
                ...S.companyCard,
                opacity: c.isHidden ? 0.6 : 1,
                border: editingCompanyId === c.id ? '1px solid #d7ff75' : c.isHidden ? '1px solid rgba(232,98,42,0.3)' : undefined,
                background: editingCompanyId === c.id ? 'rgba(215,255,117,0.03)' : c.isHidden ? 'rgba(232,98,42,0.05)' : undefined,
              }}>
                {editingCompanyId === c.id ? (
                  // Full Edit Mode for Active Company
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10 }}>
                      <div style={{ fontWeight: 800, color: '#d7ff75', fontSize: 16 }}>
                        ✏️ Editing {c.name} Profile
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setEditingCompanyId(null); setEditingCompanyData({}) }}
                          style={{ ...S.deleteMiniBtn, background: 'rgba(255,255,255,0.08)', color: '#a8bfba' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEditedCompany}
                          style={{ ...S.applyBtn, background: 'linear-gradient(135deg, #d7ff75 0%, #b8ed45 100%)', color: '#10251f', fontWeight: 800, padding: '8px 16px' }}
                        >
                          💾 Save Changes
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Company Short Name</label>
                        <input
                          value={editingCompanyData.name}
                          onChange={e => setEditingCompanyData(v => ({ ...v, name: e.target.value }))}
                          style={S.input}
                        />
                      </div>
                      <div>
                        <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Full Official Name</label>
                        <input
                          value={editingCompanyData.fullName}
                          onChange={e => setEditingCompanyData(v => ({ ...v, fullName: e.target.value }))}
                          style={S.input}
                        />
                      </div>
                      <div>
                        <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Badge</label>
                        <input
                          value={editingCompanyData.badge}
                          onChange={e => setEditingCompanyData(v => ({ ...v, badge: e.target.value }))}
                          style={S.input}
                        />
                      </div>
                      <div>
                        <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>CTC Range</label>
                        <input
                          value={editingCompanyData.ctcRange}
                          onChange={e => setEditingCompanyData(v => ({ ...v, ctcRange: e.target.value }))}
                          style={S.input}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Tagline / Subtitle (Shown under Company Title)</label>
                      <input
                        value={editingCompanyData.tagline}
                        placeholder="e.g. Global pioneer in enterprise software & systems"
                        onChange={e => setEditingCompanyData(v => ({ ...v, tagline: e.target.value }))}
                        style={S.input}
                      />
                    </div>

                    <div>
                      <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Company Description & Hiring Focus (Detailed Overview)</label>
                      <textarea
                        value={editingCompanyData.description}
                        placeholder="Describe the company assessment format, focus areas, and hiring criteria..."
                        onChange={e => setEditingCompanyData(v => ({ ...v, description: e.target.value }))}
                        style={{ ...S.input, minHeight: 90, resize: 'vertical' }}
                      />
                    </div>

                    {/* Hiring Tracks */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={S.label}>Hiring Tracks & CTC Tiers</label>
                        <button
                          onClick={() => setEditingCompanyData(v => ({
                            ...v,
                            tracks: [...(v.tracks || []), { name: '', ctc: '', difficulty: 'Moderate', focus: '' }]
                          }))}
                          style={S.applyBtn}
                        >
                          + Add Track
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(editingCompanyData.tracks || []).map((track, index) => (
                          <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 110px auto', gap: 8 }}>
                            <input
                              value={track.name}
                              placeholder="Track Name (e.g. Core Systems)"
                              onChange={e => setEditingCompanyData(v => ({
                                ...v,
                                tracks: v.tracks.map((item, i) => i === index ? { ...item, name: e.target.value } : item)
                              }))}
                              style={S.input}
                            />
                            <input
                              value={track.ctc}
                              placeholder="CTC (e.g. ₹6.5 - ₹8.5 LPA)"
                              onChange={e => setEditingCompanyData(v => ({
                                ...v,
                                tracks: v.tracks.map((item, i) => i === index ? { ...item, ctc: e.target.value } : item)
                              }))}
                              style={S.input}
                            />
                            <select
                              value={track.difficulty}
                              onChange={e => setEditingCompanyData(v => ({
                                ...v,
                                tracks: v.tracks.map((item, i) => i === index ? { ...item, difficulty: e.target.value } : item)
                              }))}
                              style={S.select}
                            >
                              {['Easy', 'Moderate', 'Hard', 'Very Hard', 'Extreme'].map(d => (
                                <option key={d} value={d} style={{ background: '#132f2a', color: '#fff' }}>{d}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingCompanyData(v => ({
                                ...v,
                                tracks: v.tracks.filter((_, i) => i !== index)
                              }))}
                              style={S.deleteMiniBtn}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selection Rounds Editor */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={S.label}>Campus Recruitment Process & Selection Rounds</label>
                        <button
                          type="button"
                          onClick={() => setEditingCompanyData(v => ({
                            ...v,
                            rounds: [...(v.rounds || []), { roundNumber: (v.rounds?.length || 0) + 1, title: '', duration: '45 Mins', detail: '' }]
                          }))}
                          style={S.applyBtn}
                        >
                          + Add Round
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {(editingCompanyData.rounds || []).map((round, index) => (
                          <div key={index} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10,
                            padding: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr auto', gap: 8, alignItems: 'center' }}>
                              <div style={{
                                background: '#1d4ed8',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: 12,
                                height: 38,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                R{index + 1}
                              </div>
                              <input
                                value={round.title}
                                placeholder="Round Title (e.g. Technical Interview)"
                                onChange={e => setEditingCompanyData(v => ({
                                  ...v,
                                  rounds: v.rounds.map((r, i) => i === index ? { ...r, title: e.target.value } : r)
                                }))}
                                style={S.input}
                              />
                              <input
                                value={round.duration}
                                placeholder="Duration (e.g. 45 Mins)"
                                onChange={e => setEditingCompanyData(v => ({
                                  ...v,
                                  rounds: v.rounds.map((r, i) => i === index ? { ...r, duration: e.target.value } : r)
                                }))}
                                style={S.input}
                              />
                              <button
                                type="button"
                                onClick={() => setEditingCompanyData(v => ({
                                  ...v,
                                  rounds: v.rounds.filter((_, i) => i !== index)
                                }))}
                                style={S.deleteMiniBtn}
                                title="Remove Round"
                              >
                                ✕
                              </button>
                            </div>
                            <textarea
                              value={round.detail}
                              placeholder="Round Description & Topics Tested (e.g. In-depth questions on Project, SQL Joins & Normalization, OOPS 4 pillars...)"
                              onChange={e => setEditingCompanyData(v => ({
                                ...v,
                                rounds: v.rounds.map((r, i) => i === index ? { ...r, detail: e.target.value } : r)
                              }))}
                              style={{ ...S.input, minHeight: 46, resize: 'vertical', fontSize: 13 }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ ...S.label, display: 'block', marginBottom: 8 }}>Technical Weightage (must total 100%)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(90px, 1fr))', gap: 8 }}>
                        {TECHNICAL_AREAS.map(([key, label]) => (
                          <label key={key} style={{ color: '#a8bfba', fontSize: 12 }}>
                            {label}
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editingCompanyData.focusWeights?.[key] ?? 0}
                              onChange={e => setEditingCompanyData(v => ({
                                ...v,
                                focusWeights: { ...v.focusWeights, [key]: e.target.value },
                              }))}
                              style={{ ...S.input, width: '100%', boxSizing: 'border-box', marginTop: 5 }}
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={S.label}>Skill Gap Topics</label>
                        <button
                          onClick={() => setEditingCompanyData(v => ({
                            ...v,
                            targetTopics: [...(v.targetTopics || []), { subjectSlug: 'data-structures', topicTitle: '', priority: 'Medium' }],
                          }))}
                          style={S.applyBtn}
                        >
                          + Add Topic
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(editingCompanyData.targetTopics || []).map((topic, index) => (
                          <div key={index} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 105px auto', gap: 8 }}>
                            <select
                              value={topic.subjectSlug}
                              onChange={e => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.map((item, i) => i === index ? { ...item, subjectSlug: e.target.value } : item) }))}
                              style={S.select}
                            >
                              {SKILL_SUBJECTS.map(subject => <option key={subject.slug} value={subject.slug} style={{ background: '#132f2a', color: '#fff' }}>{subject.label}</option>)}
                            </select>
                            <input
                              value={topic.topicTitle}
                              placeholder="Topic name"
                              onChange={e => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.map((item, i) => i === index ? { ...item, topicTitle: e.target.value } : item) }))}
                              style={S.input}
                            />
                            <select
                              value={topic.priority}
                              onChange={e => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.map((item, i) => i === index ? { ...item, priority: e.target.value } : item) }))}
                              style={S.select}
                            >
                              {['Critical', 'High', 'Medium'].map(priority => <option key={priority} style={{ background: '#132f2a', color: '#fff' }}>{priority}</option>)}
                            </select>
                            <button onClick={() => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.filter((_, i) => i !== index) }))} style={S.deleteMiniBtn}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={S.label}>7-Day Preparation Sprint</label>
                        <button
                          onClick={() => setEditingCompanyData(v => ({
                            ...v,
                            sprintPlan: [...(v.sprintPlan || []), { day: (v.sprintPlan?.length || 0) + 1, title: '', focus: '' }],
                          }))}
                          style={S.applyBtn}
                        >
                          + Add Day
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(editingCompanyData.sprintPlan || []).map((day, index) => (
                          <div key={index} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr auto', gap: 8 }}>
                            <input type="number" min="1" max="7" value={day.day} onChange={e => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.map((item, i) => i === index ? { ...item, day: e.target.value } : item) }))} style={S.input} />
                            <input value={day.title} placeholder="Day title" onChange={e => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.map((item, i) => i === index ? { ...item, title: e.target.value } : item) }))} style={S.input} />
                            <input value={day.focus} placeholder="Focus / activity" onChange={e => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.map((item, i) => i === index ? { ...item, focus: e.target.value } : item) }))} style={S.input} />
                            <button onClick={() => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.filter((_, i) => i !== index) }))} style={S.deleteMiniBtn}>Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        onClick={() => { setEditingCompanyId(null); setEditingCompanyData({}) }}
                        style={{ ...S.deleteMiniBtn, background: 'rgba(255,255,255,0.08)', color: '#a8bfba' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEditedCompany}
                        style={{ ...S.applyBtn, background: 'linear-gradient(135deg, #d7ff75 0%, #b8ed45 100%)', color: '#10251f', fontWeight: 800, padding: '10px 20px' }}
                      >
                        💾 Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal View Card
                  <>
                    <div style={{
                      ...S.companyHeader,
                      position: 'relative',
                    }}>
                      {c.isHidden && (
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(232,98,42,0.9)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          zIndex: 1,
                        }}>
                          Hidden from Students
                        </div>
                      )}
                      <div style={{
                        width: 48, height: 48, borderRadius: 12, fontSize: 22,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: c.bgSoft || 'rgba(255,255,255,0.08)', border: `2px solid ${(c.brandColor || '#d7ff75')}22`,
                      }}>
                        {c.logoEmoji || '🏢'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>{c.fullName || c.name}</div>
                        <div style={{ fontSize: 12, color: '#8aada4', marginTop: 2 }}>{c.tagline}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleEditCompany(c)}
                          style={{
                            ...S.applyBtn,
                            padding: '7px 12px',
                            background: 'rgba(215,255,117,0.15)',
                            color: '#d7ff75',
                            border: '1px solid rgba(215,255,117,0.3)',
                          }}
                        >
                          ✏️ Edit
                        </button>
                        {c.isHidden ? (
                          <button
                            onClick={() => handleRestoreCompany(c.id)}
                            style={{
                              ...S.deleteMiniBtn,
                              padding: '7px 12px',
                              background: 'rgba(132,204,22,0.15)',
                              color: '#84cc16',
                              border: '1px solid rgba(132,204,22,0.3)',
                            }}
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveCompany(c.id)}
                            style={{
                              ...S.deleteMiniBtn,
                              padding: '7px 12px',
                            }}
                          >
                            Hide
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                      {(c.tracks || []).slice(0, 3).map(track => (
                        <div key={track.name || track.title || track.ctc} style={S.trackChip}>
                          {track.name || track.title} • {track.ctc || 'Open role'}
                        </div>
                      )) || <div style={S.trackChip}>No tracks added yet</div>}
                    </div>
                    <div style={{
                      marginTop: 14,
                      fontSize: 12,
                      color: '#a8bfba',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>{c.badge || 'Company profile'}</span>
                      <span style={{
                        ...S.ctcBadge,
                        background: `${(c.brandColor || '#d7ff75')}18`, borderColor: `${(c.brandColor || '#d7ff75')}30`, color: c.brandColor || '#d7ff75',
                      }}>
                        {c.ctcRange || 'Not specified'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── History Tab (Hidden Companies) ────────────────────────────── */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ color: '#a8bfba', fontSize: 13 }}>
              📦 View, edit, and restore hidden companies from this archive.
            </div>

            {companyList.filter(c => c.isHidden).length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b8f87',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div>No hidden companies in archive.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {companyList.filter(c => c.isHidden).map(c => (
                  <div key={c.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: '20px 22px',
                  }}>
                    {editingCompanyId === c.id ? (
                      // Edit mode
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Company Name</label>
                            <input
                              value={editingCompanyData.name}
                              onChange={e => setEditingCompanyData(v => ({ ...v, name: e.target.value }))}
                              style={S.input}
                            />
                          </div>
                          <div>
                            <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Full Name</label>
                            <input
                              value={editingCompanyData.fullName}
                              onChange={e => setEditingCompanyData(v => ({ ...v, fullName: e.target.value }))}
                              style={S.input}
                            />
                          </div>
                          <div>
                            <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Badge</label>
                            <input
                              value={editingCompanyData.badge}
                              onChange={e => setEditingCompanyData(v => ({ ...v, badge: e.target.value }))}
                              style={S.input}
                            />
                          </div>
                          <div>
                            <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>CTC Range</label>
                            <input
                              value={editingCompanyData.ctcRange}
                              onChange={e => setEditingCompanyData(v => ({ ...v, ctcRange: e.target.value }))}
                              style={S.input}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Tagline</label>
                          <input
                            value={editingCompanyData.tagline}
                            onChange={e => setEditingCompanyData(v => ({ ...v, tagline: e.target.value }))}
                            style={S.input}
                          />
                        </div>
                        <div>
                          <label style={{ ...S.label, display: 'block', marginBottom: 6 }}>Description</label>
                          <textarea
                            value={editingCompanyData.description}
                            onChange={e => setEditingCompanyData(v => ({ ...v, description: e.target.value }))}
                            style={{ ...S.input, minHeight: 80, resize: 'vertical' }}
                          />
                        </div>
                        <div>
                          <label style={{ ...S.label, display: 'block', marginBottom: 8 }}>Technical Weightage (must total 100%)</label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(90px, 1fr))', gap: 8 }}>
                            {TECHNICAL_AREAS.map(([key, label]) => (
                              <label key={key} style={{ color: '#a8bfba', fontSize: 12 }}>
                                {label}
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={editingCompanyData.focusWeights?.[key] ?? 0}
                                  onChange={e => setEditingCompanyData(v => ({
                                    ...v,
                                    focusWeights: { ...v.focusWeights, [key]: e.target.value },
                                  }))}
                                  style={{ ...S.input, width: '100%', boxSizing: 'border-box', marginTop: 5 }}
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label style={S.label}>Skill Gap Topics</label>
                            <button
                              onClick={() => setEditingCompanyData(v => ({
                                ...v,
                                targetTopics: [...(v.targetTopics || []), { subjectSlug: 'data-structures', topicTitle: '', priority: 'Medium' }],
                              }))}
                              style={S.applyBtn}
                            >
                              + Add Topic
                            </button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(editingCompanyData.targetTopics || []).map((topic, index) => (
                              <div key={index} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 105px auto', gap: 8 }}>
                                <select
                                  value={topic.subjectSlug}
                                  onChange={e => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.map((item, i) => i === index ? { ...item, subjectSlug: e.target.value } : item) }))}
                                  style={S.select}
                                >
                                  {SKILL_SUBJECTS.map(subject => <option key={subject.slug} value={subject.slug} style={{ background: '#132f2a', color: '#fff' }}>{subject.label}</option>)}
                                </select>
                                <input
                                  value={topic.topicTitle}
                                  placeholder="Topic name"
                                  onChange={e => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.map((item, i) => i === index ? { ...item, topicTitle: e.target.value } : item) }))}
                                  style={S.input}
                                />
                                <select
                                  value={topic.priority}
                                  onChange={e => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.map((item, i) => i === index ? { ...item, priority: e.target.value } : item) }))}
                                  style={S.select}
                                >
                                  {['Critical', 'High', 'Medium'].map(priority => <option key={priority} style={{ background: '#132f2a', color: '#fff' }}>{priority}</option>)}
                                </select>
                                <button onClick={() => setEditingCompanyData(v => ({ ...v, targetTopics: v.targetTopics.filter((_, i) => i !== index) }))} style={S.deleteMiniBtn}>Remove</button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label style={S.label}>7-Day Preparation Sprint</label>
                            <button
                              onClick={() => setEditingCompanyData(v => ({
                                ...v,
                                sprintPlan: [...(v.sprintPlan || []), { day: (v.sprintPlan?.length || 0) + 1, title: '', focus: '' }],
                              }))}
                              style={S.applyBtn}
                            >
                              + Add Day
                            </button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(editingCompanyData.sprintPlan || []).map((day, index) => (
                              <div key={index} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr auto', gap: 8 }}>
                                <input type="number" min="1" max="7" value={day.day} onChange={e => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.map((item, i) => i === index ? { ...item, day: e.target.value } : item) }))} style={S.input} />
                                <input value={day.title} placeholder="Day title" onChange={e => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.map((item, i) => i === index ? { ...item, title: e.target.value } : item) }))} style={S.input} />
                                <input value={day.focus} placeholder="Focus / activity" onChange={e => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.map((item, i) => i === index ? { ...item, focus: e.target.value } : item) }))} style={S.input} />
                                <button onClick={() => setEditingCompanyData(v => ({ ...v, sprintPlan: v.sprintPlan.filter((_, i) => i !== index) }))} style={S.deleteMiniBtn}>Remove</button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setEditingCompanyId(null)
                              setEditingCompanyData({})
                            }}
                            style={{
                              padding: '10px 16px',
                              background: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#a8bfba',
                              borderRadius: 8,
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: 12,
                              fontFamily: 'inherit',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEditedCompany}
                            style={{
                              padding: '10px 16px',
                              background: 'rgba(132,204,22,0.2)',
                              border: '1px solid rgba(132,204,22,0.3)',
                              color: '#84cc16',
                              borderRadius: 8,
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: 12,
                              fontFamily: 'inherit',
                            }}
                          >
                            💾 Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 16,
                          marginBottom: 16,
                        }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: 12, fontSize: 22,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: c.bgSoft || 'rgba(255,255,255,0.08)', border: `2px solid ${(c.brandColor || '#d7ff75')}22`,
                          }}>
                            {c.logoEmoji || '🏢'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>{c.fullName || c.name}</div>
                            <div style={{ fontSize: 12, color: '#8aada4', marginTop: 2 }}>{c.tagline}</div>
                            {c.hiddenAt && (
                              <div style={{ fontSize: 11, color: '#f4a07a', marginTop: 5 }}>
                                Hidden on {new Date(c.hiddenAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleEditHiddenCompany(c)}
                              style={{
                                padding: '7px 12px',
                                background: 'rgba(59,130,246,0.15)',
                                color: '#3b82f6',
                                border: '1px solid rgba(59,130,246,0.3)',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 12,
                                fontFamily: 'inherit',
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleRestoreCompany(c.id)}
                              style={{
                                padding: '7px 12px',
                                background: 'rgba(132,204,22,0.15)',
                                color: '#84cc16',
                                border: '1px solid rgba(132,204,22,0.3)',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 12,
                                fontFamily: 'inherit',
                              }}
                            >
                              ↺ Restore
                            </button>
                            <button
                              onClick={() => handlePermanentlyDeleteCompany(c.id)}
                              style={{
                                padding: '7px 12px',
                                background: 'rgba(232,98,42,0.15)',
                                color: '#f4a07a',
                                border: '1px solid rgba(232,98,42,0.3)',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 12,
                                fontFamily: 'inherit',
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        <div style={{
                          fontSize: 13,
                          color: '#a8bfba',
                          background: 'rgba(232,98,42,0.08)',
                          padding: '8px 12px',
                          borderRadius: 6,
                          borderLeft: '3px solid rgba(232,98,42,0.3)',
                        }}>
                          {c.description || 'No description'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 860px) {
          .admin-page-container {
            flex-direction: column !important;
          }
          .admin-sidebar {
            position: relative !important;
            width: 100% !important;
            min-width: 100% !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            padding: 16px !important;
          }
          .admin-main {
            width: 100% !important;
            margin-left: 0 !important;
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#0d1f1b',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  bgGrid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(215,255,117,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(215,255,117,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
    zIndex: 0,
  },
  toast: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 9999,
    padding: '12px 18px',
    borderRadius: 12,
    border: '1px solid',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    animation: 'slideIn 0.25s ease',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backdropFilter: 'blur(6px)',
  },
  modal: {
    background: '#132f2a',
    border: '1px solid rgba(232,98,42,0.3)',
    borderRadius: 20,
    padding: '32px 28px',
    maxWidth: 380,
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  modalTitle: { color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: 8 },
  modalSub: { color: '#8aada4', fontSize: 14, lineHeight: 1.6 },
  cancelBtn: {
    flex: 1, padding: '11px', borderRadius: 10,
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#8aada4', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
  },
  deleteBtn: {
    flex: 1, padding: '11px', borderRadius: 10,
    background: 'rgba(232,98,42,0.2)', border: '1px solid rgba(232,98,42,0.4)',
    color: '#f4a07a', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
  },
  sidebar: {
    width: 220,
    minWidth: 220,
    background: 'rgba(0,0,0,0.3)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 12px',
    zIndex: 1,
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 8px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  shieldIcon: { fontSize: 28 },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'left',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
    width: '100%',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 8px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: 'auto',
  },
  adminAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'rgba(215,255,117,0.15)',
    border: '1px solid rgba(215,255,117,0.3)',
    color: '#d7ff75', fontWeight: 800, fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoutBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#6b8f87', padding: '6px', borderRadius: 8,
    display: 'flex', alignItems: 'center',
    transition: 'color 0.15s',
    flexShrink: 0,
  },
  main: {
    width: 'calc(100% - 220px)',
    marginLeft: 220,
    padding: '32px 36px',
    zIndex: 1,
    minWidth: 0,
    boxSizing: 'border-box',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  loading: {
    color: '#6b8f87',
    fontSize: 14,
    padding: '40px 0',
    textAlign: 'center',
  },
  empty: {
    color: '#6b8f87',
    fontSize: 14,
    padding: '60px 0',
    textAlign: 'center',
    border: '1px dashed rgba(255,255,255,0.08)',
    borderRadius: 16,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontWeight: 800,
    color: '#a8bfba',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 14,
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.02)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#6b8f87',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '13px 16px',
    color: '#fff',
    fontSize: 13,
    verticalAlign: 'middle',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  miniAvatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    color: '#a8bfba', fontWeight: 800, fontSize: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  deleteMiniBtn: {
    padding: '5px 12px', borderRadius: 8,
    background: 'rgba(232,98,42,0.1)', border: '1px solid rgba(232,98,42,0.25)',
    color: '#f4a07a', fontWeight: 700, fontSize: 12,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.15s',
  },
  applyBtn: {
    padding: '7px 16px', borderRadius: 8,
    background: 'rgba(215,255,117,0.12)', border: '1px solid rgba(215,255,117,0.25)',
    color: '#d7ff75', fontWeight: 700, fontSize: 12,
    fontFamily: 'inherit', transition: 'all 0.15s',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#b3cbc5',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '10px 12px',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
  },
  select: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '10px 12px',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a8bfba' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '20px',
    paddingRight: 32,
    accentColor: '#d7ff75',
  },
  subjectRow: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '12px 16px',
  },
  companyCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 22px',
  },
  companyHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  ctcBadge: {
    padding: '4px 12px', borderRadius: 20,
    border: '1px solid',
    fontSize: 12, fontWeight: 700,
    background: 'rgba(255,255,255,0.04)',
  },
  trackChip: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8, padding: '6px 12px', fontSize: 12,
    color: '#8aada4',
  },
}

export default AdminDashboard

