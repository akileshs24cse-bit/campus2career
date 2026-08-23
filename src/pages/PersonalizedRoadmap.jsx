import React, { useState } from 'react'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Link } from '../components/Link'
import { AIChatBuddy } from '../components/AIChatBuddy'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config/api'

const AVAILABLE_COURSES = [
  { code: 'CSE', label: 'Computer Science & Engineering' },
  { code: 'IT', label: 'Information Technology' },
  { code: 'ECE', label: 'Electronics & Communication' },
  { code: 'EEE', label: 'Electrical & Electronics' },
  { code: 'ME', label: 'Mechanical Engineering' },
  { code: 'CE', label: 'Civil Engineering' },
]

export function PersonalizedRoadmap() {
  const { currentUser } = useAuth()
  const initialCourse = currentUser?.course || 'CSE'
  const [selectedCourse, setSelectedCourse] = useState(initialCourse)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF resume file.')
        return
      }
      setFile(selected)
      setError('')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0]
      if (dropped.type !== 'application/pdf' && !dropped.name.toLowerCase().endsWith('.pdf')) {
        setError('Please drop a valid PDF resume file.')
        return
      }
      setFile(dropped)
      setError('')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select or upload a PDF resume file.')
      return
    }

    setLoading(true)
    setError('')
    setRoadmap(null)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('course', selectedCourse)

    try {
      const targetEndpoint = `${API_BASE_URL.replace(/\/$/, '')}/resume/analyze`
      const response = await fetch(targetEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server responded with status ${response.status}`)
      }

      const data = await response.json()
      setRoadmap(data)
    } catch (err) {
      console.error('Resume Analysis Error:', err)
      setError(err.message || 'Unable to connect to the analysis engine. Please verify the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const currentCourseObj = AVAILABLE_COURSES.find(c => c.code === selectedCourse) || AVAILABLE_COURSES[0]

  return (
    <div className="bg-cream min-h-screen flex flex-col font-sans text-ink">
      <Nav />

      <main className="flex-1">
        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0a2520 0%, #132f2a 55%, #1f5249 100%)',
            padding: '50px 0 60px',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff',
          }}
        >
          {/* Decorative background glow */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 380,
              height: 380,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(215, 255, 117, 0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: '10%',
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232, 98, 42, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                color: '#d7ff75',
                marginBottom: 18,
                backdropFilter: 'blur(6px)',
              }}
            >
              <span>✨ AI Resume Intelligence</span>
              <span style={{ background: '#e8622a', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                2026 Core Mapping
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 4.5vw, 54px)',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                letterSpacing: '-1.5px',
                marginBottom: 14,
                lineHeight: 1.12,
              }}
            >
              Personalized <span style={{ color: '#d7ff75' }}>Roadmap & Skill Gap</span>
            </h1>

            <p
              style={{
                maxWidth: 760,
                fontSize: 'clamp(15px, 2vw, 17px)',
                color: '#d3e2dc',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Upload your resume and our Gemini AI engine will parse your skills, match them against core industry
              benchmarks for <strong>{currentCourseObj.label} ({currentCourseObj.code})</strong>, and generate your customized
              revision and preparation plan.
            </p>

            {/* Quick stats / Highlights ribbon */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 20,
                marginTop: 28,
                paddingTop: 20,
                borderTop: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  📄
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#a0c4b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, fontFamily: 'monospace' }}>
                    ATS Parser
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>PDF Resume Extraction</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(215,255,117,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: '#d7ff75',
                  }}
                >
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#a0c4b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, fontFamily: 'monospace' }}>
                    Instant Gap Engine
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#d7ff75' }}>Strengths vs. Missing Skills</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(232,98,42,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: '#ff9870',
                  }}
                >
                  🎯
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#a0c4b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, fontFamily: 'monospace' }}>
                    Action Blueprint
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Step-by-Step Study Guide</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Interactive Section ─────────────────────────────────── */}
        <section className="py-10 md:py-14">
          <div className="max-w-[1100px] mx-auto px-5 md:px-7 space-y-10">
            
            {/* Upload Card */}
            <div className="bg-white border border-[#dce2d5] rounded-2xl p-6 md:p-9 shadow-card-hover transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-5 border-b border-[#eef2eb]">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-coral-alt font-bold mb-1">
                    Step 1 · Resume & Branch
                  </div>
                  <h2 className="font-serif font-bold text-2xl md:text-3xl text-ink">
                    Upload Your Resume
                  </h2>
                </div>

                {/* Course Switcher */}
                <div className="flex items-center gap-2.5 bg-[#f6f8f5] border border-[#dce2d5] px-3.5 py-2 rounded-xl">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">Branch:</span>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-transparent text-sm font-bold text-ink outline-none cursor-pointer"
                  >
                    {AVAILABLE_COURSES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-xl transition-all text-center cursor-pointer ${
                  isDragOver
                    ? 'border-teal bg-[#eff7f4]'
                    : file
                    ? 'border-[#24685e] bg-[#f4f9f6]'
                    : 'border-[#ccd8d2] bg-[#fbfdfa] hover:bg-[#f5f9f6] hover:border-teal'
                }`}
              >
                <input
                  type="file"
                  id="resume-upload-input"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />

                <div className="w-14 h-14 rounded-2xl bg-[#eff5e7] border border-[#d2e4c4] flex items-center justify-center text-2xl mb-4 text-[#24685e] shadow-sm">
                  {file ? '📄' : '☁️'}
                </div>

                {file ? (
                  <div className="space-y-1">
                    <p className="font-bold text-ink text-base">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#24685e] font-mono font-semibold">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for AI Analysis
                    </p>
                    <span className="inline-block text-xs text-muted mt-2 underline">
                      Click or drop another file to change
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-bold text-ink text-base">
                      <span className="text-[#24685e] underline">Click to upload</span> or drag and drop your resume
                    </p>
                    <p className="text-xs text-muted font-mono">
                      PDF documents only · Max size 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-[#fff0eb] border border-[#ffd5c7] text-[#c94d1b] text-sm rounded-xl flex items-center gap-3">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted font-mono">
                  🔒 Your resume is parsed in-memory securely and strictly for generating your personalized roadmap.
                </p>
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-ink text-white hover:bg-teal hover:shadow-button-lime rounded-lg font-extrabold text-[13px] tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Personalized Roadmap</span>
                      <span>⚡</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ── Loading Spinner State ──────────────────────────────────── */}
            {loading && (
              <div className="bg-white border border-[#dce2d5] rounded-2xl p-12 text-center shadow-sm space-y-4">
                <div className="w-12 h-12 border-3 border-[#24685e]/20 border-t-[#24685e] rounded-full animate-spin mx-auto" />
                <h3 className="font-serif font-bold text-xl text-ink">Analyzing Resume Structure & Industry Fit...</h3>
                <p className="text-sm text-muted max-w-md mx-auto">
                  Extracting your technical competencies, comparing with <strong>{selectedCourse}</strong> placement syllabi, and drafting a tailored revision schedule.
                </p>
              </div>
            )}

            {/* ── Roadmap Analysis Results ───────────────────────────────── */}
            {roadmap && !loading && (
              <div className="space-y-10 animate-fade-in">
                
                {/* Result Overview Banner */}
                <div className="bg-[#edf6f4] border border-[#ccd8d2] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#24685e] font-bold">
                      Analysis Complete · {selectedCourse} Core Matrix
                    </div>
                    <h2 className="font-serif font-bold text-2xl text-ink mt-0.5">
                      Your Customized Preparation Blueprint
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white border border-[#ccd8d2] px-4 py-2 rounded-xl text-center shadow-xs">
                      <div className="text-xs font-mono text-muted uppercase">Strengths</div>
                      <div className="text-xl font-bold text-[#24685e]">
                        {roadmap.strengths ? roadmap.strengths.length : 0}
                      </div>
                    </div>
                    <div className="bg-white border border-[#ccd8d2] px-4 py-2 rounded-xl text-center shadow-xs">
                      <div className="text-xs font-mono text-muted uppercase">To Learn</div>
                      <div className="text-xl font-bold text-[#da6b51]">
                        {roadmap.areasToImprove ? roadmap.areasToImprove.length : 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Strengths */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#eff5e7] border border-[#d2e4c4] flex items-center justify-center text-sm font-bold text-[#24685e]">
                      🟢
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-2xl text-ink">
                        Your Strengths (Mastered Skills)
                      </h2>
                      <p className="text-xs text-muted">
                        Competencies verified from your resume. Quick recap suggestions to keep them sharp:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {roadmap.strengths && roadmap.strengths.length > 0 ? (
                      roadmap.strengths.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-[#d8e6df] rounded-xl p-5 shadow-xs hover:border-[#24685e] hover:shadow-card-hover transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-ink">{item.skill}</h3>
                              <span className="bg-[#eff5e7] text-[#1e5750] text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-[#d2e4c4]">
                                Verified
                              </span>
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                              {item.revisionOverview}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-white border border-dashed border-[#ccd8d2] p-6 rounded-xl text-center text-muted text-sm">
                        No specific {selectedCourse} technical skills were detected from the text.
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Areas to Conquer (Gaps) */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fff0eb] border border-[#ffd5c7] flex items-center justify-center text-sm font-bold text-[#da6b51]">
                      🎯
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-2xl text-ink">
                        Areas to Conquer (Missing Core Skills)
                      </h2>
                      <p className="text-xs text-muted">
                        Essential skills expected by core recruiters for {selectedCourse} roles that were not found on your resume:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {roadmap.areasToImprove && roadmap.areasToImprove.length > 0 ? (
                      roadmap.areasToImprove.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-[#ffdcd1] rounded-xl p-6 shadow-xs hover:border-[#da6b51] hover:shadow-card-hover transition-all flex flex-col md:flex-row gap-6"
                        >
                          <div className="md:w-1/3 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-serif font-bold text-xl text-ink">{item.skill}</h3>
                              <span className="bg-[#fff0eb] text-[#da6b51] text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-[#ffd5c7]">
                                Skill Gap
                              </span>
                            </div>
                            <div className="bg-[#fff8f5] border border-[#ffe3d9] p-3.5 rounded-lg">
                              <span className="text-[10px] text-[#da6b51] font-mono font-bold uppercase tracking-wider block mb-1">
                                Why It Matters
                              </span>
                              <p className="text-xs text-muted leading-relaxed">
                                {item.importance}
                              </p>
                            </div>
                          </div>

                          <div className="md:w-2/3">
                            <div className="bg-[#f5f8f7] border border-[#dbe6e2] p-5 rounded-lg h-full flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] text-[#24685e] font-mono font-bold uppercase tracking-wider block mb-2">
                                  Action & Preparation Guide
                                </span>
                                <p className="text-xs md:text-sm text-ink leading-relaxed whitespace-pre-wrap">
                                  {item.preparationGuide}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-dashed border-[#ccd8d2] p-6 rounded-xl text-center text-muted text-sm">
                        🎉 Great job! Your resume covers the fundamental skills required for {selectedCourse}.
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps / Quick Links Bar */}
                <div className="bg-[#f1eee4] border border-[#dce2d5] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <div className="text-center sm:text-left">
                    <h4 className="font-bold text-ink text-base">Ready to practice and bridge these gaps?</h4>
                    <p className="text-xs text-muted mt-0.5">Explore our visual roadmap subjects or compare with placement recruiter matrices.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/placements"
                      className="px-5 py-2.5 bg-white border border-[#ccd8d2] text-ink hover:bg-[#edf6f4] hover:border-teal rounded-lg font-bold text-xs transition"
                    >
                      🎯 Target Company Matrix
                    </Link>
                    <Link
                      to="/careers"
                      className="px-5 py-2.5 bg-ink text-white hover:bg-teal rounded-lg font-bold text-xs transition"
                    >
                      Explore Career Paths →
                    </Link>
                  </div>
                </div>

              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
      <AIChatBuddy />
    </div>
  )
}

export default PersonalizedRoadmap

