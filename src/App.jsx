import { useState, useCallback } from "react";
import "./App.css";

// ─── Milestones ───────────────────────────────────────────────────
const MILESTONES = {
  [1  * 52]: { label: "First birthday 🎂",         color: "blue"   },
  [5  * 52]: { label: "Started school ✏️",          color: "blue"   },
  [10 * 52]: { label: "A decade of life",            color: "blue"   },
  [18 * 52]: { label: "Turned 18 — adulthood",       color: "green"  },
  [22 * 52]: { label: "College graduation 🎓",        color: "green"  },
  [25 * 52]: { label: "Quarter century",              color: "green"  },
  [30 * 52]: { label: "Turned 30 🪔",                color: "purple" },
  [40 * 52]: { label: "Turned 40 — real prime",       color: "purple" },
  [50 * 52]: { label: "Half a century 🌟",            color: "purple" },
  [60 * 52]: { label: "Diamond era — 60 years",       color: "purple" },
};

const MESSAGES = [
  (n, pct, left, yrs) =>
    `You've lived ${pct}% of your life, ${n}. The remaining ${left.toLocaleString("en-IN")} weeks are not a guarantee — they're a gift. Each dot ahead is a chance to do what you keep postponing. Not someday. This week.`,
  (n, pct, left, yrs) =>
    `At ${yrs}, you've already lived ${pct}% of your life. The strange thing about time is it feels abundant when we're young and scarce only in hindsight. Most extraordinary moments happen on ordinary Tuesdays.`,
  (n, pct, left, yrs) =>
    `${left.toLocaleString("en-IN")} weeks — if things go well. The meetings that feel urgent, the arguments that seem important, the rest you keep delaying — hold each one up to the grid and ask: is this worth one of my dots?`,
];

// ─── Tooltip ─────────────────────────────────────────────────────
function Tooltip({ text, x, y }) {
  if (!text) return null;
  return (
    <div className="tooltip" style={{ left: x + 14, top: y - 10 }}>
      {text.split("\n").map((l, i, arr) => (
        <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
      ))}
    </div>
  );
}

// ─── Week Dot ────────────────────────────────────────────────────
function WeekDot({ week, weeksLived, onHover, onLeave }) {
  const isLived = week < weeksLived;
  const isNow   = week === weeksLived;
  const ms      = MILESTONES[week];
  const yr      = Math.floor(week / 52) + 1;
  const wk      = (week % 52) + 1;

  let cls = "dot";
  if (isNow)              cls = "dot dot-now";
  else if (ms && isLived) cls = `dot dot-ms dot-ms-${ms.color}`;
  else if (ms)            cls = `dot dot-ms dot-ms-future dot-ms-${ms.color}`;
  else if (isLived)       cls = "dot dot-lived";
  else                    cls = "dot dot-future";

  const label = isNow
    ? `← You are here\nYear ${yr}, Week ${wk}`
    : ms
    ? `${ms.label}\nYear ${yr}`
    : `Year ${yr}, Week ${wk}\n${isLived ? "Lived ✓" : "Ahead"}`;

  return (
    <div
      className={cls}
      onMouseEnter={e => onHover(label, e.clientX, e.clientY)}
      onMouseMove={e  => onHover(label, e.clientX, e.clientY)}
      onMouseLeave={onLeave}
    />
  );
}

// ─── Parent Card ─────────────────────────────────────────────────
function ParentCard({ parent, userWeeksLeft }) {
  const { name, age, visitsPerYear } = parent;
  const lifeExp   = 78;
  const yearsLeft = Math.max(0, lifeExp - age);
  const yourYearsLeft  = Math.round(userWeeksLeft / 52);
  const sharedYears    = Math.min(yearsLeft, yourYearsLeft);
  const sharedVisits   = Math.round(sharedYears * visitsPerYear);
  const totalVisitsLeft = Math.round(yearsLeft * visitsPerYear);
  const urgency = sharedVisits < 20 ? "critical" : sharedVisits < 50 ? "warm" : "ok";

  const daysPerVisit  = Math.round(365 / visitsPerYear);
  const hoursPerVisit = daysPerVisit <= 3 ? daysPerVisit * 8 : Math.min(daysPerVisit * 12, 100);
  const totalHours    = Math.round(sharedYears * visitsPerYear * hoursPerVisit);

  const firstName = name.split(" ")[0];

  return (
    <div className={`parent-card urgency-${urgency}`}>
      <div className="pc-top">
        <div>
          <div className="pc-name">{name}</div>
          <div className="pc-age">Age {age} · ~{yearsLeft} years ahead (est.)</div>
        </div>
        <span className={`pc-badge badge-${urgency}`}>
          {urgency === "critical" ? "Every visit counts" : urgency === "warm" ? "Time is precious" : "Make it count"}
        </span>
      </div>

      <div className="pc-big">
        <span className="pc-big-num">{sharedVisits}</span>
        <span className="pc-big-text">more times you'll see {firstName}</span>
      </div>

      <div className="pc-sub">
        at {visitsPerYear}x/year · ~{totalHours.toLocaleString("en-IN")} hours total together
      </div>

      <div className="pc-stats">
        <div className="pc-stat">
          <div className="pc-stat-num">{totalVisitsLeft}</div>
          <div className="pc-stat-label">total visits left</div>
        </div>
        <div className="pc-divider" />
        <div className="pc-stat">
          <div className="pc-stat-num">{sharedYears}</div>
          <div className="pc-stat-label">shared years</div>
        </div>
        <div className="pc-divider" />
        <div className="pc-stat">
          <div className="pc-stat-num">{Math.round(totalHours / Math.max(sharedYears, 1) / 365 * 10) / 10}h</div>
          <div className="pc-stat-label">daily avg</div>
        </div>
      </div>

      <p className="pc-insight">
        {sharedVisits < 15
          ? `You've likely already spent more than half your lifetime with ${firstName}. Every call, every meal, every hug now matters more than you realise.`
          : sharedVisits < 40
          ? `Each visit is now a meaningful percentage of what's left. Don't let "I'll visit next month" become next year.`
          : `You still have beautiful time ahead with ${firstName}. Use it with intention — not just to be present, but to really be there.`}
      </p>
    </div>
  );
}

// ─── Time Breakdown ───────────────────────────────────────────────
function TimeBreakdown({ weeksLeft }) {
  const daysLeft  = weeksLeft * 7;
  const hoursLeft = daysLeft * 24;

  const cats = [
    { label: "Sleep",              pct: 33, color: "blue",   icon: "😴", note: "Non-negotiable. Guard it fiercely." },
    { label: "Work",               pct: 22, color: "amber",  icon: "💼", note: "~8 hrs/day until retirement" },
    { label: "Phone & screens",    pct: 14, color: "red",    icon: "📱", note: "Most people want this number back" },
    { label: "Family & loved ones",pct: 8,  color: "green",  icon: "🫂", note: "The #1 deathbed regret — this was too low" },
    { label: "Commute",            pct: 6,  color: "gray",   icon: "🚌", note: "Mostly unavoidable" },
    { label: "Eating & chores",    pct: 7,  color: "teal",   icon: "🍽️", note: "The invisible hours of life" },
    { label: "Truly free time",    pct: 10, color: "purple", icon: "✨", note: "This is what you're protecting" },
  ];

  return (
    <section className="breakdown-section">
      <h3 className="section-title">
        <span className="section-title-icon">⏳</span>
        Where your remaining time actually goes
      </h3>
      <p className="section-sub">
        Based on average lifestyle — adjust mentally for your own reality.
      </p>

      <div className="bk-bar">
        {cats.map(c => (
          <div key={c.label} className={`bk-seg bk-seg-${c.color}`}
            style={{ width: c.pct + "%" }} title={`${c.label}: ${c.pct}%`} />
        ))}
      </div>

      <div className="bk-grid">
        {cats.map(c => {
          const hrs  = Math.round(hoursLeft * c.pct / 100);
          const days = Math.round(daysLeft  * c.pct / 100);
          return (
            <div className={`bk-card bk-${c.color}`} key={c.label}>
              <div className="bk-icon">{c.icon}</div>
              <div className="bk-num">{hrs.toLocaleString("en-IN")}</div>
              <div className="bk-unit">hrs · {days.toLocaleString("en-IN")} days</div>
              <div className="bk-label">{c.label}</div>
              <div className="bk-note">{c.note}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Dev Credit ───────────────────────────────────────────────────
function DevCredit({ position }) {
  if (position === "top") {
    return (
      <div className="dev-top">
        <span className="dev-top-line" />
        <span className="dev-top-text">crafted by <em>Vipul</em></span>
        <span className="dev-top-line" />
      </div>
    );
  }
  return (
    <div className="dev-bottom">
      <div className="dev-bottom-glyph">V</div>
      <div className="dev-bottom-name">Vipul</div>
      <div className="dev-bottom-roles">Designed · Developed · Shipped</div>
      <div className="dev-bottom-quote">"Build things that make people feel something."</div>
      <div className="dev-bottom-stack">React · Pure CSS · Zero backend · Zero APIs</div>
    </div>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────
function Setup({ onSubmit }) {
  const [name, setName]       = useState("");
  const [dob, setDob]         = useState("");
  const [exp, setExp]         = useState("75");
  const [parents, setParents] = useState([
    { name: "Mom", age: "", visitsPerYear: "4" },
    { name: "Dad", age: "", visitsPerYear: "4" },
  ]);

  const today = new Date().toISOString().split("T")[0];

  const updateParent = (i, key, val) =>
    setParents(p => p.map((x, idx) => idx === i ? { ...x, [key]: val } : x));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !dob) return;
    const valid = parents.filter(p => p.name.trim() && parseInt(p.age) > 0);
    onSubmit({
      name: name.trim(),
      dob,
      exp: parseInt(exp),
      parents: valid.map(p => ({
        name: p.name.trim(),
        age: parseInt(p.age),
        visitsPerYear: parseFloat(p.visitsPerYear) || 4,
      })),
    });
  };

  return (
    <div className="setup-screen">
      <DevCredit position="top" />

      <div className="setup-inner">
        <div className="setup-eyebrow">A different way to see your life</div>
        <h1 className="setup-title">Your life<br /><em>in weeks</em></h1>
        <p className="setup-sub">
          Every dot is one week. See how many you've lived, how many are ahead —
          and how much time remains with the people you love most.
        </p>

        <form className="setup-form" onSubmit={handleSubmit}>
          <div className="form-group-label">About you</div>

          <div className="field">
            <label>Your name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="What should we call you?" maxLength={30} autoFocus />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Date of birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} max={today} />
            </div>
            <div className="field">
              <label>Life expectancy</label>
              <select value={exp} onChange={e => setExp(e.target.value)}>
                <option value="70">70 yrs — India avg</option>
                <option value="75">75 years</option>
                <option value="80">80 years</option>
                <option value="85">85 — optimistic</option>
                <option value="90">90 years</option>
              </select>
            </div>
          </div>

          <div className="form-group-label" style={{ marginTop: 4 }}>
            Your parents
            <span className="form-optional">optional — but the most powerful section</span>
          </div>

          {parents.map((p, i) => (
            <div className="parent-input-row" key={i}>
              <div className="field f-name">
                <label>{i === 0 ? "Parent 1" : "Parent 2"}</label>
                <input type="text" value={p.name}
                  onChange={e => updateParent(i, "name", e.target.value)}
                  placeholder={i === 0 ? "Mom" : "Dad"} maxLength={20} />
              </div>
              <div className="field f-age">
                <label>Their age</label>
                <input type="number" value={p.age}
                  onChange={e => updateParent(i, "age", e.target.value)}
                  placeholder="62" min={30} max={110} />
              </div>
              <div className="field f-visits">
                <label>You see them</label>
                <select value={p.visitsPerYear}
                  onChange={e => updateParent(i, "visitsPerYear", e.target.value)}>
                  <option value="1">1× a year</option>
                  <option value="2">2× a year</option>
                  <option value="3">3× a year</option>
                  <option value="4">4× a year</option>
                  <option value="6">Monthly</option>
                  <option value="12">Every 2 weeks</option>
                  <option value="26">Weekly</option>
                  <option value="52">Daily / live together</option>
                </select>
              </div>
            </div>
          ))}

          <button type="submit" className="cta-btn">Show my life →</button>
        </form>

        <p className="privacy-note">Nothing leaves your browser · No servers · No accounts · No ads</p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
function Dashboard({ data, onBack }) {
  const { name, dob, exp, parents } = data;
  const [tooltip, setTooltip] = useState({ text: null, x: 0, y: 0 });

  const dobDate    = new Date(dob);
  const now        = new Date();
  const msPerWeek  = 7 * 24 * 60 * 60 * 1000;
  const totalWeeks = exp * 52;
  const weeksSince = Math.floor((now - dobDate) / msPerWeek);
  const weeksLived = Math.min(Math.max(0, weeksSince), totalWeeks);
  const weeksLeft  = Math.max(0, totalWeeks - weeksLived);
  const pctLived   = Math.round((weeksLived / totalWeeks) * 100);
  const ageYears   = Math.floor(weeksLived / 52);
  const ageWeeks   = weeksLived % 52;
  const yearsLeft  = Math.round(weeksLeft / 52);

  const dobStr = dobDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const onHover = useCallback((t, x, y) => setTooltip({ text: t, x, y }), []);
  const onLeave = useCallback(() => setTooltip({ text: null, x: 0, y: 0 }), []);
  const msg = MESSAGES[ageYears % MESSAGES.length](name, pctLived, weeksLeft, ageYears);

  const indianCounts = [
    { icon: "☀️", n: yearsLeft,                              what: "Summers left",       ctx: "Each one a season to travel, rest, or start something new" },
    { icon: "🥭", n: yearsLeft,                              what: "Mango seasons",       ctx: "A uniquely Indian way to measure a life" },
    { icon: "🪔", n: yearsLeft,                              what: "Diwalis left",        ctx: "Celebrations with the people you love most" },
    { icon: "🎉", n: weeksLeft,                              what: "Fridays left",        ctx: "Make even half of them intentional" },
    { icon: "🌕", n: Math.round(weeksLeft * 7 / 29.5),      what: "Full moon nights",    ctx: "How many have you actually stopped to notice?" },
    { icon: "☕", n: Math.round(weeksLeft * 7 * 52 / 365),  what: "Sunday mornings",     ctx: "Your most precious leisure hours" },
    { icon: "🎨", n: yearsLeft * 2,                         what: "Holi + Eid seasons",  ctx: "Festivals that define the rhythm of Indian life" },
    { icon: "🌧️", n: yearsLeft,                             what: "Monsoon seasons",     ctx: "The smell of first rain, every year, while you can" },
  ];

  return (
    <div className="dashboard">
      <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />
      <DevCredit position="top" />

      {/* Header */}
      <header className="dash-header">
        <div>
          <div className="dash-eyebrow">Life of</div>
          <h2 className="dash-name"><em>{name}</em></h2>
          <div className="dash-meta">
            Born {dobStr} &nbsp;·&nbsp; Age {ageYears} yrs {ageWeeks} wks &nbsp;·&nbsp; {pctLived}% lived
          </div>
        </div>
        <button className="back-btn" onClick={onBack}>← Start over</button>
      </header>

      {/* Stats */}
      <div className="stats-row">
        {[
          { val: weeksLived.toLocaleString("en-IN"), label: "Weeks lived" },
          { val: weeksLeft.toLocaleString("en-IN"),  label: "Weeks ahead" },
          { val: pctLived + "%",                      label: "Life lived" },
          { val: yearsLeft,                           label: "Years remaining" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <section className="grid-section">
        <div className="grid-header">
          <span>Each row = 1 year · Each dot = 1 week · {exp} years · {totalWeeks.toLocaleString("en-IN")} total weeks</span>
          <div className="legend">
            <span className="leg"><span className="leg-dot ld-lived" />Lived</span>
            <span className="leg"><span className="leg-dot ld-now" />Now</span>
            <span className="leg"><span className="leg-dot ld-future" />Ahead</span>
            <span className="leg"><span className="leg-dot ld-ms" />Milestone</span>
          </div>
        </div>

        <div className="grid-scroll">
          <div className="week-grid">
            {Array.from({ length: totalWeeks }, (_, i) => (
              <WeekDot key={i} week={i} weeksLived={weeksLived} onHover={onHover} onLeave={onLeave} />
            ))}
          </div>
        </div>

        <div className="grid-footer">
          {[0, 25, 50, 75, 100].map(p => (
            <span key={p}>Age {Math.round(exp * p / 100)}</span>
          ))}
        </div>
      </section>

      {/* Parents */}
      {parents?.length > 0 && (
        <section className="parents-section">
          <h3 className="section-title">
            <span className="section-title-icon">🫂</span>
            Time left with your parents
          </h3>
          <p className="section-sub">
            The number that changes how people think about the next visit home.
          </p>
          <div className="parents-grid">
            {parents.map((p, i) => (
              <ParentCard key={i} parent={p} userWeeksLeft={weeksLeft} />
            ))}
          </div>
        </section>
      )}

      {/* Indian counts */}
      <section className="counts-section">
        <h3 className="section-title">
          <span className="section-title-icon">🌾</span>
          The Indian way to count what's left
        </h3>
        <div className="counts-grid">
          {indianCounts.map(c => (
            <div className="count-card" key={c.what}>
              <div className="count-icon">{c.icon}</div>
              <div className="count-num">{c.n.toLocaleString("en-IN")}</div>
              <div className="count-what">{c.what}</div>
              <div className="count-ctx">{c.ctx}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Time breakdown */}
      <TimeBreakdown weeksLeft={weeksLeft} />

      {/* Message */}
      <section className="message-section">
        <div className="message-box">
          <div className="message-label">A note for {name}</div>
          <p className="message-text">{msg}</p>
        </div>
      </section>

      <DevCredit position="bottom" />
    </div>
  );
}

export default function App() {
  const [userData, setUserData] = useState(null);
  return userData
    ? <Dashboard data={userData} onBack={() => setUserData(null)} />
    : <Setup onSubmit={setUserData} />;
}
