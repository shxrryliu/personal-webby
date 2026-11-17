export type Story = {
  /** Used in the address bar: /#<slug> opens this issue. */
  slug: string;
  /** Issue number shown on the spread. */
  page: string;
  /** Short name on the spread's title strip. */
  mast: string;
  /** Title strip colours (Tailwind classes). */
  cover: string;
  /** How far the spread is tilted as it flies in, in degrees. */
  tilt: number;
  /** Shown in the date pill, e.g. "Aug 2025". */
  when: string;
  /** Marks ongoing work: the pill fills in and gets a live dot. */
  current?: boolean;
  org: string;
  orgUrl: string;
  /** Outcome-led headline. */
  headline: string;
  /** The short write-up inside the issue. */
  body: string[];
  link?: { label: string; href: string };
  /** One wide screenshot, or the Journey panel. */
  image?: string;
  visual?: "journey";
  /** Pen notes drawn over the screenshot. */
  annotate?: "quiz" | "takeoff" | "t4sg";
};

export const stories: Story[] = [
  {
    slug: "emerge-career",
    mast: "Emerge",
    cover: "bg-olive text-bone",
    tilt: -2,
    page: "01",
    when: "Currently",
    current: true,
    org: "Emerge Career",
    orgUrl: "https://www.emergecareer.com",
    headline:
      "100+ formerly incarcerated people coached into high-paying skilled-trades jobs",
    body: [
      "Creator of Journey, our AI career coach, brought to life with voice AI.",
      "Also: 2 hiring partnerships in the trucking industry, 1 design system, etc.",
    ],
    visual: "journey",
  },
  {
    slug: "write-your-own",
    mast: "IXL",
    cover: "bg-cobalt text-bone",
    tilt: 1.5,
    page: "02",
    when: "Aug 2025",
    org: "IXL Learning",
    orgUrl: "https://www.ixl.com",
    headline:
      "200,000 classrooms created custom content that became district-wide common assessments",
    body: [
      "I drove product definition and UX for “Write your own,” IXL’s first user-authored content feature. Teachers went from creating 0 assessments a week to about 2.",
      "Also: lockdown browser, RFP integrations, classroom collaboration tools, etc.",
    ],
    image: "/images/quiz.svg",
    annotate: "quiz",
  },
  {
    slug: "california-takeoff",
    mast: "Takeoff",
    cover: "bg-mustard text-oxblood",
    tilt: -1,
    page: "03",
    when: "Mar 2025",
    org: "IXL Learning",
    orgUrl: "https://www.ixl.com",
    headline:
      "The first digital core curriculum approved by the California Board of Education",
    body: [
      "I led product and UX design for California Takeoff through a highly regulated RFP process, turning policy and compliance requirements into lessons that meet state standards and still personalize instruction.",
    ],
    link: {
      label: "Check it out",
      href: "https://www.ixl.com/takeoffbyixl/california/curriculum",
    },
    image: "/images/california.svg",
    annotate: "takeoff",
  },
  {
    slug: "tech-for-social-good",
    mast: "T4SG",
    cover: "bg-espresso text-bone",
    tilt: 2,
    page: "04",
    when: "2021–2024",
    org: "Harvard Tech for Social Good",
    orgUrl: "https://socialgood.hcs.harvard.edu",
    headline: "8 design teams sourced and staffed for nonprofits",
    body: [
      "I designed hands-on for 2 nonprofits, then sourced and staffed 8 project manager-led design teams and coordinated 70+ user interviews.",
      "Partners included the ACLU and the City of Boston.",
    ],
    link: {
      label: "Read our design docs",
      href: "https://drive.google.com/drive/folders/1NQttAiSYES-7Qi1fE6_oK8PAjN9MAuG2?usp=drive_link",
    },
    image: "/images/t4sg.svg",
    annotate: "t4sg",
  },
];

export const issueHash = (slug: string) => `#${slug}`;

/** Address of the "about me" spread, opened by clicking the portrait. */
export const ABOUT_HASH = "#about";
