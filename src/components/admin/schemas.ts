import type { FieldSchema } from "./fields";

export const educationFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "institution", label: "Institution", type: "text" },
  { key: "degree", label: "Degree", type: "text" },
  { key: "period", label: "Period", type: "text", placeholder: "2024 - Present" },
  { key: "detail", label: "Detail", type: "textarea" },
];
export const emptyEducation = () => ({
  id: `edu-${Date.now()}`,
  institution: "",
  degree: "",
  period: "",
  detail: "",
});

export const experienceFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "org", label: "Organization", type: "text" },
  { key: "period", label: "Period", type: "text", placeholder: "2024 - Present" },
  { key: "points", label: "Points (one per line)", type: "list" },
];
export const emptyExperience = () => ({
  id: `exp-${Date.now()}`,
  role: "",
  org: "",
  period: "",
  points: [],
});

export const achievementFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "org", label: "Organization", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "detail", label: "Detail", type: "textarea" },
];
export const emptyAchievement = () => ({
  id: `ach-${Date.now()}`,
  title: "",
  org: "",
  year: "",
  detail: "",
});

export const certificationFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "issuer", label: "Issuer", type: "text" },
  { key: "date", label: "Date", type: "text", placeholder: "Feb 2026" },
  { key: "category", label: "Category", type: "text" },
  { key: "skills", label: "Skills (comma-separated)", type: "tags" },
  { key: "credentialUrl", label: "Credential URL", type: "text" },
  { key: "summary", label: "Summary", type: "textarea" },
];
export const emptyCertification = () => ({
  id: `cert-${Date.now()}`,
  name: "",
  issuer: "",
  date: "",
  category: "",
  skills: [],
  credentialUrl: "",
  summary: "",
});

export const researchFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "type", label: "Type", type: "text", placeholder: "Conference Paper" },
  { key: "title", label: "Title", type: "text" },
  { key: "authors", label: "Authors (comma-separated)", type: "tags" },
  { key: "venue", label: "Venue", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "status", label: "Status", type: "text", placeholder: "Accepted / In Preparation" },
  { key: "abstract", label: "Abstract", type: "textarea" },
  { key: "keywords", label: "Keywords (comma-separated)", type: "tags" },
  { key: "doi", label: "DOI", type: "text" },
  { key: "pdfUrl", label: "PDF URL", type: "text" },
  { key: "bibtex", label: "BibTeX", type: "textarea" },
];
export const emptyResearch = () => ({
  id: `paper-${Date.now()}`,
  type: "Research Paper",
  title: "",
  authors: [],
  venue: "",
  year: "",
  status: "",
  abstract: "",
  keywords: [],
  doi: "",
  pdfUrl: "",
  bibtex: "",
});

export const manualProjectFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "year", label: "Year", type: "text" },
  { key: "category", label: "Category", type: "select", options: ["featured", "practice"] },
  { key: "topics", label: "Topics (comma-separated)", type: "tags" },
  { key: "languages", label: "Languages (comma-separated)", type: "tags" },
  { key: "highlights", label: "Highlights (one per line)", type: "list" },
  { key: "githubUrl", label: "GitHub URL", type: "text" },
  { key: "demoUrl", label: "Demo URL", type: "text" },
  { key: "unpublished", label: "Not yet published", type: "checkbox" },
];
export const emptyManualProject = () => ({
  id: `project-${Date.now()}`,
  name: "",
  description: "",
  year: "",
  category: "featured",
  topics: [],
  languages: [],
  highlights: [],
  githubUrl: "",
  demoUrl: "",
  unpublished: false,
});

export const collaborationFields: FieldSchema[] = [
  { key: "id", label: "Id", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "area", label: "Area", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: ["running", "open"] },
  { key: "role", label: "Your role (if running)", type: "text" },
  { key: "since", label: "Since", type: "text" },
  { key: "seekingRoles", label: "Seeking roles (comma-separated, if open)", type: "tags" },
  { key: "relatedResearchId", label: "Related research id", type: "text" },
];
export const emptyCollaboration = () => ({
  id: `collab-${Date.now()}`,
  title: "",
  area: "",
  description: "",
  status: "open",
  role: "",
  since: "",
  seekingRoles: [],
  relatedResearchId: "",
});

export const linksFields: FieldSchema[] = [
  { key: "github", label: "GitHub URL", type: "text" },
  { key: "githubUsername", label: "GitHub username", type: "text" },
  { key: "linkedin", label: "LinkedIn URL", type: "text" },
  { key: "facebook", label: "Facebook URL", type: "text" },
  { key: "pinterest", label: "Pinterest URL", type: "text" },
  { key: "email", label: "Email (mailto:...)", type: "text" },
];
