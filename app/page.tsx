"use client";

import { useEffect, useMemo, useState } from "react";
import { demoClubContexts, getDemoCoachOutput } from "./lib/coach-ai";

type FormData = {
  clubName: string;
  studentName: string;
  email: string;
  phone: string;
  advisorName: string;
  advisorEmail: string;
  eventName: string;
  eventType: string;
  guestSpeaker: boolean;
  rsvpPlan: string;
  eventDetails: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  locationType: string;
  roomNeeds: string[];
  accessibility: string;
  food: string;
  foodOther: string;
  dietary: string[];
  budget: string;
  submissionDate: string;
  setupTime: string;
  secondDate: string;
  secondStartTime: string;
  secondEndTime: string;
  secondLocation: string;
  setCertified: string;
  eventCategory: string;
  eventPurpose: string;
  coSponsorClubs: string;
  coSponsorDepartments: string;
  secondaryContactName: string;
  secondaryContactEmail: string;
  secondaryContactPhone: string;
  learningCategory: string;
  skill1: string;
  skill2: string;
  skill3: string;
  supplyCost: string;
  foodCost: string;
  newEquipmentCost: string;
  rentalEquipmentCost: string;
  laborCost: string;
  notes: string;
};

const initialData: FormData = {
  clubName: "",
  studentName: "",
  email: "",
  phone: "",
  advisorName: "",
  advisorEmail: "",
  eventName: "",
  eventType: "Regular club meeting",
  guestSpeaker: false,
  rsvpPlan: "Not sure yet",
  eventDetails: "",
  date: "",
  startTime: "",
  endTime: "",
  attendees: 25,
  locationType: "Classroom-style room",
  roomNeeds: [],
  accessibility: "",
  food: "No food needed",
  foodOther: "",
  dietary: [],
  budget: "",
  submissionDate: new Date().toISOString().slice(0, 10),
  setupTime: "",
  secondDate: "",
  secondStartTime: "",
  secondEndTime: "",
  secondLocation: "",
  setCertified: "No",
  eventCategory: "Clubs & Organization Involvement",
  eventPurpose: "",
  coSponsorClubs: "",
  coSponsorDepartments: "",
  secondaryContactName: "",
  secondaryContactEmail: "",
  secondaryContactPhone: "",
  learningCategory: "",
  skill1: "",
  skill2: "",
  skill3: "",
  supplyCost: "",
  foodCost: "",
  newEquipmentCost: "",
  rentalEquipmentCost: "",
  laborCost: "",
  notes: "",
};

const steps = [
  ["Club details", "Tell us who’s planning"],
  ["Event basics", "Date, time & attendance"],
  ["Space & setup", "Find the right room"],
  ["Food & supplies", "Plan what you’ll need"],
  ["Budget", "Funding & request details"],
  ["Your plan", "Review next steps"],
];

const fieldLabels: Record<string, string> = {
  clubName: "Club or organization name",
  studentName: "Your full name",
  email: "RVCC email address",
  phone: "Best phone number",
  advisorName: "Club advisor’s name",
  advisorEmail: "Advisor’s email",
  eventName: "Event name",
  date: "Preferred date",
  startTime: "Start time",
  endTime: "End time",
  attendees: "Expected attendance",
  budget: "Estimated budget",
};

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

const setupSteps = ["Club identity", "Constitution", "Cabinet", "Faculty advisor", "Finances", "Goals & needs", "Past events", "Review"];
const goalOptions = ["Recruit new members", "Increase returning attendance", "Restart the club", "Fill vacant officer roles", "Improve officer accountability", "Create one strong signature event", "Collaborate with another club", "Build community", "Offer career development", "Offer academic enrichment", "Celebrate culture", "Complete a service project", "Raise funds", "Improve meetings", "Update the constitution", "Prepare elections", "Train future officers", "Improve advisor communication", "Use the budget effectively"];
const challengeOptions = ["Low membership", "Many interested students but few active members", "Inconsistent attendance", "No predictable meeting schedule", "Officer vacancies", "Unequal workload", "Poor communication", "Limited advisor involvement", "Lack of event ideas", "Limited funds", "Unused funds", "Constitution problems", "Upcoming officer graduation", "No event history", "Low event turnout", "Weak member retention"];

function ClubSetupWizard({ setup, setSetup, step, setStep, onSave, onExit, onGenerate, savedNotice }: any) {
  const update = (key: string, value: unknown) => setSetup((current: any) => ({ ...current, [key]: value }));
  const toggle = (key: "goals" | "challenges", value: string, max?: number) => setSetup((current: any) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item: string) => item !== value) : max && current[key].length >= max ? current[key] : [...current[key], value] }));
  const available = Math.max(0, (Number(setup.balance) || 0) - (Number(setup.committedFunds) || 0) - (Number(setup.pendingExpenses) || 0));
  return <div className="setupExperience">
    <div className="setupHeader"><div><p className="eyebrow dark">CLUB SETUP</p><h2>{setupSteps[step]}</h2><span>Step {step + 1} of 8 · Your draft saves on this device.</span></div><div><button onClick={onSave}>Save progress</button><button onClick={onExit}>Save and exit</button></div></div>
    {savedNotice && <div className="saveToast">✓ Draft saved</div>}
    <div className="setupProgress"><div><span style={{ width: `${((step + 1) / 8) * 100}%` }} /></div><ol>{setupSteps.map((label, index) => <li key={label} className={index === step ? "active" : index < step ? "done" : ""}><button onClick={() => index <= step && setStep(index)}><b>{index < step ? "✓" : index + 1}</b><span>{label}</span></button></li>)}</ol></div>
    <div className="setupBody">
      {step === 0 && <><div className="setupTitle"><h3>Let’s identify your club.</h3><p>An estimate is fine. Choose “I’m not sure” when Student Life should verify something.</p></div><div className="setupFormGrid"><label><span>Official club name</span><input value={setup.officialName} onChange={(e) => update("officialName", e.target.value)} placeholder="e.g., Philosophy Club" /></label><label><span>Common or abbreviated name</span><input value={setup.shortName} onChange={(e) => update("shortName", e.target.value)} placeholder="Optional" /></label><label><span>Club category</span><select value={setup.category} onChange={(e) => update("category", e.target.value)}><option>Academic</option><option>Academic and career</option><option>Cultural</option><option>Service</option><option>Pre-professional</option><option>Special interest</option><option>Other</option></select></label><label><span>Current activity status</span><select value={setup.status} onChange={(e) => update("status", e.target.value)}><option>New</option><option>Restarting</option><option>Active</option><option>Temporarily inactive</option><option>I'm not sure</option></select></label><label className="wide"><span>Mission or purpose</span><textarea value={setup.mission} onChange={(e) => update("mission", e.target.value)} placeholder="What does your club exist to do for students?" /></label><label><span>Active members</span><input type="number" min="0" value={setup.activeMembers} onChange={(e) => update("activeMembers", e.target.value)} /></label><label><span>Typical meeting frequency</span><select value={setup.meetingFrequency} onChange={(e) => update("meetingFrequency", e.target.value)}><option>Weekly</option><option>Every other week</option><option>Monthly</option><option>As needed</option><option>I'm not sure</option></select></label><label><span>Typical meeting location</span><input value={setup.meetingLocation} onChange={(e) => update("meetingLocation", e.target.value)} /></label><label><span>Recognized by Student Life?</span><select value={setup.recognized} onChange={(e) => update("recognized", e.target.value)}><option>Yes</option><option>No</option><option>I'm not sure</option><option>Ask Student Life to verify</option></select></label><label className="uploadPlaceholder"><span>Club logo</span><button type="button">＋ Add logo or use placeholder</button></label></div></>}
      {step === 1 && <><div className="setupTitle"><h3>Tell us about your constitution.</h3><p>Your constitution defines how your cabinet and club governance should work.</p></div><div className="constitutionChoices">{["Upload constitution", "Paste constitution text", "Select one stored by Student Life", "We have one, but I do not have it", "We need to create or update one"].map((option) => <button key={option} className={setup.constitutionStatus === option ? "active" : ""} onClick={() => update("constitutionStatus", option)}>{option}</button>)}</div>{setup.constitutionStatus === "Upload constitution" && <label className="documentDrop"><input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => update("constitutionTitle", e.target.files?.[0]?.name || "")} /><span>PDF, DOCX, or text · demo stores document metadata</span></label>}{setup.constitutionStatus === "Paste constitution text" && <label className="setupWideField"><span>Constitution text</span><textarea value={setup.constitutionText} onChange={(e) => update("constitutionText", e.target.value)} placeholder="Paste constitution text here…" /></label>}<div className="constitutionExtract"><div><span>AI EXTRACTION PREVIEW</span><h4>Governance items to verify</h4><p>President · Vice President · Secretary · annual elections · advisor review · majority vote</p></div><label><input type="checkbox" checked={setup.constitutionVerified} onChange={(e) => update("constitutionVerified", e.target.checked)} /> I reviewed this draft extraction</label><small>AI extracted this information from the constitution. Please verify it before it is treated as a club rule.</small></div></>}
      {step === 2 && <><div className="setupTitle"><h3>Build your cabinet.</h3><p>Keep required positions visible even when vacant. Add custom or co-officer roles when your constitution allows them.</p></div><div className="cabinetTable"><div className="cabinetRow head"><span>Position</span><span>Student</span><span>Status</span><span>Constitution duty</span><span>Semester assignment</span></div>{setup.officers.map((officer: any, index: number) => <div className="cabinetRow" key={`${officer.role}-${index}`}><input value={officer.role} onChange={(e) => update("officers", setup.officers.map((item: any, i: number) => i === index ? { ...item, role: e.target.value } : item))} /><input value={officer.name} onChange={(e) => update("officers", setup.officers.map((item: any, i: number) => i === index ? { ...item, name: e.target.value } : item))} placeholder="Student name" /><select value={officer.status} onChange={(e) => update("officers", setup.officers.map((item: any, i: number) => i === index ? { ...item, status: e.target.value } : item))}><option>Filled</option><option>Vacant</option><option>Acting</option><option>Pending election</option><option>N/A</option></select><textarea value={officer.duty} onChange={(e) => update("officers", setup.officers.map((item: any, i: number) => i === index ? { ...item, duty: e.target.value } : item))} /><textarea value={officer.assignment} onChange={(e) => update("officers", setup.officers.map((item: any, i: number) => i === index ? { ...item, assignment: e.target.value } : item))} /></div>)}</div><button className="addRowButton" onClick={() => update("officers", [...setup.officers, { role: "Custom position", name: "", status: "Vacant", duty: "", assignment: "", required: false }])}>＋ Add cabinet position</button><div className="sourceLegend"><span>From constitution</span><span>Student-entered</span><span>AI recommendation after review</span></div></>}
      {step === 3 && <><div className="setupTitle"><h3>Add your faculty advisor.</h3><p>Advisors can review plans and leave guidance without replacing student leadership.</p></div><div className="setupFormGrid"><label><span>Advisor name</span><input value={setup.advisorName} onChange={(e) => update("advisorName", e.target.value)} /></label><label><span>Advisor email</span><input type="email" value={setup.advisorEmail} onChange={(e) => update("advisorEmail", e.target.value)} /></label><label><span>Department</span><input value={setup.advisorDepartment} onChange={(e) => update("advisorDepartment", e.target.value)} /></label><label><span>Office</span><input value={setup.advisorOffice} onChange={(e) => update("advisorOffice", e.target.value)} /></label><label><span>Preferred involvement</span><select value={setup.advisorInvolvement} onChange={(e) => update("advisorInvolvement", e.target.value)}><option>Every meeting</option><option>Monthly check-in</option><option>Major events and decisions</option><option>As needed</option><option>I'm not sure</option></select></label><label className="wide"><span>Where would advisor support help most?</span><textarea value={setup.advisorSupport} onChange={(e) => update("advisorSupport", e.target.value)} placeholder="Event feasibility, campus connections, officer coaching…" /></label></div><div className="permissionNote"><b>Advisor permissions</b><span>Review and comment · confirm involvement · flag concerns · request Student Life help</span><small>Changes are visible in the collaboration log; advisors do not vote or replace officers.</small></div></>}
      {step === 4 && <><div className="setupTitle"><h3>Build your financial profile.</h3><p>Students may report an estimate. Only authorized staff can mark an official balance as verified.</p></div><div className="financeHero"><label><span>Current account balance</span><div>$ <input type="number" min="0" value={setup.balance} onChange={(e) => update("balance", e.target.value)} placeholder="0.00" /></div></label><label><span>Balance source</span><select value={setup.balanceSource} onChange={(e) => update("balanceSource", e.target.value)}><option>Student reported</option><option>Advisor reviewed</option><option>Student Life verified</option><option>Imported from official system</option><option>Demo data</option></select></label><span className="sourceBadge">{setup.balanceSource}</span></div><div className="setupFormGrid"><label><span>Committed funds</span><input type="number" min="0" value={setup.committedFunds} onChange={(e) => update("committedFunds", e.target.value)} /></label><label><span>Pending expenses</span><input type="number" min="0" value={setup.pendingExpenses} onChange={(e) => update("pendingExpenses", e.target.value)} /></label><label><span>Semester allocation</span><input type="number" min="0" value={setup.allocation} onChange={(e) => update("allocation", e.target.value)} /></label><label><span>Balance last checked</span><input type="date" value={setup.balanceDate} onChange={(e) => update("balanceDate", e.target.value)} /></label></div><div className="balanceEquation"><span><small>Current balance</small><strong>${Number(setup.balance || 0).toFixed(2)}</strong></span><b>−</b><span><small>Committed + pending</small><strong>${((Number(setup.committedFunds) || 0) + (Number(setup.pendingExpenses) || 0)).toFixed(2)}</strong></span><b>=</b><span><small>Estimated available</small><strong>${available.toFixed(2)}</strong></span></div><p className="estimateWarning">Estimated funds are not official until verified by Student Life.</p></>}
      {step === 5 && <><div className="setupTitle"><h3>Choose this semester’s priorities.</h3><p>Select up to five primary goals, then identify the challenges the coach should solve with you.</p></div><h4 className="selectionHeading">Primary goals <span>{setup.goals.length}/5 selected</span></h4><div className="goalCards">{goalOptions.map((goal) => <button className={setup.goals.includes(goal) ? "active" : ""} onClick={() => toggle("goals", goal, 5)} key={goal}><span>{setup.goals.includes(goal) ? "✓" : "+"}</span>{goal}</button>)}</div><h4 className="selectionHeading">Current challenges</h4><div className="challengeChips">{challengeOptions.map((challenge) => <button className={setup.challenges.includes(challenge) ? "active" : ""} onClick={() => toggle("challenges", challenge)} key={challenge}>{challenge}</button>)}</div><label className="setupWideField"><span>What would success look like, and what obstacles should we plan around?</span><textarea value={setup.goalDetails} onChange={(e) => update("goalDetails", e.target.value)} /></label></>}
      {step === 6 && <><div className="setupTitle"><h3>Preserve what your club has learned.</h3><p>Past attendance, cost, workload, and feedback help the coach avoid repetitive or unrealistic ideas.</p></div>{setup.pastEvents.length === 0 ? <div className="emptyEvents"><span>◫</span><h4>No past events added yet.</h4><p>That’s okay for a new or restarting club.</p></div> : <div className="eventArchive">{setup.pastEvents.map((event: any, index: number) => <article key={`${event.title}-${index}`}><div><h4>{event.title || "Untitled event"}</h4><span>{event.date || "No date"}</span></div><p>{event.attendance || 0} attendees · ${event.cost || 0} actual cost · Repeat: {event.repeat}</p><small>Worked: {event.worked || "Not entered"}</small><button onClick={() => update("pastEvents", setup.pastEvents.filter((_: any, i: number) => i !== index))}>Remove</button></article>)}</div>}<button className="addRowButton" onClick={() => update("pastEvents", [...setup.pastEvents, { title: "Past club event", date: "", attendance: "", cost: "", worked: "", improve: "", repeat: "Maybe" }])}>＋ Add past event</button>{setup.pastEvents.map((event: any, index: number) => <div className="pastEventForm" key={`form-${index}`}><input value={event.title} onChange={(e) => update("pastEvents", setup.pastEvents.map((item: any, i: number) => i === index ? { ...item, title: e.target.value } : item))} placeholder="Event title" /><input type="date" value={event.date} onChange={(e) => update("pastEvents", setup.pastEvents.map((item: any, i: number) => i === index ? { ...item, date: e.target.value } : item))} /><input type="number" value={event.attendance} onChange={(e) => update("pastEvents", setup.pastEvents.map((item: any, i: number) => i === index ? { ...item, attendance: e.target.value } : item))} placeholder="Actual attendance" /><input type="number" value={event.cost} onChange={(e) => update("pastEvents", setup.pastEvents.map((item: any, i: number) => i === index ? { ...item, cost: e.target.value } : item))} placeholder="Actual cost" /><input value={event.worked} onChange={(e) => update("pastEvents", setup.pastEvents.map((item: any, i: number) => i === index ? { ...item, worked: e.target.value } : item))} placeholder="What worked?" /><input value={event.improve} onChange={(e) => update("pastEvents", setup.pastEvents.map((item: any, i: number) => i === index ? { ...item, improve: e.target.value } : item))} placeholder="What should change?" /></div>)}</>}
      {step === 7 && <><div className="setupTitle"><h3>Review your club context.</h3><p>The coach will use this full profile to generate a personalized semester plan.</p></div><div className="reviewGrid"><article><span>CLUB IDENTITY</span><h4>{setup.officialName || "Club name needed"}</h4><p>{setup.status} · {setup.category} · {setup.activeMembers || 0} active members</p><button onClick={() => setStep(0)}>Edit</button></article><article><span>CONSTITUTION</span><h4>{setup.constitutionStatus}</h4><p>{setup.constitutionVerified ? "Student-reviewed extraction" : "Verification still needed"}</p><button onClick={() => setStep(1)}>Edit</button></article><article><span>CABINET</span><h4>{setup.officers.length} positions</h4><p>{setup.officers.filter((officer: any) => officer.status === "Vacant").length} vacant · {setup.officers.filter((officer: any) => officer.status === "Acting").length} acting</p><button onClick={() => setStep(2)}>Edit</button></article><article><span>FACULTY ADVISOR</span><h4>{setup.advisorName || "Advisor not entered"}</h4><p>{setup.advisorInvolvement}</p><button onClick={() => setStep(3)}>Edit</button></article><article><span>FINANCES</span><h4>${available.toFixed(2)} estimated available</h4><p>{setup.balanceSource}</p><button onClick={() => setStep(4)}>Edit</button></article><article><span>GOALS & CHALLENGES</span><h4>{setup.goals.length} primary goals</h4><p>{setup.challenges.length} challenges identified</p><button onClick={() => setStep(5)}>Edit</button></article><article><span>EVENT HISTORY</span><h4>{setup.pastEvents.length} past events</h4><p>Institutional memory retained</p><button onClick={() => setStep(6)}>Edit</button></article></div><button className="generatePlanButton" onClick={() => { onSave(); onGenerate(); }}>Build my personalized club plan →</button></>}
    </div>
    <div className="setupFooter"><button onClick={() => step > 0 ? setStep(step - 1) : onExit()}>← Back</button><span>Autosaved draft · <button onClick={() => setStep(7)}>Review</button></span>{step < 7 && <button className="continueSetup" onClick={() => { onSave(); setStep(step + 1); window.scrollTo({ top: 250, behavior: "smooth" }); }}>Continue →</button>}</div>
  </div>;
}

export default function Home() {
  const [view, setView] = useState<"home" | "student" | "coach" | "staff">("home");
  const [coachGoal, setCoachGoal] = useState("");
  const [coachProfile, setCoachProfile] = useState("philosophy");
  const [coachTab, setCoachTab] = useState<"analysis" | "roadmap" | "events" | "officers" | "growth">("analysis");
  const [coachResponse, setCoachResponse] = useState("");
  const [coachFeedback, setCoachFeedback] = useState<Record<string, string>>({});
  const [coachMode, setCoachMode] = useState<"setup" | "samples" | "plan" | "advisor">("setup");
  const [setupStep, setSetupStep] = useState(0);
  const [savedNotice, setSavedNotice] = useState(false);
  const [clubSetup, setClubSetup] = useState({
    officialName: "", shortName: "", category: "Academic", description: "", mission: "", status: "New", year: "2026–2027", semester: "Fall 2026", activeMembers: "", interestedMembers: "", audience: "", email: "", social: "", clubPage: "", meetingFrequency: "Weekly", meetingLocation: "", recognized: "I'm not sure",
    constitutionStatus: "We have one, but I do not have it", constitutionText: "", constitutionTitle: "", constitutionVerified: false,
    officers: [{ role: "President", name: "", status: "Filled", duty: "Lead the club and coordinate with the advisor", assignment: "", required: true }, { role: "Vice President", name: "", status: "Vacant", duty: "Support the President", assignment: "", required: true }, { role: "Secretary", name: "", status: "Vacant", duty: "Maintain records and communication", assignment: "", required: true }],
    advisorName: "", advisorEmail: "", advisorDepartment: "", advisorOffice: "", advisorSupport: "", advisorInvolvement: "Monthly check-in",
    balance: "", balanceSource: "Student reported", committedFunds: "", pendingExpenses: "", allocation: "", balanceDate: "",
    goals: [] as string[], challenges: [] as string[], goalDetails: "",
    pastEvents: [] as Array<{ title: string; date: string; attendance: string; cost: string; worked: string; improve: string; repeat: string }>,
  });
  const [staffView, setStaffView] = useState<"all" | "fran" | "kiswah" | "alaysha">("all");
  const [staffClubFilter, setStaffClubFilter] = useState("All clubs");
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pizzaCount = Math.max(1, Math.ceil(data.attendees / 3));
  const budgetAmount = Number(data.budget.replace(/[^0-9.]/g, "")) || 0;
  const budgetBreakdownTotal = [data.supplyCost, data.foodCost, data.newEquipmentCost, data.rentalEquipmentCost, data.laborCost].reduce((sum, value) => sum + (Number(value) || 0), 0);
  const semester = data.date ? `${[0, 1, 2, 3, 4].includes(new Date(`${data.date}T12:00:00`).getMonth()) ? "Spring" : [5, 6, 7].includes(new Date(`${data.date}T12:00:00`).getMonth()) ? "Summer" : "Fall"} ${new Date(`${data.date}T12:00:00`).getFullYear()}` : "To be determined";
  const sampleCoachContext = demoClubContexts.find((club) => club.id === coachProfile) || demoClubContexts[0];
  const sampleCoachOutput = getDemoCoachOutput(sampleCoachContext.id);
  const customClubReady = coachMode === "plan" && Boolean(clubSetup.officialName);
  const activeCoachContext = customClubReady ? { ...sampleCoachContext, clubProfile: clubSetup.officialName, clubCategory: clubSetup.category, clubMission: clubSetup.mission || "Mission still being completed", clubStage: (clubSetup.status.toLowerCase() === "restarting" ? "restarting" : clubSetup.status.toLowerCase() === "new" ? "new" : "established") as "new" | "restarting" | "established", membershipMetrics: { interested: Number(clubSetup.interestedMembers) || 0, active: Number(clubSetup.activeMembers) || 0, returning: 0 }, officerRoster: clubSetup.officers.filter((officer: any) => officer.status !== "N/A").map((officer: any) => ({ role: `${officer.role}${officer.name ? ` · ${officer.name}` : ""}`, status: officer.status.toLowerCase(), strength: officer.assignment || "To be assessed" })), vacantRoles: clubSetup.officers.filter((officer: any) => officer.status === "Vacant").map((officer: any) => officer.role), advisorInformation: clubSetup.advisorName ? `${clubSetup.advisorName} · ${clubSetup.advisorInvolvement}` : "Advisor information is missing", identifiedWeaknesses: clubSetup.challenges.length ? clubSetup.challenges : ["Challenges not yet confirmed"], semesterGoals: clubSetup.goals.length ? clubSetup.goals : ["Goals not yet confirmed"], priorEvents: clubSetup.pastEvents.map((event: any) => event.title), eventAttendance: clubSetup.pastEvents.map((event: any) => Number(event.attendance) || 0), availableBudget: Math.max(0, (Number(clubSetup.balance) || 0) - (Number(clubSetup.committedFunds) || 0) - (Number(clubSetup.pendingExpenses) || 0)) } : sampleCoachContext;
  const activeCoachOutput = customClubReady ? { ...sampleCoachOutput, identitySummary: `${clubSetup.officialName} is a ${clubSetup.status.toLowerCase()} ${clubSetup.category.toLowerCase()} club with ${clubSetup.activeMembers || 0} active members, ${clubSetup.interestedMembers || 0} interested students, ${activeCoachContext.vacantRoles.length} vacant cabinet role${activeCoachContext.vacantRoles.length === 1 ? "" : "s"}, and approximately $${activeCoachContext.availableBudget.toFixed(2)} available based on a ${clubSetup.balanceSource.toLowerCase()} balance. The plan prioritizes ${clubSetup.goals.slice(0, 3).join(", ") || "confirming clear semester goals"} while addressing ${clubSetup.challenges.slice(0, 2).join(" and ") || "the challenges still being identified"}.`, strengths: [`Mission focus: ${clubSetup.mission || "Still being clarified"}`, `${clubSetup.activeMembers || 0} active and ${clubSetup.interestedMembers || 0} interested members`, clubSetup.advisorName ? `Advisor connection with ${clubSetup.advisorName}` : "Opportunity to confirm advisor support"], weaknesses: clubSetup.challenges.length ? clubSetup.challenges.slice(0, 3) : ["No challenges confirmed yet"], coachAnswer: `For ${clubSetup.officialName}, the most useful next step is to focus on ${clubSetup.goals[0]?.toLowerCase() || "one clear semester goal"}. That recommendation accounts for ${clubSetup.activeMembers || 0} active members, ${activeCoachContext.vacantRoles.length} cabinet vacancies, and about $${activeCoachContext.availableBudget.toFixed(2)} available.` } : sampleCoachOutput;

  useEffect(() => {
    const saved = window.localStorage.getItem("rvplan-club-setup-demo");
    if (saved) {
      try { setClubSetup(JSON.parse(saved)); } catch { /* ignore an invalid device-local draft */ }
    }
  }, []);

  const saveClubDraft = () => {
    window.localStorage.setItem("rvplan-club-setup-demo", JSON.stringify(clubSetup));
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  };

  const roomRecommendation = useMemo(() => {
    if (data.locationType === "Outdoor space") return "Campus outdoor area + weather backup room";
    if (data.locationType === "Large gathering space" || data.attendees > 75) return "Conference Center or large multipurpose room";
    if (data.locationType === "Open lounge / social space" || data.attendees > 35) return "Bateman Student Center lounge or multipurpose space";
    return "Classroom or small meeting room";
  }, [data.attendees, data.locationType]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => current.filter((field) => field !== key));
  };

  const toggleArray = (key: "roomNeeds" | "dietary", value: string) => {
    const current = data[key];
    update(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const next = () => {
    const requiredByStep = [
      ["clubName", "studentName", "email", "advisorName"],
      ["eventName", "date", "startTime", "endTime", "attendees"],
      [],
      [],
    ];
    const missing = (requiredByStep[step] || []).filter((key) => !data[key as keyof FormData]);
    if (missing.length) {
      setErrors(missing);
      document.querySelector(`[name="${missing[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors([]);
    if (step === 3 && !data.eventPurpose) setData((current) => ({ ...current, eventPurpose: current.eventDetails }));
    setStep((current) => Math.min(5, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpTo = (target: number) => {
    if (target <= step) setStep(target);
  };

  const input = (key: keyof FormData, type = "text", placeholder = "") => (
    <label className="field">
      <span>{fieldLabels[key]}{["clubName", "studentName", "email", "advisorName", "eventName", "date", "startTime", "endTime", "attendees"].includes(key) && <b> *</b>}</span>
      <input
        name={key}
        type={type}
        value={data[key] as string | number}
        min={type === "number" ? 1 : undefined}
        placeholder={placeholder}
        className={errors.includes(key) ? "error" : ""}
        onChange={(event) => update(key, (type === "number" ? Number(event.target.value) : event.target.value) as never)}
      />
      {errors.includes(key) && <small>Please complete this field.</small>}
    </label>
  );

  return (
    <main className={`app view-${view} coach-${coachMode}`}>
      <header className="hero">
        <nav className="topbar" aria-label="Main navigation">
          <button className="brand homeBrand" onClick={() => setView("home")}>
            <span className="logoBox"><img src="/rvcc-logo.png" alt="RVCC lion logo" /></span>
            <span><strong>RVplan</strong><small>Raritan Valley · Student Life</small></span>
          </button>
          <div className="navActions">
            {view !== "home" && <button className="navHome" onClick={() => setView("home")}>Home</button>}
            <a href="https://www.raritanval.edu/student-experience/student-involvement/" target="_blank" rel="noreferrer">Explore student life</a>
            <button className="helpButton" onClick={() => setHelpOpen(true)}><Icon>✦</Icon> Talk to Student Life</button>
          </div>
        </nav>
        <div className="heroCopy">
          <p className="eyebrow">RVplan · {view === "home" ? "Tools for student club leaders" : view === "student" ? "Student club event request" : view === "coach" ? "AI-powered club leadership coach" : "Student Life staff demo"}</p>
          <h1>{view === "home" ? <>Plan events.<br />Build stronger clubs.</> : view === "student" ? <>Plan your club event<br />with confidence.</> : view === "coach" ? <>Start your term<br />with a clear plan.</> : <>Manage student events<br />in one place.</>}</h1>
          <p>{view === "home" ? "Plan an event or organize your club’s semester." : view === "student" ? "Answer a few questions. Get a clear event checklist." : view === "coach" ? "Set goals, organize officers, and plan the semester." : "Review club requests and see what needs attention."}</p>
        </div>
        <div className="heroStamp" aria-hidden="true"><span>PLAN</span><strong>IT!</strong></div>
      </header>

      {view === "home" ? <section className="homeWorkspace" aria-label="RVplan tools">
        <div className="homeIntro"><p className="eyebrow dark">GET STARTED</p><h2>What do you want to do?</h2></div>
        <div className="toolChoices">
          <div className="homeToolGroup"><button className="toolCard eventTool" onClick={() => { setStep(0); setView("student"); }}><span className="toolIcon">✦</span><div><small>EVENT PLANNER</small><h3>Plan an event</h3><p>Answer a few questions to get guidance for your room, food, budget, and approvals.</p><strong>Start planning <b>→</b></strong></div></button><div className="demoLinks"><button onClick={() => setView("staff")}>Staff demo</button></div></div>
          <div className="homeToolGroup"><button className="toolCard coachTool" onClick={() => { setSetupStep(0); setCoachMode("setup"); setView("coach"); }}><span className="toolIcon">◎</span><div><small>CLUB LEADERSHIP</small><h3>AI Leadership Coach</h3><p>Get personalized guidance to organize officers, set goals, and build your semester plan.</p><strong>Start coaching <b>→</b></strong></div></button><div className="demoLinks"><button onClick={() => { setCoachMode("samples"); setView("coach"); }}>Browse sample clubs</button><button onClick={() => { setCoachMode("advisor"); setView("coach"); }}>Faculty advisor demo</button></div></div>
        </div>
      </section> : view === "student" ? <section className="workspace" aria-label="Event planning form">
        <div className="progressHeader">
          <div className="progressMeta"><strong>Step {step + 1} of 6</strong><span>{Math.round(((step + 1) / 6) * 100)}% complete</span></div>
          <div className="progressBar"><span style={{ width: `${((step + 1) / 6) * 100}%` }} /></div>
          <ol className="stepList">
            {steps.map(([title], index) => (
              <li key={title} className={index === step ? "active" : index < step ? "done" : ""}>
                <button onClick={() => jumpTo(index)} disabled={index > step} aria-current={index === step ? "step" : undefined}>
                  <span>{index < step ? "✓" : index + 1}</span>{title}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="contentGrid">
          <section className="formCard">
            {step === 0 && <>
              <div className="sectionHeading"><span className="sectionIcon">♣</span><div><p>First things first</p><h2>Let’s start with your club.</h2><span>This helps Student Life know who to follow up with.</span></div></div>
              <div className="formGrid">
                {input("clubName", "text", "e.g., Engineering Club")}
                {input("studentName", "text", "First and last name")}
                {input("email", "email", "you@stu.raritanval.edu")}
                {input("phone", "tel", "(908) 555-0123")}
                {input("advisorName", "text", "Advisor’s full name")}
                {input("advisorEmail", "email", "advisor@raritanval.edu")}
              </div>
            </>}

            {step === 1 && <>
              <div className="sectionHeading"><span className="sectionIcon">⌁</span><div><p>Shape the idea</p><h2>Tell us about your event.</h2><span>An estimate is fine—you can confirm details with staff later.</span></div></div>
              <div className="formGrid">
                {input("eventName", "text", "e.g., Game Night & Pizza")}
                <label className="field"><span>Event type</span><select value={data.eventType} onChange={(e) => update("eventType", e.target.value)}><option>Regular club meeting</option><option>Formal showcase</option><option>Performance</option><option>Bake sale</option><option>Fundraiser</option><option>Field trip</option><option>Off-campus event</option><option>Workshop</option><option>Holiday celebration</option><option>Cultural celebration</option><option>Movie night</option><option>Other</option></select></label>
                <label className="field guestSpeakerField"><span>Guest speaker</span><span className={`guestSpeakerControl ${data.guestSpeaker ? "selected" : ""}`}><input type="checkbox" checked={data.guestSpeaker} onChange={(e) => update("guestSpeaker", e.target.checked)} /><span className="guestCheck">✓</span><strong>{data.guestSpeaker ? "Guest speaker included" : "Include a guest speaker"}</strong></span></label>
                {input("date", "date")}
                {input("attendees", "number")}
                {input("startTime", "time")}
                {input("endTime", "time")}
                <label className="field"><span>Do you plan to collect RSVPs?</span><select value={data.rsvpPlan} onChange={(e) => update("rsvpPlan", e.target.value)}><option>Yes, we’ll send an RSVP</option><option>No, this will be open attendance</option><option>Not sure yet</option></select><em>For larger events, we recommend collecting RSVPs so you can plan the room, food, and supplies.</em></label>
                <label className="field full"><span>Extra event details</span><textarea value={data.eventDetails} onChange={(e) => update("eventDetails", e.target.value)} placeholder="Share the theme, planned activities, special guests, travel plans, or anything else Student Life should know…" /></label>
              </div>
            </>}

            {step === 2 && <>
              <div className="sectionHeading"><span className="sectionIcon">⌂</span><div><p>Choose your setting</p><h2>What kind of space works best?</h2><span>We’ll turn your answers into a room recommendation.</span></div></div>
              <div className="choiceGrid">
                {["Classroom-style room", "Open lounge / social space", "Large gathering space", "Outdoor space"].map((option) => <label className={`choiceCard ${data.locationType === option ? "selected" : ""}`} key={option}><input type="radio" name="locationType" checked={data.locationType === option} onChange={() => update("locationType", option)} /><span className="choiceMark">{option.includes("Classroom") ? "▤" : option.includes("Outdoor") ? "☀" : option.includes("Large") ? "◎" : "◫"}</span><strong>{option}</strong></label>)}
              </div>
              <h3 className="miniHeading">What does the room need?</h3>
              <div className="checkGrid">
                {["Projector / screen", "Microphones", "Moveable tables", "Extra chairs", "Stage or performance area", "Power access"].map((option) => <label key={option}><input type="checkbox" checked={data.roomNeeds.includes(option)} onChange={() => toggleArray("roomNeeds", option)} /><span>✓</span>{option}</label>)}
              </div>
              <label className="field full"><span>Accessibility or setup notes</span><textarea value={data.accessibility} onChange={(e) => update("accessibility", e.target.value)} placeholder="Wheelchair access, quiet space, special seating, loading needs…" /></label>
              <div className="recommendation"><Icon>★</Icon><div><small>YOUR ROOM MATCH</small><strong>{roomRecommendation}</strong><p>Student Life will confirm availability and the exact room.</p></div></div>
            </>}

            {step === 3 && <>
              <div className="sectionHeading"><span className="sectionIcon">◒</span><div><p>Feed the crowd</p><h2>Food, drinks, and supplies.</h2><span>We’ll estimate quantities from your expected attendance.</span></div></div>
              <div className="choiceGrid three foodChoices">
                {["No food needed", "Pizza", "Snacks & drinks", "Order from the cafeteria", "Other food"].map((option) => <label className={`choiceCard ${data.food === option ? "selected" : ""}`} key={option}><input type="radio" name="food" checked={data.food === option} onChange={() => update("food", option)} /><span className="choiceMark">{option === "Pizza" ? "◔" : option.includes("Snacks") ? "▣" : option.includes("cafeteria") ? "▤" : option === "Other food" ? "+" : "—"}</span><strong>{option}</strong></label>)}
              </div>
              {data.food === "Other food" && <label className="field full otherFoodField"><span>Restaurant or food order</span><input value={data.foodOther} onChange={(e) => update("foodOther", e.target.value)} placeholder="e.g., sandwiches from a local restaurant" /></label>}
              {data.food === "Pizza" && <div className="foodEstimate"><div><small>For {data.attendees} guests, plan for about</small><strong>{pizzaCount} large pizzas</strong><span>Assumes 8 slices per pizza and about 2.5 slices per guest.</span></div></div>}
              {data.food !== "No food needed" && data.food !== "Pizza" && <div className="recommendation foodGuidance"><Icon>i</Icon><div><small>FOOD ORDER GUIDANCE</small><strong>{data.food === "Snacks & drinks" ? "Plan snacks and drinks with Student Life" : data.food === "Order from the cafeteria" ? "Confirm your cafeteria order" : "Confirm your custom food order"}</strong><p>{data.food === "Order from the cafeteria" ? "Ask about the menu, lead time, payment, and ordering process." : data.food === "Other food" ? "Ask about restaurant approval, delivery, payment, and dietary needs." : "Confirm approved items, payment, delivery, and dietary needs before ordering."}</p></div></div>}
              <h3 className="miniHeading">Dietary needs to plan for</h3>
              <div className="checkGrid">
                {["Vegetarian", "Vegan", "Gluten-free", "Halal", "Kosher", "Nut allergy"].map((option) => <label key={option}><input type="checkbox" checked={data.dietary.includes(option)} onChange={() => toggleArray("dietary", option)} /><span>✓</span>{option}</label>)}
              </div>
              <label className="field full topGap"><span>Anything else you need?</span><input value={data.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Decorations, signs, games…" /></label>
            </>}

            {step === 4 && <>
              <div className="sectionHeading"><span className="sectionIcon">$</span><div><p>Plan the funding</p><h2>Build your budget proposal.</h2><span>Enter $0 if no funding is needed. A detailed proposal opens when the estimate is above $0.</span></div></div>
              <label className="field budgetAmount"><span>Estimated budget</span><span className="moneyInput"><b>$</b><input name="budget" type="number" min="0" step="0.01" value={data.budget} onChange={(e) => update("budget", e.target.value)} placeholder="0.00" /></span></label>
              {budgetAmount === 0 && <div className="noBudget"><Icon>✓</Icon><div><strong>No budget request needed</strong><p>You can continue to your plan. Change the amount above if your event needs funding.</p></div></div>}
              {budgetAmount > 0 && <div className="budgetRequest">
                <div className="budgetFormHeader"><span>RVplan · RVCC Student Life</span><strong>Club / Organization Budget Proposal</strong><p>Events & Projects</p></div>
                <div className="budgetBanner"><div><small>ESTIMATED REQUEST</small><strong>${budgetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div><span>We preloaded everything you already shared.</span></div>
                <h3 className="budgetSectionTitle">Event information</h3>
                <div className="preloadedGrid">
                  <div><small>Sponsoring organization</small><strong>{data.clubName}</strong></div><div><small>Submission date</small><strong>{data.submissionDate}</strong></div>
                  <div><small>Event name</small><strong>{data.eventName}</strong></div><div><small>Event date</small><strong>{data.date}</strong></div>
                  <div><small>Event type</small><strong>{data.eventType}</strong></div><div><small>Expected attendance</small><strong>{data.attendees}</strong></div>
                  <div><small>Event category</small><strong>{data.eventCategory}</strong></div><div><small>Student Engagement Transcript Certified?</small><strong>{data.setCertified}</strong></div>
                  <div><small>Event time</small><strong>{data.startTime}–{data.endTime}</strong></div><div><small>Semester & year</small><strong>{semester}</strong></div>
                  <div><small>Recommended location</small><strong>{roomRecommendation}</strong></div><div><small>Food plan</small><strong>{data.food === "Other food" ? data.foodOther || "Custom order" : data.food}</strong></div>
                  <div><small>Primary contact</small><strong>{data.studentName} · {data.email}{data.phone ? ` · ${data.phone}` : ""}</strong></div><div><small>Club advisor</small><strong>{data.advisorName}{data.advisorEmail ? ` · ${data.advisorEmail}` : ""}</strong></div>
                  <div><small>Short event description</small><strong>{data.eventDetails || "Not provided"}</strong></div><div><small>RSVP plan</small><strong>{data.rsvpPlan}</strong></div>
                  <div><small>Guest speaker</small><strong>{data.guestSpeaker ? "Yes" : "No"}</strong></div><div><small>Room and setup needs</small><strong>{data.roomNeeds.length ? data.roomNeeds.join(", ") : "Standard setup"}</strong></div>
                  <div><small>Accessibility notes</small><strong>{data.accessibility || "None provided"}</strong></div><div><small>Dietary needs</small><strong>{data.dietary.length ? data.dietary.join(", ") : "None provided"}</strong></div>
                  <div><small>Additional supplies or needs</small><strong>{data.notes || "None provided"}</strong></div><div><small>Preferred location type</small><strong>{data.locationType}</strong></div>
                </div>
                <label className="field full"><span>Event purpose</span><textarea value={data.eventPurpose} onChange={(e) => update("eventPurpose", e.target.value)} placeholder="Explain why the event is being held, what students will learn, and how it supports the club or campus community." /></label>
                <div className="formGrid budgetFields">
                  <label className="field"><span>Setup time</span><input type="time" value={data.setupTime} onChange={(e) => update("setupTime", e.target.value)} /></label>
                  <label className="field"><span>Event category</span><select value={data.eventCategory} onChange={(e) => update("eventCategory", e.target.value)}><option>Clubs & Organization Involvement</option><option>Academic enrichment</option><option>Civic engagement</option><option>Cultural engagement</option><option>Leadership development</option><option>Health & wellness</option><option>Other</option></select></label>
                  <label className="field"><span>Student Engagement Transcript Certified?</span><select value={data.setCertified} onChange={(e) => update("setCertified", e.target.value)}><option>No</option><option>Yes</option><option>Not sure</option></select></label>
                </div>
                <h3 className="budgetSectionTitle">Second-choice schedule</h3>
                <div className="formGrid budgetFields">
                  <label className="field"><span>Second-choice date</span><input type="date" value={data.secondDate} onChange={(e) => update("secondDate", e.target.value)} /></label>
                  <label className="field"><span>Second-choice location</span><input value={data.secondLocation} onChange={(e) => update("secondLocation", e.target.value)} placeholder="Room or campus area" /></label>
                  <label className="field"><span>Second start time</span><input type="time" value={data.secondStartTime} onChange={(e) => update("secondStartTime", e.target.value)} /></label>
                  <label className="field"><span>Second end time</span><input type="time" value={data.secondEndTime} onChange={(e) => update("secondEndTime", e.target.value)} /></label>
                </div>
                <h3 className="budgetSectionTitle">Partners and contacts</h3>
                <div className="formGrid budgetFields">
                  <label className="field"><span>Co-sponsoring clubs / organizations</span><input value={data.coSponsorClubs} onChange={(e) => update("coSponsorClubs", e.target.value)} placeholder="Leave blank if none" /></label>
                  <label className="field"><span>Co-sponsoring departments</span><input value={data.coSponsorDepartments} onChange={(e) => update("coSponsorDepartments", e.target.value)} placeholder="Leave blank if none" /></label>
                  <label className="field"><span>Secondary contact name</span><input value={data.secondaryContactName} onChange={(e) => update("secondaryContactName", e.target.value)} /></label>
                  <label className="field"><span>Secondary contact email</span><input type="email" value={data.secondaryContactEmail} onChange={(e) => update("secondaryContactEmail", e.target.value)} /></label>
                  <label className="field"><span>Secondary contact phone</span><input type="tel" value={data.secondaryContactPhone} onChange={(e) => update("secondaryContactPhone", e.target.value)} /></label>
                  <label className="field"><span>Learning and Development Outcome Category</span><select value={data.learningCategory} onChange={(e) => update("learningCategory", e.target.value)}><option value="">Choose a category</option><option>Academic</option><option>Civic engagement</option><option>Leadership</option><option>Career readiness</option><option>Culture & belonging</option><option>Health & wellness</option></select></label>
                </div>
                <h3 className="budgetSectionTitle">Top 3 skills attendees will improve</h3>
                <p className="sectionExplainer">List three skills students are expected to strengthen by participating in this event—for example, leadership, teamwork, public speaking, diplomacy, or academic knowledge.</p>
                <div className="skillGrid"><label className="field"><span>Skill 1</span><input value={data.skill1} onChange={(e) => update("skill1", e.target.value)} placeholder="e.g., Academic" /></label><label className="field"><span>Skill 2</span><input value={data.skill2} onChange={(e) => update("skill2", e.target.value)} placeholder="e.g., Diplomacy" /></label><label className="field"><span>Skill 3</span><input value={data.skill3} onChange={(e) => update("skill3", e.target.value)} placeholder="e.g., Public relations" /></label></div>
                <h3 className="budgetSectionTitle">Budget breakdown</h3>
                <p className="sectionExplainer">Describe each component of the proposed budget. The itemized total should match the total budget requested above.</p>
                <div className="costGrid">
                  {[["supplyCost", "Supplies (decorations, etc.)"], ["foodCost", "Food"], ["newEquipmentCost", "New equipment (unusual)"], ["rentalEquipmentCost", "Rental equipment"], ["laborCost", "Independent labor (presenter fee)"]].map(([key, label]) => <label className="field" key={key}><span>{label}</span><span className="moneyInput"><b>$</b><input type="number" min="0" step="0.01" value={data[key as keyof FormData] as string} onChange={(e) => update(key as keyof FormData, e.target.value as never)} placeholder="0.00" /></span></label>)}
                </div>
                <div className={`budgetBalance ${Math.abs(budgetAmount - budgetBreakdownTotal) < .01 ? "balanced" : ""}`}><span>Breakdown total <strong>${budgetBreakdownTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span><span>{Math.abs(budgetAmount - budgetBreakdownTotal) < .01 ? "✓ Matches your estimate" : `$${Math.abs(budgetAmount - budgetBreakdownTotal).toFixed(2)} ${budgetBreakdownTotal < budgetAmount ? "left to assign" : "over estimate"}`}</span></div>
              </div>}
            </>}

            {step === 5 && <>
              <div className="sectionHeading"><span className="sectionIcon">✓</span><div><p>Your planning roadmap</p><h2>{submitted ? "Your request is ready." : "Review your event plan."}</h2><span>{submitted ? "Bring this plan to Student Life to start the official approval process." : "Check the details, then create your planning checklist."}</span></div></div>
              <div className="summaryHero"><div><small>{data.eventType.toUpperCase()}</small><h3>{data.eventName || "Your club event"}</h3><p>{data.clubName} · {data.date ? new Date(`${data.date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Date to be confirmed"} · {data.attendees} guests · {data.rsvpPlan}{data.guestSpeaker ? " · Guest speaker" : ""}</p></div><button onClick={() => setStep(1)}>Edit details</button></div>
              <div className="summaryGrid">
                <div><span className="summaryIcon">⌂</span><small>SPACE</small><strong>{roomRecommendation}</strong><p>{data.roomNeeds.length ? data.roomNeeds.join(" · ") : "Standard room setup"}</p></div>
                <div><span className="summaryIcon">◒</span><small>FOOD</small><strong>{data.food === "Pizza" ? `${pizzaCount} large pizzas` : data.food === "Snacks & drinks" ? "Snacks & drinks" : data.food === "Order from the cafeteria" ? "Cafeteria food order" : data.food === "Other food" ? data.foodOther || "Custom food order" : "No food requested"}</strong><p>{data.dietary.length ? `Plan for: ${data.dietary.join(", ")}` : "No dietary needs listed"}</p></div>
              </div>
              <div className="budgetSummary"><span>$</span><div><small>BUDGET</small><strong>{budgetAmount > 0 ? `$${budgetAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} estimated request` : "No funding requested"}</strong><p>{budgetAmount > 0 ? "Review the completed budget details with Student Life before making purchases." : "No budget request form is needed based on your estimate."}</p></div><button onClick={() => setStep(4)}>Edit budget</button></div>
              <div className="nextSteps">
                <div className="nextTitle"><span>YOUR NEXT STEPS</span><strong>Watch your RVCC email for approvals and confirmation.</strong></div>
                {[
                  ["1", "Review this plan with your club advisor", "Confirm the purpose, budget, date, and attendance estimate."],
                  ["2", "Look out for confirmation emails", "Student Government will email you about budget approval, and Student Life will email you to confirm your event booking."],
                  ["3", "Finalize details and promote your event", "After confirmation, finalize access, setup, cleanup, food delivery, and campus promotion."],
                ].map(([number, title, detail]) => <div className="nextRow" key={number}><span>{number}</span><div><strong>{title}</strong><p>{detail}</p></div><b>○</b></div>)}
              </div>
              {submitted && <div className="successNote"><Icon>✓</Icon><div><strong>Plan submitted</strong><p>Your plan has been submitted. Watch your RVCC email for next steps.</p></div></div>}
            </>}

            <div className="formFooter">
              <button className="backButton" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>← Back</button>
              <span>Your information stays on this device.</span>
              {step < 5 ? <button className="primaryButton" onClick={next}>Continue to {steps[step + 1][0].toLowerCase()} <span>→</span></button> : <div className="finalActions"><button className="printButton" onClick={() => window.print()}>Print plan</button><button className="primaryButton" onClick={() => setSubmitted(true)}>{submitted ? "Plan submitted ✓" : "Submit my plan →"}</button></div>}
            </div>
          </section>

        </div>
        <div className="compactHelpBar"><span className="helpIcon">?</span><div><strong>Need help planning?</strong><p>Student Life can help with rooms, funding, and approvals.</p></div><button onClick={() => setHelpOpen(true)}>Talk to staff <span>→</span></button></div>
      </section> : view === "coach" ? <section className="coachWorkspace personalizedCoach" aria-label="Club leadership coach">
        {coachMode === "setup" ? <ClubSetupWizard setup={clubSetup} setSetup={setClubSetup} step={setupStep} setStep={setSetupStep} onSave={saveClubDraft} onExit={() => { saveClubDraft(); setView("home"); }} onGenerate={() => setCoachMode("plan")} savedNotice={savedNotice} /> : coachMode === "advisor" ? <div className="advisorPortal">
          <div className="portalHeader"><button onClick={() => setView("home")}>← Back to tools</button><div><p className="eyebrow dark">FACULTY ADVISOR PORTAL · DEMO</p><h2>Advisor review center</h2><span>Review club information, leave guidance, and request Student Life support.</span></div><button onClick={() => setCoachMode("setup")}>View club profile →</button></div>
          <div className="advisorStats"><article><span>CLUBS ADVISED</span><strong>2</strong><small>1 needs review</small></article><article><span>AWAITING REVIEW</span><strong>3</strong><small>Constitution · event · budget</small></article><article><span>UPCOMING EVENTS</span><strong>2</strong><small>Next event in 18 days</small></article><article><span>VACANT REQUIRED ROLES</span><strong>2</strong><small>Student follow-up needed</small></article></div>
          <div className="advisorLayout"><section><p className="eyebrow dark">ITEMS AWAITING REVIEW</p><h3>{clubSetup.officialName || "Philosophy Club"}</h3>{[["Constitution extraction", clubSetup.constitutionVerified ? "Student reviewed" : "Needs verification"], ["Cabinet assignments", `${clubSetup.officers.filter((item: any) => item.status === "Vacant").length} vacancies`], ["Financial snapshot", `$${clubSetup.balance || "175"} · ${clubSetup.balanceSource}`], ["Semester goals", `${clubSetup.goals.length || 4} selected`]].map(([label, detail]) => <div className="advisorReviewItem" key={label}><span><strong>{label}</strong><small>{detail}</small></span><button>Review</button><button>Comment</button></div>)}</section><aside><p className="eyebrow dark">COLLABORATION LOG</p><h3>Recent updates</h3><ul><li><b>Student</b><span>Updated cabinet vacancies<small>Today · 10:42 AM</small></span></li><li><b>Advisor</b><span>Requested a regular meeting schedule<small>Yesterday · 3:15 PM</small></span></li><li><b>Student Life</b><span>Balance marked demo data<small>Sep 3 · 11:20 AM</small></span></li></ul><textarea placeholder="Add advisor guidance or a correction…" /><button>Add visible comment</button><button className="requestHelp">Request Student Life assistance</button></aside></div>
        </div> : <>
        {coachMode === "samples" && <div className="sampleBanner"><div><strong>Fictional sample clubs</strong><span>These demonstration profiles do not represent verified current RVCC club structures.</span></div><button onClick={() => { setSetupStep(0); setCoachMode("setup"); }}>Set up my own club →</button></div>}
        <div className="coachTop"><button onClick={() => setView("home")}>← Back to tools</button><span>STRUCTURED DEMO AI · PROFILE-SPECIFIC OUTPUT</span></div>
        <div className="profileSwitcher compactProfile"><div><p className="eyebrow dark">CLUB PLAN</p><h2>{activeCoachContext.clubProfile}</h2><span>Personalized guidance based on this club’s saved information.</span></div>{coachMode === "samples" && <label><span>Sample club</span><select value={coachProfile} onChange={(event) => { setCoachProfile(event.target.value); setCoachResponse(""); }}>{demoClubContexts.map((club) => <option key={club.id} value={club.id}>{club.clubProfile}</option>)}</select></label>}</div>
        <div className="contextStrip"><span><small>CLUB STAGE</small><strong>{activeCoachContext.clubStage}</strong></span><span><small>MEMBERS</small><strong>{activeCoachContext.membershipMetrics.active} active / {activeCoachContext.membershipMetrics.interested} interested</strong></span><span><small>OFFICERS</small><strong>{activeCoachContext.officerRoster.length} active · {activeCoachContext.vacantRoles.length} vacant</strong></span><span><small>BUDGET</small><strong>${activeCoachContext.availableBudget}</strong></span><span><small>WEEKS LEFT</small><strong>{activeCoachContext.weeksRemaining}</strong></span></div>
        <div className="coachShell">
          <nav className="coachTabs" aria-label="Coach results">{[["analysis", "Club analysis"], ["roadmap", "Roadmap"], ["events", "Event ideas"], ["officers", "Officer plan"], ["growth", "Recruitment & retention"]].map(([id, label]) => <button key={id} className={coachTab === id ? "active" : ""} onClick={() => setCoachTab(id as typeof coachTab)}>{label}</button>)}</nav>
          <div className="coachResult">
            <div className="aiResultHeader"><span>◎</span><div><small>DEMO AI RESPONSE · GENERATED FROM CLUB CONTEXT</small><h3>{activeCoachContext.clubProfile}</h3></div><b>Context validated</b></div>
            {coachTab === "analysis" && <div className="analysisView"><p className="identitySummary">{activeCoachOutput.identitySummary}</p><div className="analysisColumns"><section><h4>Current strengths</h4>{activeCoachOutput.strengths.map((item) => <p key={item}>✓ {item}</p>)}</section><section><h4>Most important weaknesses</h4>{activeCoachOutput.weaknesses.map((item) => <p key={item}>! {item}</p>)}</section><section><h4>Opportunities</h4>{activeCoachOutput.opportunities.map((item) => <p key={item}>→ {item}</p>)}</section></div><h4 className="resultSectionTitle">Three immediate priorities</h4><div className="recommendationGrid">{activeCoachOutput.priorities.map((item, index) => <article key={item.title}><span>{index + 1}</span><h4>{item.title}</h4><p>{item.concept}</p><div><small>WHY THIS FITS</small><strong>{item.whyItFits}</strong></div><dl><dt>Lead</dt><dd>{item.lead}</dd><dt>When</dt><dd>{item.timing}</dd><dt>Success</dt><dd>{item.successMeasure}</dd></dl><div className="feedbackRow"><button onClick={() => setCoachFeedback((current) => ({ ...current, [item.title]: "Added to plan" }))}>+ Add to plan</button><select value={coachFeedback[item.title] || ""} onChange={(event) => setCoachFeedback((current) => ({ ...current, [item.title]: event.target.value }))}><option value="">Give feedback</option><option>Save for later</option><option>Not relevant</option><option>Too expensive</option><option>Too difficult</option><option>Not enough members</option><option>Already tried this</option><option>Conflicts with our mission</option><option>Conflicts with our schedule</option></select></div>{coachFeedback[item.title] && <em>Saved: {coachFeedback[item.title]}</em>}</article>)}</div></div>}
            {coachTab === "roadmap" && <div className="roadmapView">{activeCoachOutput.roadmap.map((item, index) => <article key={item.title}><span>{index + 1}</span><div><h4>{item.title}</h4><p>{item.description}</p><small><b>Why now:</b> {item.rationale}</small><dl><dt>Owner</dt><dd>{item.assignedOfficerRole}</dd><dt>Due</dt><dd>{item.suggestedDueDate}</dd><dt>Effort</dt><dd>{item.estimatedEffort}</dd><dt>Success measure</dt><dd>{item.successMeasure}</dd></dl></div><b className="confidence">{Math.round(item.confidence * 100)}% confidence</b></article>)}</div>}
            {coachTab === "events" && <div className="eventIdeas">{activeCoachOutput.events.map((item) => <article key={item.title}><div><small>DEMO GENERATED CONCEPT</small><h4>{item.title}</h4><p>{item.concept}</p></div><div className="fitBox"><small>WHY THIS FITS THIS CLUB</small><p>{item.whyItFits}</p></div><dl><dt>Lead</dt><dd>{item.lead}</dd><dt>Lead time</dt><dd>{item.timing}</dd><dt>Budget</dt><dd>{item.budget}</dd><dt>Success</dt><dd>{item.successMeasure}</dd></dl><div className="feedbackRow"><button onClick={() => setCoachFeedback((current) => ({ ...current, [item.title]: "Added to plan" }))}>+ Add to plan</button><button onClick={() => setCoachFeedback((current) => ({ ...current, [item.title]: "Not enough members" }))}>Not enough members</button><button onClick={() => setCoachFeedback((current) => ({ ...current, [item.title]: "Too expensive" }))}>Too expensive</button></div>{coachFeedback[item.title] && <em>Coach memory saved: {coachFeedback[item.title]}</em>}</article>)}</div>}
            {coachTab === "officers" && <div className="officerPlanView"><p>{activeCoachOutput.identitySummary}</p>{activeCoachOutput.officerPlan.map((item) => <article key={item.role}><div><span>{item.role.slice(0, 1)}</span><h4>{item.role}</h4><b className={item.workload.includes("High") || item.workload.includes("risk") ? "warning" : ""}>{item.workload}</b></div><p><strong>Semester assignment:</strong> {item.assignment}</p><p><strong>Support plan:</strong> {item.support}</p></article>)}</div>}
            {coachTab === "growth" && <div className="growthView"><article><span>01</span><div><small>RECRUITMENT FUNNEL</small><h4>Move students from awareness to active ownership.</h4><p>{activeCoachOutput.recruitmentStrategy}</p><div className="funnel"><b>Awareness</b><i>→</i><b>Interest</b><i>→</i><b>First visit</b><i>→</i><b>Return</b><i>→</i><b>Active role</b><i>→</i><b>Leadership</b></div></div></article><article><span>02</span><div><small>RETENTION STRATEGY</small><h4>Address this club’s real participation gap.</h4><p>{activeCoachOutput.retentionStrategy}</p><div className="fitBox"><small>DIAGNOSTIC SIGNAL</small><p>{activeCoachContext.healthDiagnostic}</p></div></div></article></div>}
          </div>
          <aside className="coachSidePanel"><section className="askCoach"><p className="eyebrow dark">ASK YOUR COACH</p><h3>What do you need help with?</h3><div className="questionChips">{["What should we focus on this month?", "Give us event ideas under $200."].map((question) => <button key={question} onClick={() => setCoachGoal(question)}>{question}</button>)}</div><textarea value={coachGoal} onChange={(event) => setCoachGoal(event.target.value)} placeholder="Ask a club-specific question…" /><button onClick={() => setCoachResponse(activeCoachOutput.coachAnswer)}>Ask coach →</button>{coachResponse && <div className="coachAnswer"><small>DEMO AI RESPONSE</small><p>{coachResponse}</p></div>}</section><details className="savedContext"><summary>What the coach knows</summary><ul><li><span>Mission</span><strong>{activeCoachContext.clubMission}</strong></li><li><span>Challenges</span><strong>{activeCoachContext.identifiedWeaknesses.join(" · ")}</strong></li><li><span>Goals</span><strong>{activeCoachContext.semesterGoals.join(" · ")}</strong></li><li><span>Prior feedback</span><strong>{activeCoachContext.rejectedRecommendations.length ? `Rejected: ${activeCoachContext.rejectedRecommendations.join(", ")}` : "No rejected ideas yet"}</strong></li></ul><button>Edit club information</button></details></aside>
        </div>
        <div className="demoNote"><Icon>i</Icon><div><strong>Structured AI demo with safe fallback</strong><p>These profile-specific responses are validated mock outputs from the AI-service abstraction—not live AI. A configured service can replace the demo provider while preserving the same typed Club Context, structured outputs, feedback memory, and policy guardrails.</p></div></div>
        </>}
      </section> : <section className="staffWorkspace" aria-label="Staff event request dashboard">
        <div className="staffHeader">
          <div><p className="eyebrow dark">STAFF DEMO</p><h2>Event request dashboard</h2><span>See what students need and keep every request moving.</span></div>
          <button className="primaryButton" onClick={() => setView("student")}>+ Open student planner</button>
        </div>
        <div className="staffFolders" aria-label="Staff portfolios">
          {[
            { id: "all", name: "All staff", role: "Shared team view", count: 8 },
            { id: "fran", name: "Fran Boshell", role: "Director of Student Life", count: 3 },
            { id: "kiswah", name: "Kiswah Khan", role: "Coordinator of Student Engagement", count: 3 },
            { id: "alaysha", name: "Alaysha Walker", role: "Assistant Director of Student Life", count: 2 },
          ].map((member) => <button key={member.id} className={`staffFolder ${member.id} ${staffView === member.id ? "active" : ""}`} onClick={() => setStaffView(member.id as typeof staffView)}><span className="folderTab" /><span><strong>{member.name}</strong><small>{member.role}</small></span><b>{member.count}</b></button>)}
        </div>
        <div className="sharedViewNote"><span>👁</span><p><strong>{staffView === "all" ? "Shared team view" : `${staffView === "fran" ? "Fran’s" : staffView === "kiswah" ? "Kiswah’s" : "Alaysha’s"} clubs`}</strong> Everyone can view and help.</p></div>
        <label className="clubFilterSelect"><span>Show clubs</span><select value={staffClubFilter} onChange={(event) => setStaffClubFilter(event.target.value)}>{["All clubs", "Active", "Needs attention", "Restarting", "Inactive", "Archived", "Awaiting constitution", "Awaiting advisor", "Officer vacancies", "Financial follow-up"].map((filter) => <option key={filter}>{filter}</option>)}</select></label>
        <div className="staffStats">
          <article><span>OPEN REQUESTS</span><strong>8</strong><small>3 need action this week</small></article>
          <article><span>AWAITING BUDGET</span><strong>3</strong><small>$2,340 requested</small></article>
          <article><span>ROOMS TO CONFIRM</span><strong>4</strong><small>2 events within 14 days</small></article>
          <article><span>UPCOMING EVENTS</span><strong>11</strong><small>Across 8 student clubs</small></article>
        </div>
        <div className="staffLayout">
          <section className="requestPanel">
            <div className="panelHeading"><div><p className="eyebrow dark">REQUEST QUEUE</p><h3>Student event plans</h3></div><div className="staffFilters"><button className="active">All</button><button>Needs review</button><button>Approved</button></div></div>
            <div className="requestTable" role="table" aria-label="Student event requests">
              <div className="requestRow tableHead" role="row"><span>Event</span><span>Date</span><span>Needs</span><span>Status</span></div>
              {[
                { event: data.eventName || "International Game Night", club: data.clubName || "Global Connections Club", owner: "fran", ownerName: "Fran", date: data.date || "Oct 24", needs: budgetAmount > 0 ? `Room · $${budgetAmount.toLocaleString()}` : "Room · Food", status: submitted ? "New submission" : "Needs review", tone: "review" },
                { event: "Leadership Roundtable", club: "Student Government", owner: "fran", ownerName: "Fran", date: "Oct 30", needs: "Conference room", status: "Needs review", tone: "review" },
                { event: "Fall Cultural Showcase", club: "Asian Student Association", owner: "kiswah", ownerName: "Kiswah", date: "Nov 7", needs: "Stage · Catering", status: "Room pending", tone: "pending" },
                { event: "Engineering Design Expo", club: "Engineering Club", owner: "kiswah", ownerName: "Kiswah", date: "Nov 12", needs: "Tables · Power", status: "Needs review", tone: "review" },
                { event: "Film Club Movie Night", club: "Film Club", owner: "alaysha", ownerName: "Alaysha", date: "Nov 14", needs: "Auditorium · AV", status: "Approved", tone: "approved" },
                { event: "Open Mic Night", club: "Music Club", owner: "alaysha", ownerName: "Alaysha", date: "Nov 20", needs: "Stage · Mics", status: "Room pending", tone: "pending" },
                { event: "Holiday Bake Sale", club: "Business Club", owner: "fran", ownerName: "Fran", date: "Dec 3", needs: "Tables · Budget", status: "Budget review", tone: "review" },
                { event: "Wellness Workshop", club: "Psychology Club", owner: "kiswah", ownerName: "Kiswah", date: "Dec 5", needs: "Classroom · Food", status: "Approved", tone: "approved" },
              ].filter((request) => staffView === "all" || request.owner === staffView).map((request) => <button className={`requestRow owner-${request.owner}`} role="row" key={request.event}><span><strong>{request.event}</strong><small>{request.club}<em className={`ownerTag ${request.owner}`}>{request.ownerName}</em></small></span><span>{request.date}</span><span>{request.needs}</span><span><b className={`status ${request.tone}`}>{request.status}</b><i>→</i></span></button>)}
            </div>
          </section>
          <aside className="staffSidebar">
            <section className={`personalTodos ${staffView}`}><p className="eyebrow dark">{staffView === "all" ? "TEAM PRIORITIES" : `${staffView.toUpperCase()}’S TO-DO LIST`}</p><h3>{staffView === "all" ? "Keep these moving" : "Assigned club follow-up"}</h3><ul>{(staffView === "fran" ? [["Review SGA budget", "Leadership Roundtable"], ["Confirm tables", "Business Club bake sale"], ["Check new submission", data.clubName || "Global Connections Club"]] : staffView === "kiswah" ? [["Confirm showcase room", "Asian Student Association"], ["Review power needs", "Engineering Club"], ["Send approval", "Psychology Club"]] : staffView === "alaysha" ? [["Confirm auditorium AV", "Film Club"], ["Reserve microphones", "Music Club"], ["Send student updates", "2 confirmations ready"]] : [["Review budget requests", "3 proposals are waiting"], ["Confirm event rooms", "4 requests need a location"], ["Send student updates", "2 confirmations are ready"]]).map(([task, detail], index) => <li key={task}><b>{index + 1}</b><span><strong>{task}</strong><small>{detail}</small></span></li>)}</ul></section>
            <section className="needsSnapshot"><p className="eyebrow dark">STUDENT NEEDS</p><h3>At a glance</h3><div><span>Projector / screen <b>6</b></span><span>Food support <b>5</b></span><span>Budget funding <b>3</b></span><span>Accessibility notes <b>2</b></span></div></section>
          </aside>
        </div>
        <section className="followUpQueue"><div className="panelHeading"><div><p className="eyebrow dark">CLUB SUPPORT & FOLLOW-UP</p><h3>{staffClubFilter}</h3></div><span>AI may suggest “potential inactivity risk”; only authorized Student Life staff assigns an official status.</span></div><div className="followUpRows">{[
          { club: "Philosophy Club", status: "Restarting", reason: "Required cabinet vacancies · no recent event history", last: "Sep 8", advisor: "Advisor confirmed", balance: "$175 student reported", owner: "Fran", due: "Sep 22" },
          { club: "Desi Club", status: "Active but needs attention", reason: "Officer workload concern · major event budget pacing", last: "Sep 14", advisor: "Active", balance: "$1,850 verified demo", owner: "Alaysha", due: "Sep 29" },
          { club: "Engineering Club", status: "Active", reason: "Industry Outreach Chair vacant · project safety review", last: "Sep 16", advisor: "Technical review pending", balance: "$920 advisor reviewed", owner: "Kiswah", due: "Oct 2" },
        ].filter((club) => staffClubFilter === "All clubs" || staffClubFilter === "Needs attention" || club.status.includes(staffClubFilter.replace("Inactive", "inactive")) || (staffClubFilter === "Restarting" && club.status === "Restarting") || (staffClubFilter === "Officer vacancies" && club.reason.includes("vacant"))).map((club) => <article key={club.club}><div><span className={`clubStatus ${club.status.toLowerCase().replaceAll(" ", "-")}`}>{club.status}</span><h4>{club.club}</h4><p>{club.reason}</p></div><dl><dt>Last activity</dt><dd>{club.last}</dd><dt>Advisor</dt><dd>{club.advisor}</dd><dt>Balance</dt><dd>{club.balance}</dd><dt>Assigned staff</dt><dd>{club.owner}</dd><dt>Follow-up due</dt><dd>{club.due}</dd></dl><div><button>Open club →</button><select aria-label={`More actions for ${club.club}`} defaultValue=""><option value="" disabled>More actions</option><option>Send outreach email</option><option>Mark contacted</option><option>Add note</option><option>Schedule meeting</option></select></div></article>)}</div></section>
        <div className="demoNote"><Icon>i</Icon><div><strong>Demo workspace</strong><p>This staff dashboard uses sample requests for demonstration. Connect it to RVCC’s official workflow before using it for live approvals.</p></div></div>
      </section>}

      <footer><div className="footerBrand"><img src="/rvcc-logo.png" alt="" /><span><strong>RVplan</strong><small>Raritan Valley Community College · Student Life</small></span></div><div><a href="mailto:studentlife@raritanval.edu">studentlife@raritanval.edu</a><a href="tel:+19082188873">908-218-8873</a></div></footer>

      {helpOpen && <div className="modalBackdrop" role="presentation" onMouseDown={() => setHelpOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onMouseDown={(e) => e.stopPropagation()}><button className="modalClose" onClick={() => setHelpOpen(false)} aria-label="Close help dialog">×</button><span className="helpIcon">?</span><p className="eyebrow dark">Real people, real help</p><h2 id="help-title">Talk to Student Life.</h2><p>Staff can help with rooms, approvals, funding, food, accessibility, promotion, and any question that comes up.</p><div className="contactOptions"><a href="mailto:studentlife@raritanval.edu?subject=Club%20event%20planning%20help"><Icon>✉</Icon><span><strong>Email Student Life</strong>studentlife@raritanval.edu</span><b>→</b></a><a href="tel:+19082188873"><Icon>☎</Icon><span><strong>Call the office</strong>908-218-8873</span><b>→</b></a><div><Icon>⌂</Icon><span><strong>Visit in person</strong>Bateman Student Center, 1st Floor</span></div></div><small>Office hours and staff availability may vary. Contact the office before visiting.</small></section></div>}
    </main>
  );
}
