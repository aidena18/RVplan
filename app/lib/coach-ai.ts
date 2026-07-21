import { z } from "zod";

export const ClubContextSchema = z.object({
  id: z.string(), clubProfile: z.string(), clubCategory: z.string(), clubMission: z.string(),
  primaryAudience: z.string(), clubStage: z.enum(["new", "restarting", "established"]), semester: z.string(),
  weeksRemaining: z.number(), membershipMetrics: z.object({ interested: z.number(), active: z.number(), returning: z.number() }),
  officerRoster: z.array(z.object({ role: z.string(), status: z.string(), strength: z.string() })),
  vacantRoles: z.array(z.string()), advisorInformation: z.string(), healthDiagnostic: z.string(),
  identifiedWeaknesses: z.array(z.string()), semesterGoals: z.array(z.string()), priorEvents: z.array(z.string()),
  eventAttendance: z.array(z.number()), availableBudget: z.number(), schedulingConstraints: z.array(z.string()),
  completedActions: z.array(z.string()), rejectedRecommendations: z.array(z.string()), coachConversationSummary: z.string(),
});
export type ClubContext = z.infer<typeof ClubContextSchema>;

const RoadmapItemSchema = z.object({
  title: z.string(), description: z.string(), rationale: z.string(), assignedOfficerRole: z.string(),
  suggestedDueDate: z.string(), estimatedEffort: z.string(), requiredResources: z.array(z.string()),
  successMeasure: z.string(), confidence: z.number(), sourceType: z.enum(["demo-ai", "official-rvcc", "verified-example"]),
});
const RecommendationSchema = z.object({
  title: z.string(), concept: z.string(), whyItFits: z.string(), goalAddressed: z.string(),
  lead: z.string(), timing: z.string(), budget: z.string(), successMeasure: z.string(), sourceType: z.string(),
});
export const CoachOutputSchema = z.object({
  identitySummary: z.string(), strengths: z.array(z.string()), weaknesses: z.array(z.string()), opportunities: z.array(z.string()), risks: z.array(z.string()),
  priorities: z.array(RecommendationSchema), roadmap: z.array(RoadmapItemSchema), events: z.array(RecommendationSchema),
  officerPlan: z.array(z.object({ role: z.string(), assignment: z.string(), support: z.string(), workload: z.string() })),
  recruitmentStrategy: z.string(), retentionStrategy: z.string(), coachAnswer: z.string(),
});
export type CoachOutput = z.infer<typeof CoachOutputSchema>;

export const demoClubContexts: ClubContext[] = [
  {
    id: "criminal-justice", clubProfile: "Criminal Justice Club", clubCategory: "Academic and career", clubMission: "Connect students with justice careers and applied learning.", primaryAudience: "Criminal justice students and career explorers", clubStage: "restarting", semester: "Fall 2026", weeksRemaining: 12,
    membershipMetrics: { interested: 18, active: 4, returning: 2 }, officerRoster: [{ role: "President", status: "active", strength: "career outreach" }, { role: "Secretary", status: "active", strength: "organization" }], vacantRoles: ["Vice President", "Treasurer"], advisorInformation: "Advisor is supportive but waiting for a regular meeting schedule.", healthDiagnostic: "Strong topic interest, limited operating capacity.", identifiedWeaknesses: ["Low active membership", "Two vacant officer roles", "No consistent meeting rhythm"], semesterGoals: ["Rebuild a reliable core team", "Hold one career-focused program"], priorEvents: ["Interest table"], eventAttendance: [12], availableBudget: 200, schedulingConstraints: ["Officers unavailable Fridays", "Avoid midterm week"], completedActions: ["Reconnected with advisor"], rejectedRecommendations: ["Large multi-speaker panel"], coachConversationSummary: "The club wants a realistic restart and has rejected high-lift programming.",
  },
  {
    id: "cultural-alliance", clubProfile: "Global Cultural Alliance", clubCategory: "Cultural and belonging", clubMission: "Build belonging through student-led cultural exchange.", primaryAudience: "International and globally curious students", clubStage: "established", semester: "Fall 2026", weeksRemaining: 12,
    membershipMetrics: { interested: 96, active: 34, returning: 26 }, officerRoster: [{ role: "President", status: "active", strength: "programming" }, { role: "Vice President", status: "active", strength: "community building" }, { role: "Secretary", status: "active", strength: "communication" }, { role: "Treasurer", status: "active", strength: "budget tracking" }], vacantRoles: [], advisorInformation: "Advisor attends monthly and supports risk review.", healthDiagnostic: "High attendance and visibility, but work is concentrated with the president.", identifiedWeaknesses: ["Weak delegation", "President workload risk", "Limited succession documentation"], semesterGoals: ["Delegate event ownership", "Develop two future leaders", "Deliver a collaborative culture night"], priorEvents: ["Culture Night", "Conversation Café"], eventAttendance: [88, 42], availableBudget: 900, schedulingConstraints: ["Avoid campus open house", "Large events require six-week lead time"], completedActions: ["Reserved monthly meetings", "Created member interest survey"], rejectedRecommendations: [], coachConversationSummary: "Members attend reliably; leadership distribution and succession are the priority.",
  },
  {
    id: "future-health", clubProfile: "Future Health Professionals", clubCategory: "Pre-professional", clubMission: "Help students explore health careers and prepare for transfer.", primaryAudience: "Pre-health and allied-health students", clubStage: "established", semester: "Fall 2026", weeksRemaining: 12,
    membershipMetrics: { interested: 74, active: 11, returning: 5 }, officerRoster: [{ role: "President", status: "active", strength: "faculty relationships" }, { role: "Vice President", status: "active", strength: "event logistics" }, { role: "Secretary", status: "active", strength: "digital communication" }], vacantRoles: ["Treasurer"], advisorInformation: "Advisor can attend one meeting each month.", healthDiagnostic: "Strong initial interest but steep drop-off after first attendance.", identifiedWeaknesses: ["Low return attendance", "Contact list is not converting to active membership", "Few member-owned roles"], semesterGoals: ["Increase second-meeting return rate", "Create career skill value at every meeting"], priorEvents: ["Health Careers Panel", "Transfer Q&A"], eventAttendance: [55, 39], availableBudget: 350, schedulingConstraints: ["Many members have clinical schedules", "Prefer Tuesday or Wednesday afternoons"], completedActions: ["Collected 74 interest forms"], rejectedRecommendations: ["Another general careers panel"], coachConversationSummary: "Students want interactive, practical experiences rather than another lecture panel.",
  },
];

const outputs: Record<string, CoachOutput> = {
  "criminal-justice": {
    identitySummary: "The Criminal Justice Club is restarting with meaningful career interest but only four active members and two vacant officer roles. Its best path is a focused rebuild, not a large event calendar.", strengths: ["Clear career-focused mission", "Supportive advisor connection", "18 interested students to re-engage"], weaknesses: ["Only four active members", "Vice President and Treasurer roles are vacant", "No predictable meeting rhythm"], opportunities: ["Use one interactive career program as an early win", "Give interested students small, low-risk roles"], risks: ["Overloading the president", "Planning beyond the club’s current capacity"],
    priorities: [
      { title: "Hold a 45-minute restart meeting", concept: "Reconnect interested students, confirm availability, and fill two small action roles.", whyItFits: "Four active members need a reliable core before larger programming.", goalAddressed: "Rebuild a reliable core team", lead: "President with Secretary support", timing: "Within 10 days", budget: "$0", successMeasure: "Six students attend and three accept a follow-up task", sourceType: "Demo AI response" },
      { title: "Create one communication rhythm", concept: "Choose one channel and send a consistent weekly update.", whyItFits: "A predictable rhythm addresses the club’s inconsistent participation.", goalAddressed: "Improve active membership", lead: "Secretary", timing: "This week", budget: "$0", successMeasure: "At least 60% of active members respond", sourceType: "Demo AI response" },
      { title: "Recruit officers through small roles", concept: "Let two members test logistics and outreach before formal officer commitments.", whyItFits: "Vacancies are easier to fill after members experience manageable ownership.", goalAddressed: "Fill vacant roles", lead: "President", timing: "By week 4", budget: "$0", successMeasure: "Two potential officers complete a task", sourceType: "Demo AI response" },
    ],
    roadmap: [
      { title: "Confirm the restart team", description: "Meet with active members and identify two reliable volunteers.", rationale: "The club lacks enough operating capacity for a major event.", assignedOfficerRole: "President", suggestedDueDate: "Sep 18", estimatedEffort: "2 hours", requiredResources: ["Interest list", "Advisor check-in"], successMeasure: "Six committed participants", confidence: .94, sourceType: "demo-ai" },
      { title: "Launch a recurring meeting rhythm", description: "Schedule three meetings at the same day and time.", rationale: "Consistency makes return attendance easier.", assignedOfficerRole: "Secretary", suggestedDueDate: "Sep 25", estimatedEffort: "1 hour", requiredResources: ["Room request"], successMeasure: "Three dates confirmed and shared", confidence: .91, sourceType: "demo-ai" },
      { title: "Deliver one interactive career program", description: "Run a mock case-analysis workshop with one faculty or alumni facilitator.", rationale: "It is lower lift than the rejected speaker panel and matches the club mission.", assignedOfficerRole: "President + volunteer program lead", suggestedDueDate: "Nov 6", estimatedEffort: "6–8 hours", requiredResources: ["Classroom", "Facilitator", "Case prompt"], successMeasure: "15 attendees and 5 return to the next meeting", confidence: .87, sourceType: "demo-ai" },
    ],
    events: [
      { title: "Mock Case Analysis Lab", concept: "Small teams review a fictional case and explain their decisions.", whyItFits: "Interactive, career-relevant, under $200, and manageable for four active members.", goalAddressed: "Deliver one career-focused program", lead: "Volunteer program lead", timing: "4 weeks", budget: "$40–$120", successMeasure: "15 attendees; 70% complete feedback", sourceType: "Generated demo concept" },
      { title: "Justice Careers Office Hours", concept: "One guest rotates through short student questions instead of a formal panel.", whyItFits: "It preserves career value without the complexity the club already rejected.", goalAddressed: "Reconnect interested students", lead: "President", timing: "3 weeks", budget: "$0–$75", successMeasure: "10 students ask questions; 4 join the next meeting", sourceType: "Generated demo concept" },
    ],
    officerPlan: [{ role: "President", assignment: "Advisor coordination and restart meeting", support: "Secretary owns all follow-up messages", workload: "High—do not add event logistics" }, { role: "Secretary", assignment: "Weekly updates and attendance tracking", support: "Recruit one member as outreach helper", workload: "Manageable" }, { role: "Vacant VP/Treasurer", assignment: "Use two temporary member roles before elections", support: "Give each volunteer one bounded task", workload: "Vacancy risk" }],
    recruitmentStrategy: "Move 18 interested students through a small funnel: personal restart invitation → first meeting → one member-owned task → second meeting. Do not count the interest list as active membership.", retentionStrategy: "Prioritize predictable meetings, personal follow-up within 24 hours, and small roles tied to the case-analysis program.", coachAnswer: "Because you have four active members and two vacant officer roles, focus this month on a restart meeting, one communication rhythm, and one low-lift interactive program—not a large speaker event.",
  },
  "cultural-alliance": {} as CoachOutput,
  "future-health": {} as CoachOutput,
};

outputs["cultural-alliance"] = {
  ...outputs["criminal-justice"], identitySummary: "The Global Cultural Alliance is a visible, established club with strong attendance. Its central challenge is not recruitment—it is delegation, sustainable officer workload, and succession.", strengths: ["34 active members", "Strong event turnout", "Complete officer team"], weaknesses: ["President owns too much programming", "Weak succession documentation"], opportunities: ["Create member-led culture teams", "Develop two future leaders"], risks: ["President burnout", "Knowledge loss after officer transitions"],
  priorities: [
    { title: "Assign Culture Night workstreams", concept: "Name leads for program, hospitality, promotion, and accessibility.", whyItFits: "High member capacity is being underused while the president is overloaded.", goalAddressed: "Delegate event ownership", lead: "Vice President", timing: "This week", budget: "$0", successMeasure: "Four leads accept written scopes", sourceType: "Demo AI response" },
    { title: "Launch two leadership apprenticeships", concept: "Pair two members with officers on a real deliverable.", whyItFits: "The club needs succession development more than broad recruitment.", goalAddressed: "Develop two future leaders", lead: "President", timing: "By week 3", budget: "$0", successMeasure: "Two members lead a deliverable", sourceType: "Demo AI response" },
    { title: "Document the Culture Night playbook", concept: "Capture timeline, vendors, contacts, accessibility, and lessons.", whyItFits: "The club repeats a large program and risks losing institutional knowledge.", goalAddressed: "Prepare succession", lead: "Secretary", timing: "Throughout planning", budget: "$0", successMeasure: "Reusable playbook completed", sourceType: "Demo AI response" },
  ],
  roadmap: [
    { title: "Delegate four workstreams", description: "Distribute Culture Night ownership across officers and members.", rationale: "The club has enough people, but work is concentrated.", assignedOfficerRole: "Vice President", suggestedDueDate: "Sep 15", estimatedEffort: "2 hours", requiredResources: ["Workstream template"], successMeasure: "Four named leads", confidence: .96, sourceType: "demo-ai" },
    { title: "Run a leadership check-in", description: "Review workloads and remove bottlenecks every two weeks.", rationale: "Regular checks reduce burnout and missed handoffs.", assignedOfficerRole: "President", suggestedDueDate: "Biweekly", estimatedEffort: "30 minutes", requiredResources: ["Shared task board"], successMeasure: "No officer owns more than two workstreams", confidence: .9, sourceType: "demo-ai" },
    { title: "Complete succession handoffs", description: "Give two emerging leaders ownership and document repeatable processes.", rationale: "Strong attendance creates a good successor pool.", assignedOfficerRole: "Secretary", suggestedDueDate: "Nov 20", estimatedEffort: "4 hours", requiredResources: ["Playbook", "Handoff checklist"], successMeasure: "Two successors identified", confidence: .88, sourceType: "demo-ai" },
  ],
  events: [
    { title: "Member-Curated Culture Labs", concept: "Small member teams host rotating interactive tables before Culture Night.", whyItFits: "It distributes ownership and develops future leaders.", goalAddressed: "Delegate event ownership", lead: "Member workstream leads", timing: "5–6 weeks", budget: "$250–$600", successMeasure: "Four member-led stations; 80 attendees", sourceType: "Generated demo concept" },
    { title: "Global Story Exchange", concept: "Facilitated small-group stories paired with a reflection wall.", whyItFits: "It offers a lower-cost belonging program between major events.", goalAddressed: "Sustain member engagement", lead: "Vice President", timing: "3 weeks", budget: "$75–$180", successMeasure: "35 attendees; 10 volunteer for Culture Night", sourceType: "Generated demo concept" },
  ],
  officerPlan: [{ role: "President", assignment: "Set direction and approve decisions—not own every workstream", support: "Vice President runs workstream check-ins", workload: "High—reduce direct tasks" }, { role: "Vice President", assignment: "Coordinate four workstream leads", support: "Secretary maintains shared board", workload: "Moderate" }, { role: "Secretary", assignment: "Build Culture Night playbook", support: "Two member apprentices collect notes", workload: "Balanced" }, { role: "Treasurer", assignment: "Budget checkpoints and purchase timeline", support: "Hospitality lead submits needs", workload: "Balanced" }],
  recruitmentStrategy: "Use Culture Night visibility to recruit for specific member teams, not a generic contact list.", retentionStrategy: "Give returning members visible ownership, recognize contributions, and create a pathway from workstream volunteer to officer apprentice.", coachAnswer: "Your attendance is already strong. The most useful next step is to distribute Culture Night ownership across four workstreams and use those roles to develop two future officers.",
};

outputs["future-health"] = {
  ...outputs["criminal-justice"], identitySummary: "Future Health Professionals has strong awareness—74 interested students—but only five returning members. The priority is converting first attendance into recurring value, not collecting more names.", strengths: ["Strong career interest", "Faculty relationships", "Successful large events"], weaknesses: ["Low return attendance", "Few member-owned roles", "Vacant Treasurer role"], opportunities: ["Offer practical skill sessions", "Use small cohorts for accountability"], risks: ["Mistaking contacts for active members", "Repeating lecture-style panels students rejected"],
  priorities: [
    { title: "Create a two-meeting return pathway", concept: "Invite every attendee to a specific follow-up activity before they leave.", whyItFits: "The club loses students between first and second attendance.", goalAddressed: "Increase return rate", lead: "Secretary", timing: "At the next meeting", budget: "$0", successMeasure: "40% attend a second activity", sourceType: "Demo AI response" },
    { title: "Replace panels with skill labs", concept: "Use resume, interview, transfer, or scenario practice.", whyItFits: "Students rejected another general panel and want practical value.", goalAddressed: "Create value at every meeting", lead: "Vice President", timing: "Within 4 weeks", budget: "$50–$150", successMeasure: "25 attendees; 12 return", sourceType: "Demo AI response" },
    { title: "Give members micro-roles", concept: "Assign greeter, facilitator, follow-up, and resource-curator roles.", whyItFits: "Ownership builds belonging and repeat participation.", goalAddressed: "Improve active membership", lead: "President", timing: "Immediately", budget: "$0", successMeasure: "Eight members hold a rotating role", sourceType: "Demo AI response" },
  ],
  roadmap: [
    { title: "Measure the real funnel", description: "Track interest, first attendance, return attendance, and active roles separately.", rationale: "The club’s 74 contacts conceal low retention.", assignedOfficerRole: "Secretary", suggestedDueDate: "Sep 16", estimatedEffort: "1 hour", requiredResources: ["Attendance tracker"], successMeasure: "Four funnel stages measured", confidence: .97, sourceType: "demo-ai" },
    { title: "Run an interactive skill lab", description: "Host a practical health-career exercise with a clear follow-up.", rationale: "Interactive value addresses the rejection of another panel.", assignedOfficerRole: "Vice President", suggestedDueDate: "Oct 8", estimatedEffort: "6 hours", requiredResources: ["Classroom", "Faculty facilitator"], successMeasure: "40% return within two weeks", confidence: .92, sourceType: "demo-ai" },
    { title: "Build a member ownership ladder", description: "Move attendees from helper to activity lead to officer candidate.", rationale: "Small roles improve retention and create Treasurer prospects.", assignedOfficerRole: "President", suggestedDueDate: "Nov 1", estimatedEffort: "3 hours", requiredResources: ["Role menu"], successMeasure: "Eight helpers; two potential officers", confidence: .89, sourceType: "demo-ai" },
  ],
  events: [
    { title: "Clinical Communication Mini-Lab", concept: "Practice patient introductions and teamwork scenarios with guided feedback.", whyItFits: "It delivers practical value and is more interactive than the rejected panel format.", goalAddressed: "Increase return attendance", lead: "Vice President", timing: "4 weeks", budget: "$60–$140", successMeasure: "25 attend; 12 return", sourceType: "Generated demo concept" },
    { title: "Transfer Application Sprint", concept: "Students bring one real application task and complete it with peer support.", whyItFits: "It turns career interest into recurring, concrete progress.", goalAddressed: "Create value at every meeting", lead: "Secretary + advisor", timing: "3 weeks", budget: "$0–$50", successMeasure: "20 completed tasks; 50% return", sourceType: "Generated demo concept" },
  ],
  officerPlan: [{ role: "President", assignment: "Create member ownership ladder and recruit Treasurer candidate", support: "VP owns program delivery", workload: "Moderate" }, { role: "Vice President", assignment: "Lead interactive skill lab", support: "Two member facilitators", workload: "Moderate" }, { role: "Secretary", assignment: "Track the recruitment funnel and personal follow-up", support: "Rotating member outreach role", workload: "High during event weeks" }, { role: "Vacant Treasurer", assignment: "Offer a supervised budget-helper role", support: "President reviews first two tasks", workload: "Vacancy risk" }],
  recruitmentStrategy: "Treat awareness, first attendance, return attendance, active membership, and leadership as separate stages; optimize the conversion between each one.", retentionStrategy: "Every meeting should provide a tangible career outcome, a personal follow-up, and a small role students can own.", coachAnswer: "With 74 interested students but only five returning, you do not need another awareness campaign. Build a two-meeting pathway and replace the rejected panel idea with a practical skill lab.",
};

Object.entries(outputs).forEach(([key, value]) => { outputs[key] = CoachOutputSchema.parse(value); });

export interface ClubLeadershipAIService {
  analyzeClubProfile(context: ClubContext): Promise<CoachOutput>;
  identifyClubStrengthsAndGaps(context: ClubContext): Promise<Pick<CoachOutput, "strengths" | "weaknesses">>;
  generatePriorityActions(context: ClubContext): Promise<CoachOutput["priorities"]>;
  generateSemesterRoadmap(context: ClubContext): Promise<CoachOutput["roadmap"]>;
  generateEventRecommendations(context: ClubContext): Promise<CoachOutput["events"]>;
  generateOfficerPlan(context: ClubContext): Promise<CoachOutput["officerPlan"]>;
  generateRecruitmentStrategy(context: ClubContext): Promise<string>;
  generateRetentionStrategy(context: ClubContext): Promise<string>;
  answerCoachQuestion(context: ClubContext, question: string): Promise<string>;
  summarizeCoachConversation(context: ClubContext, messages: string[]): Promise<string>;
  revisePlanFromFeedback(context: ClubContext, feedback: string): Promise<CoachOutput>;
  explainRecommendation(context: ClubContext, title: string): Promise<string>;
}

export class DemoClubLeadershipAIService implements ClubLeadershipAIService {
  private result(context: ClubContext) { return CoachOutputSchema.parse(outputs[ClubContextSchema.parse(context).id]); }
  async analyzeClubProfile(context: ClubContext) { return this.result(context); }
  async identifyClubStrengthsAndGaps(context: ClubContext) { const result = this.result(context); return { strengths: result.strengths, weaknesses: result.weaknesses }; }
  async generatePriorityActions(context: ClubContext) { return this.result(context).priorities; }
  async generateSemesterRoadmap(context: ClubContext) { return this.result(context).roadmap; }
  async generateEventRecommendations(context: ClubContext) { return this.result(context).events; }
  async generateOfficerPlan(context: ClubContext) { return this.result(context).officerPlan; }
  async generateRecruitmentStrategy(context: ClubContext) { return this.result(context).recruitmentStrategy; }
  async generateRetentionStrategy(context: ClubContext) { return this.result(context).retentionStrategy; }
  async answerCoachQuestion(context: ClubContext, question: string) { return `${this.result(context).coachAnswer}${question ? ` Your question was: “${question}”` : ""}`; }
  async summarizeCoachConversation(context: ClubContext, messages: string[]) { return `${context.clubProfile}: ${messages.slice(-3).join(" ")}`; }
  async revisePlanFromFeedback(context: ClubContext, feedback: string) { const result = this.result(context); return { ...result, coachAnswer: `${result.coachAnswer} I’ll use your feedback (${feedback}) for the next recommendation.` }; }
  async explainRecommendation(context: ClubContext, title: string) { const item = [...this.result(context).priorities, ...this.result(context).events].find((entry) => entry.title === title); return item?.whyItFits || "This recommendation is grounded in the saved club context."; }
}

export const demoCoachService = new DemoClubLeadershipAIService();
export const getDemoCoachOutput = (profileId: string) => CoachOutputSchema.parse(outputs[profileId]);
