import { useState, useRef, useEffect } from "react";
import "../styles/home.css";
import theme from "../styles/theme";

/* ── Score Ring ── */
function ScoreRing({ score = 0, size = 100 }) {
  const r    = 44;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(score, 100) / 100) * circ;
  const color =
    score >= 80 ? theme.strengthGreat :
    score >= 60 ? theme.strengthGood  :
    score >= 40 ? theme.strengthFair  :
                  theme.strengthWeak;
  return (
    <div style={{ position:"relative", width:size, height:size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)", position:"absolute" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
        <circle
          cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 8px ${color})`, transition:"stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{ textAlign:"center", zIndex:1 }}>
        <div style={{ fontSize:size/4.5, fontWeight:800, color, fontFamily:theme.fontMain, lineHeight:1 }}>{Math.round(score)}</div>
        <div style={{ fontSize:size/9, color:theme.textMuted, marginTop:2 }}>/100</div>
      </div>
    </div>
  );
}

/* ── Score Bar Row ── */
function ScoreBar({ label, score, weight }) {
  const color =
    score >= 80 ? theme.strengthGreat :
    score >= 60 ? theme.strengthGood  :
    score >= 40 ? theme.strengthFair  :
                  theme.strengthWeak;
  return (
    <div className="result-bar-row">
      <div className="result-bar-top">
        <span className="result-bar-label">{label}</span>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span className="result-bar-weight">{weight}%</span>
          <span className="result-bar-score" style={{ color }}>{Math.round(score)}%</span>
        </div>
      </div>
      <div className="result-bar-bg">
        <div className="result-bar-fill" style={{ width:`${Math.min(score,100)}%`, background:color, boxShadow:`0 0 8px ${color}88` }}/>
      </div>
    </div>
  );
}

/* ── Mock Preview (shown before analysis) ── */
const MOCK_CHECKS = [
  { label:"ATS Compatibility",  pct:87, c:theme.strengthGreat },
  { label:"Skill Match",        pct:72, c:theme.strengthGood  },
  { label:"Keyword Density",    pct:65, c:theme.strengthGood  },
  { label:"Grammar & Style",    pct:91, c:theme.strengthGreat },
  { label:"Format & Structure", pct:78, c:theme.strengthGreat },
  { label:"Action Verbs",       pct:55, c:theme.strengthFair  },
];

function MockPreview() {
  return (
    <div className="home-preview-card">
      <div className="home-preview-header">
        <div>
          <div className="home-preview-label">SAMPLE SCORE</div>
          <ScoreRing score={79} size={88}/>
        </div>
        <div style={{ textAlign:"right" }}>
          <div className="home-preview-grade">Grade: B</div>
          <div className="home-preview-badge">ATS READY</div>
        </div>
      </div>
      <div className="home-preview-checks">
        {MOCK_CHECKS.map(c => (
          <div key={c.label} className="home-check-row">
            <div className="home-check-top">
              <span className="home-check-label">{c.label}</span>
              <span className="home-check-pct" style={{ color:c.c }}>{c.pct}%</span>
            </div>
            <div className="home-check-bar-bg">
              <div className="home-check-bar-fill" style={{ width:`${c.pct}%`, background:c.c, boxShadow:`0 0 6px ${c.c}88` }}/>
            </div>
          </div>
        ))}
      </div>
      <div className="home-preview-note">Upload your resume to get your real score →</div>
    </div>
  );
}

/* ── Result Card (shown after analysis) ── */
function ResultCard({ result, jobTitle }) {
  const score   = result.overallScore ?? result.finalScore ?? result.compositeScore ?? 0;
  const grade   = result.grade   ?? "—";
  const verdict = result.verdict ?? result.atsVerdict ?? "";

  const ai      = result.aiAnalysis ?? result.aiScore ?? result.aiResult ?? {};

  const skillScore    = result.skillScore    ?? ai.skillScore    ?? 0;
  const grammarScore  = result.grammarScore  ?? ai.grammarScore  ?? 0;
  const formatScore   = result.formatScore   ?? ai.formatScore   ?? 0;
  const keywordScore  = result.keywordScore  ?? ai.keywordScore  ?? 0;
  const experienceScore = result.experienceScore ?? ai.experienceScore ?? 0;
  const educationScore  = result.educationScore  ?? ai.educationScore  ?? 0;
  const contactScore    = result.contactScore    ?? ai.contactScore    ?? 0;
  const verbScore       = result.verbScore ?? result.verbDiversityScore ?? ai.verbScore ?? 0;

  const matchedSkills = result.matchedSkills ?? ai.matchedSkills ?? [];
  const missingSkills = result.missingSkills ?? ai.missingSkills ?? [];
  const grammarIssues = result.grammarIssues ?? ai.grammarIssues ?? [];

  const gradeColor =
    grade === "A" ? theme.strengthGreat :
    grade === "B" ? theme.strengthGood  :
    grade === "C" ? theme.strengthFair  :
                    theme.strengthWeak;

  return (
    <div className="result-card">
      {/* Header */}
      <div className="result-header">
        <div>
          <div className="result-title">📊 Analysis Complete</div>
          {jobTitle && <div className="result-jobtitle">Job: {jobTitle}</div>}
        </div>
        <div className="result-grade-badge" style={{ borderColor: gradeColor, color: gradeColor }}>
          Grade {grade}
        </div>
      </div>

      {/* Score ring + verdict */}
      <div className="result-top-row">
        <ScoreRing score={score} size={110}/>
        <div className="result-verdict-block">
          <div className="result-verdict-label">ATS VERDICT</div>
          <div className="result-verdict-text">{verdict || "Analysis complete. See scores below."}</div>
          <div className="result-score-label">Overall Score: <strong style={{ color: theme.accent }}>{Math.round(score)}/100</strong></div>
        </div>
      </div>

      {/* 8 category scores */}
      <div className="result-section-title">📈 Category Breakdown</div>
      <div className="result-bars">
        <ScoreBar label="Skills Match"     score={skillScore}      weight={28}/>
        <ScoreBar label="Grammar & Style"  score={grammarScore}    weight={18}/>
        <ScoreBar label="Format"           score={formatScore}     weight={18}/>
        <ScoreBar label="Keyword Density"  score={keywordScore}    weight={18}/>
        <ScoreBar label="Experience"       score={experienceScore} weight={14}/>
        <ScoreBar label="Education"        score={educationScore}  weight={14}/>
        <ScoreBar label="Contact Info"     score={contactScore}    weight={14}/>
        <ScoreBar label="Verb Diversity"   score={verbScore}       weight={14}/>
      </div>

      {/* Matched / Missing skills */}
      {(matchedSkills.length > 0 || missingSkills.length > 0) && (
        <>
          <div className="result-section-title">🎯 Skills Analysis</div>
          <div className="result-skills-grid">
            {matchedSkills.length > 0 && (
              <div className="result-skills-box result-skills-matched">
                <div className="result-skills-box-title">✓ Matched Skills</div>
                <div className="result-chips">
                  {matchedSkills.map((s,i) => (
                    <span key={i} className="chip chip-green">{typeof s === "string" ? s : s.skill ?? s.name ?? s}</span>
                  ))}
                </div>
              </div>
            )}
            {missingSkills.length > 0 && (
              <div className="result-skills-box result-skills-missing">
                <div className="result-skills-box-title">✗ Missing Skills</div>
                <div className="result-chips">
                  {missingSkills.map((s,i) => (
                    <span key={i} className="chip chip-red">{typeof s === "string" ? s : s.skill ?? s.name ?? s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Grammar issues */}
      {grammarIssues.length > 0 && (
        <>
          <div className="result-section-title">✍️ Grammar Issues</div>
          <div className="result-grammar-list">
            {grammarIssues.slice(0,5).map((g,i) => (
              <div key={i} className="result-grammar-item">
                <span className="grammar-error">{g.errorText ?? g.error ?? g.text ?? g}</span>
                {g.suggestion && <span className="grammar-arrow"> → </span>}
                {g.suggestion && <span className="grammar-fix">{g.suggestion}</span>}
              </div>
            ))}
            {grammarIssues.length > 5 && (
              <div className="result-grammar-more">+{grammarIssues.length - 5} more issues found</div>
            )}
          </div>
        </>
      )}

      <div className="result-footer-note">
        💡 Improve missing skills and fix grammar issues to boost your ATS score.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN HOME COMPONENT
══════════════════════════════════════════════ */
export default function Home({ loggedIn, isAdmin, onSignInClick, onLogout, onAdminClick }) {
  const [dragging,  setDragging]  = useState(false);
  const [fileName,  setFileName]  = useState("");
  const [fileErr,   setFileErr]   = useState("");
  const [mounted,   setMounted]   = useState(false);
  const [selFile,   setSelFile]   = useState(null);

  /* JD fields */
  const [jobTitle,    setJobTitle]    = useState("");
  const [reqSkills,   setReqSkills]   = useState("");
  const [reqExp,      setReqExp]      = useState("");
  const [reqEdu,      setReqEdu]      = useState("");
  const [eduLevel,    setEduLevel]    = useState("");
  const [eduDetail,   setEduDetail]   = useState("");

  /* analysis state */
  const [analyzing, setAnalyzing] = useState(false);
  const [result,    setResult]    = useState(null);
  const [apiErr,    setApiErr]    = useState("");

  const fileRef   = useRef();
  const resultRef = useRef();

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  /* scroll to result when it arrives */
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
    }
  }, [result]);

  /* ── File validation ── */
  const handleFile = (file) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) { setFileErr("Only PDF or DOCX files allowed."); return; }
    if (file.size > 5 * 1024 * 1024)  { setFileErr("File must be under 5MB.");          return; }
    setFileErr("");
    setFileName(file.name);
    setSelFile(file);
    setResult(null);
    setApiErr("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ── Analyze ── */
  const handleAnalyze = async () => {
    if (!selFile || !jobTitle.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setApiErr("");
    try {
      const token    = localStorage.getItem("token");
      console.log("Token:", token);
      const formData = new FormData();
      formData.append("file",               selFile);
      formData.append("jobTitle",           jobTitle.trim());
      formData.append("requiredSkills",     reqSkills.trim());
      formData.append("experienceRequired", reqExp.trim());
      const eduValue = eduLevel
        ? (eduDetail.trim() ? `${eduLevel}|${eduDetail.trim()}` : eduLevel)
        : "";
      formData.append("educationRequired", eduValue);

      const res  = await fetch("http://localhost:8080/api/job-sathi/analysis", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Server error ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setApiErr(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const canAnalyze = loggedIn && selFile && jobTitle.trim();

  return (
    <div className="home-page">

      {/* ── NAV ── */}
      <nav className="home-nav">
        <div className="home-nav-logo">
          <div className="home-nav-icon">🎯</div>
          <span className="home-nav-title">ATS Analyzer</span>
          <span className="home-nav-sub">AI RESUME ATS ANALYZER</span>
        </div>
        <div className="home-nav-links">
          {["Features","How it works","About"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="home-nav-link">{l}</a>
          ))}
          {loggedIn
            ? <div style={{display:'flex',gap:8}}>
                {isAdmin && (
                  <button className="home-nav-admin" onClick={onAdminClick}>🛡️ Admin</button>
                )}
                <button className="home-nav-logout" onClick={onLogout}>Sign Out</button>
              </div>
            : <button className="home-nav-signin" onClick={onSignInClick}>Sign In</button>
          }
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-blob1"/>
        <div className="home-hero-blob2"/>
        <div className="home-hero-grid"/>

        <div className="home-hero-inner">

          {/* ── LEFT COLUMN ── */}
          <div className={`home-hero-left ${mounted ? "mounted" : ""}`}>

            <div className="home-badge">
              <span className="home-badge-dot"/>
              <span className="home-badge-text">AI-POWERED ATS RESUME ANALYZER</span>
            </div>

            <h1 className="home-h1">
              Beat the{" "}
              <span className="home-h1-gradient">ATS filter</span>
              {" "}before it beats you
            </h1>

            <p className="home-subtext">
              Upload your resume, paste the job description, and get a{" "}
              <strong>detailed ATS score</strong> with matched skills, missing keywords,
              grammar feedback and actionable improvements.
            </p>

            {/* Stats */}
            <div className="home-stats">
              {[
                ["500+", "Resumes analyzed"],
                ["8",    "Scoring dimensions"],
                ["100%", "Free to use"],
              ].map(([v,l],i) => (
                <div key={v} style={{ display:"contents" }}>
                  {i > 0 && <div className="home-stat-divider"/>}
                  <div className="home-stat">
                    <div className="home-stat-value">{v}</div>
                    <div className="home-stat-label">{l}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── DROP ZONE ── */}
            <div
              className={`home-dropzone ${dragging ? "dragging" : ""} ${fileName ? "has-file" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => { if (!loggedIn) { onSignInClick(); return; } fileRef.current.click(); }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display:"none" }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {fileName ? (
                <>
                  <div className="home-dropzone-icon">📄</div>
                  <div className="home-dropzone-filename">{fileName}</div>
                  <div className="home-dropzone-change">File ready · Click to change</div>
                </>
              ) : (
                <>
                  <div className="home-dropzone-icon">☁️</div>
                  <div className="home-dropzone-title">
                    {loggedIn ? "Drop your resume here or click to choose" : "Sign in to upload your resume"}
                  </div>
                  <div className="home-dropzone-sub">PDF & DOCX · Max 5MB</div>
                </>
              )}
            </div>
            {fileErr && <div className="home-file-error">⚠ {fileErr}</div>}

            {/* ── JOB DESCRIPTION SECTION ── */}
            {loggedIn && (
              <div className="jd-section">
                <div className="jd-section-title">
                  📋 Job Description
                  <span className="jd-section-sub"> — for accurate ATS scoring</span>
                </div>

                {/* Job Title - REQUIRED */}
                <div className="jd-field">
                  <label className="jd-label">
                    Job Title <span className="jd-required">* required</span>
                  </label>
                  <input
                    className="jd-input"
                    placeholder="e.g. Software Engineer, Data Analyst, Teacher"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                  <div className="jd-hint">
                    💡 If skills are not filled below, we auto-detect expected skills from this title
                  </div>
                </div>

                {/* Required Skills - OPTIONAL */}
                <div className="jd-field">
                  <label className="jd-label">
                    Required Skills
                    <span className="jd-optional"> — optional</span>
                  </label>
                  <input
                    className="jd-input"
                    placeholder="e.g. Java, Spring Boot, Docker, REST API"
                    value={reqSkills}
                    onChange={e => setReqSkills(e.target.value)}
                  />
                </div>

                <div className="jd-row">
                  {/* Experience - OPTIONAL */}
                  <div className="jd-field">
                    <label className="jd-label">
                      Required Experience
                      <span className="jd-optional"> — optional</span>
                    </label>
                    <input
                      className="jd-input"
                      placeholder="e.g. 2+ years, Fresher, 5 years min"
                      value={reqExp}
                      onChange={e => setReqExp(e.target.value)}
                    />
                  </div>

                  {/* Education - OPTIONAL */}
                  <div className="jd-field">
                    <label className="jd-label">
                      Required Education
                      <span className="jd-optional"> — optional</span>
                    </label>

                    {/* Dropdown */}
                    <select
                      className="jd-input jd-select"
                      value={eduLevel}
                      onChange={e => { setEduLevel(e.target.value); setEduDetail(""); }}
                    >
                      <option value="">── No Requirement (default) ──</option>
                      <option value="High School">High School / SEE / SLC</option>
                      <option value="Diploma">Diploma / +2</option>
                      <option value="Bachelor">Bachelor's Degree</option>
                      <option value="Master">Master's Degree</option>
                      <option value="PhD">PhD / Doctorate</option>
                      <option value="Certification">Certification / Short Course</option>
                    </select>

                    {/* Detail box — only shown when a level is selected */}
                    {eduLevel && (
                      <div style={{ marginTop: 8 }}>
                        <input
                          className="jd-input"
                          placeholder={
                            eduLevel === "Bachelor"       ? "e.g. Bachelor in Computer Science / BSc Computer Science" :
                            eduLevel === "Master"         ? "e.g. Master in Business Administration / MBA" :
                            eduLevel === "Certification"  ? "e.g. CPO Certified / Certified Protection Officer" :
                            eduLevel === "PhD"            ? "e.g. PhD in Data Science / Doctorate in Physics" :
                            eduLevel === "Diploma"        ? "e.g. Diploma in Civil Engineering / +2 Science" :
                                                           "e.g. add specific details (optional)"
                          }
                          value={eduDetail}
                          onChange={e => setEduDetail(e.target.value)}
                        />
                        <p style={{ fontSize: 11, color: "#475569", marginTop: 5, lineHeight: 1.5 }}>
                          💡 Write both full form and short form for better matching<br/>
                          e.g. <em>"Bachelor in Computer Science / BSc CS"</em> or <em>"CPO Certified / Certified Protection Officer"</em>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── ANALYZE BUTTON ── */}
            {loggedIn ? (
              <button
                className="home-upload-btn"
                onClick={canAnalyze ? handleAnalyze : selFile ? undefined : () => fileRef.current.click()}
                disabled={analyzing || (selFile && !jobTitle.trim())}
                style={{ opacity: analyzing ? 0.7 : 1 }}
              >
                {analyzing       ? "⏳ Analyzing your resume…" :
                 !selFile        ? "📂 Choose Resume File" :
                 !jobTitle.trim() ? "⚠ Enter Job Title to Continue" :
                                   "🚀 Analyze My Resume"}
              </button>
            ) : (
              <button className="home-upload-btn" onClick={onSignInClick}>
                🔒 Sign In to Analyze Your Resume
              </button>
            )}

            {/* API Error */}
            {apiErr && (
              <div className="home-api-error">
                ⚠ {apiErr}
              </div>
            )}

            <div className="home-privacy-note">
              🔒 Your resume is never shared · Secure analysis
            </div>
          </div>

          {/* ── RIGHT COLUMN — Mock Preview ── */}
          <div className={`home-hero-right ${mounted ? "mounted" : ""}`}>
            <MockPreview/>
          </div>
        </div>
      </section>

      {/* ── RESULT SECTION ── */}
      {result && (
        <section className="result-section" ref={resultRef}>
          <ResultCard result={result} jobTitle={jobTitle}/>
        </section>
      )}

      {/* ── FEATURES ── */}
      <section id="features" className="home-section home-section-alt">
        <div className="home-section-inner">
          <div className="home-section-head">
            <div className="home-section-tag">WHAT WE CHECK</div>
            <h2 className="home-section-h2">8 dimensions. One ATS score.</h2>
            <p className="home-section-p">
              Every factor ATS systems use to filter candidates — scored and explained instantly.
            </p>
          </div>
          <div className="home-features-grid">
            {[
              { icon:"🎯", title:"Skill Match",       desc:"Compares your skills against job description requirements using TF-IDF cosine similarity." },
              { icon:"💡", title:"Keyword Density",   desc:"Measures how keyword-rich your resume is using Term Frequency analysis." },
              { icon:"✍️", title:"Grammar & Style",   desc:"Detects grammar errors, passive phrases, and weak language using NLP checking." },
              { icon:"📐", title:"Format & Structure", desc:"Checks resume sections, word count, bullet points, and ATS-friendly layout." },
              { icon:"📊", title:"Experience Score",  desc:"Extracts years of experience and compares against job requirements." },
              { icon:"🎓", title:"Education Score",   desc:"Matches your education level against the role's minimum requirements." },
              { icon:"📞", title:"Contact Info",      desc:"Ensures all essential contact details are present and correctly formatted." },
              { icon:"⚡", title:"Verb Diversity",    desc:"Evaluates your action verbs across 7 impact categories for maximum recruiter appeal." },
            ].map(f => (
              <div key={f.title} className="home-feature-card">
                <div className="home-feature-icon">{f.icon}</div>
                <div className="home-feature-title">{f.title}</div>
                <div className="home-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="home-section">
        <div className="home-section-sm">
          <div className="home-section-head">
            <div className="home-section-tag">HOW IT WORKS</div>
            <h2 className="home-section-h2">Four steps to a better resume</h2>
          </div>
          <div className="home-steps-grid">
            {[
              { step:"01", icon:"📤", title:"Upload Resume",        desc:"Upload your PDF or DOCX resume. We accept all standard formats up to 5MB." },
              { step:"02", icon:"📋", title:"Enter Job Description", desc:"Paste the job title and vacancy requirements. The more detail you provide, the more accurate your score." },
              { step:"03", icon:"🤖", title:"AI & NLP Analysis",    desc:"Our engine runs 8 scoring checks using TF-IDF cosine similarity, LanguageTool grammar checking, and AI-powered skill inference." },
              { step:"04", icon:"📈", title:"Get Your Score",        desc:"Receive a detailed ATS score with matched skills, missing keywords, grammar issues, and actionable improvements." },
            ].map(s => (
              <div key={s.step} className="home-step-card">
                <div className="home-step-number">{s.step}</div>
                <div className="home-step-icon">{s.icon}</div>
                <div className="home-step-title">{s.title}</div>
                <div className="home-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <div className="home-cta-icon">🎯</div>
          <h2 className="home-cta-h2">
            Ready to beat the{" "}
            <span className="home-h1-gradient">ATS filter?</span>
          </h2>
          <p className="home-cta-p">
            Get your detailed ATS score in seconds. Free forever, no credit card required.
          </p>
          <button className="home-cta-btn" onClick={loggedIn ? () => window.scrollTo({top:0,behavior:"smooth"}) : onSignInClick}>
            {loggedIn ? "Analyze Resume Now →" : "Get Started Free →"}
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="home-footer-logo">
          <div className="home-footer-logo-icon">🎯</div>
          <span className="home-footer-logo-text">AI Resume ATS Analyzer</span>
        </div>
        <span className="home-footer-copy">© 2025 · AI Resume ATS Analyzer · BSc CSIT Project</span>
        <div className="home-footer-links">
          <span className="home-footer-link">Developed by: [Your Name]</span>
        </div>
      </footer>

    </div>
  );
}