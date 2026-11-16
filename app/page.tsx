import { StickyHeader } from "./sticky-header";
import { Cover } from "./cover";
import { Issue, type Story } from "./issue";
import { Footer } from "./footer";
import { CursorFollower } from "./cursor";

const stories: Story[] = [
  {
    when: "Currently",
    current: true,
    org: "Emerge Career",
    headline:
      "100+ formerly incarcerated people personally coached into high-paying skilled-trades jobs",
    paragraphs: [
      "Creator of Journey, our AI career coach, brought to life with voice AI.",
      "Also: 2 hiring partnerships in the trucking industry, 1 design system, etc.",
    ],
    visual: "journey",
  },
  {
    when: "Aug 2025",
    org: "IXL Learning",
    headline:
      "200,000 classrooms created custom content that became district-wide common assessments",
    paragraphs: [
      "I drove product definition and UX for “Write your own,” IXL’s first user-authored content feature. Teachers went from creating 0 assessments a week to about 2.",
      "Also: lockdown browser, RFP integrations, classroom collaboration tools, etc.",
    ],
    image: "/images/quiz.svg",
    annotate: "quiz",
  },
  {
    when: "Mar 2025",
    org: "IXL Learning",
    headline:
      "The first digital core curriculum approved by the California Board of Education",
    paragraphs: [
      "I led product and UX design for California Takeoff within a highly regulated RFP process, translating policy and compliance requirements into usable, pedagogically sound learning experiences. Working closely with engineering and curriculum teams, I designed systems that meet state standards while enabling personalized instruction for every classroom.",
    ],
    link: {
      label: "Check it out",
      href: "https://www.ixl.com/takeoffbyixl/california/curriculum",
    },
    image: "/images/california.svg",
    annotate: "takeoff",
  },
  {
    when: "2021–2024",
    org: "Harvard Tech for Social Good",
    headline: "8 design teams sourced and staffed for nonprofits",
    paragraphs: [
      "I designed hands-on for 2 nonprofits, then sourced and staffed 8 project manager-led design teams. Coordinated 70+ user interviews. Pioneered the end-to-end product design lifecycle: scoping projects with partner orgs, running design sprints, conducting design reviews for project teams.",
      "Worked with partners including the ACLU, City of Boston, and local community organizations.",
    ],
    link: {
      label: "Read our design docs",
      href: "https://drive.google.com/drive/folders/1NQttAiSYES-7Qi1fE6_oK8PAjN9MAuG2?usp=drive_link",
    },
    image: "/images/t4sg.svg",
    annotate: "t4sg",
  },
];

export default function Home() {
  return (
      <main className="min-h-screen bg-bone">
        <StickyHeader targetId="hero" />
        <Cover />
        <Issue stories={stories} />
        <Footer />
        <CursorFollower />
      </main>
  );
}
