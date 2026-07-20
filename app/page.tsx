"use client";

import { useMemo, useState } from "react";

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

export default function Home() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pizzaCount = Math.max(1, Math.ceil(data.attendees / 3));
  const budgetAmount = Number(data.budget.replace(/[^0-9.]/g, "")) || 0;
  const budgetBreakdownTotal = [data.supplyCost, data.foodCost, data.newEquipmentCost, data.rentalEquipmentCost, data.laborCost].reduce((sum, value) => sum + (Number(value) || 0), 0);
  const semester = data.date ? `${[0, 1, 2, 3, 4].includes(new Date(`${data.date}T12:00:00`).getMonth()) ? "Spring" : [5, 6, 7].includes(new Date(`${data.date}T12:00:00`).getMonth()) ? "Summer" : "Fall"} ${new Date(`${data.date}T12:00:00`).getFullYear()}` : "To be determined";

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
    <main>
      <header className="hero">
        <nav className="topbar" aria-label="Main navigation">
          <a className="brand" href="https://www.raritanval.edu/" target="_blank" rel="noreferrer">
            <span className="logoBox"><img src="/rvcc-logo.png" alt="RVCC lion logo" /></span>
            <span><strong>RV Plan</strong><small>Raritan Valley · Student Life</small></span>
          </a>
          <div className="navActions">
            <a href="https://www.raritanval.edu/student-experience/student-involvement/" target="_blank" rel="noreferrer">Explore student life</a>
            <button className="helpButton" onClick={() => setHelpOpen(true)}><Icon>✦</Icon> Talk to Student Life</button>
          </div>
        </nav>
        <div className="heroCopy">
          <p className="eyebrow">RV Plan · Student club event request</p>
          <h1>Plan your club event<br />with confidence.</h1>
          <p>Answer a few questions and leave with room guidance, food estimates, and a personalized checklist for making your event happen.</p>
        </div>
        <div className="heroStamp" aria-hidden="true"><span>PLAN</span><strong>IT!</strong></div>
      </header>

      <section className="workspace" aria-label="Event planning form">
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
                <div className="budgetFormHeader"><span>RV Plan · RVCC Student Life</span><strong>Club / Organization Budget Proposal</strong><p>Events & Projects</p></div>
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

          <aside className="supportRail">
            <div className="helpCard">
              <span className="helpIcon">?</span>
              <p>Need a hand?</p>
              <h3>Student Life is here to help.</h3>
              <p>Not sure which room to choose, how funding works, or what needs approval? Ask us.</p>
              <button onClick={() => setHelpOpen(true)}>Talk to a staff member <span>→</span></button>
            </div>
            <div className="previewCard">
              <p className="eyebrow dark">What you’ll get</p>
              <h3>A plan built around your event.</h3>
              <ul><li><Icon>⌂</Icon><span><strong>Room guidance</strong>Matched to your group and setup</span></li><li><Icon>◒</Icon><span><strong>Food estimates</strong>Enough for your expected crowd</span></li><li><Icon>✓</Icon><span><strong>Clear next steps</strong>Know what to do and who to ask</span></li></ul>
            </div>
            <p className="privacyNote"><Icon>●</Icon> This planning tool does not replace RVCC’s official reservation or approval process.</p>
          </aside>
        </div>
      </section>

      <footer><div className="footerBrand"><img src="/rvcc-logo.png" alt="" /><span><strong>RV Plan</strong><small>Raritan Valley Community College · Student Life</small></span></div><div><a href="mailto:studentlife@raritanval.edu">studentlife@raritanval.edu</a><a href="tel:+19082188873">908-218-8873</a></div></footer>

      {helpOpen && <div className="modalBackdrop" role="presentation" onMouseDown={() => setHelpOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onMouseDown={(e) => e.stopPropagation()}><button className="modalClose" onClick={() => setHelpOpen(false)} aria-label="Close help dialog">×</button><span className="helpIcon">?</span><p className="eyebrow dark">Real people, real help</p><h2 id="help-title">Talk to Student Life.</h2><p>Staff can help with rooms, approvals, funding, food, accessibility, promotion, and any question that comes up.</p><div className="contactOptions"><a href="mailto:studentlife@raritanval.edu?subject=Club%20event%20planning%20help"><Icon>✉</Icon><span><strong>Email Student Life</strong>studentlife@raritanval.edu</span><b>→</b></a><a href="tel:+19082188873"><Icon>☎</Icon><span><strong>Call the office</strong>908-218-8873</span><b>→</b></a><div><Icon>⌂</Icon><span><strong>Visit in person</strong>Bateman Student Center, 1st Floor</span></div></div><small>Office hours and staff availability may vary. Contact the office before visiting.</small></section></div>}
    </main>
  );
}
