import type { ResearchPaper } from "./types";

export function formatApaCitation(paper: ResearchPaper): string {
  const authors = paper.authors.join(", ");
  const venue = paper.venue ? ` ${paper.venue}.` : "";
  return `${authors} (${paper.year}). ${paper.title}.${venue}`;
}
