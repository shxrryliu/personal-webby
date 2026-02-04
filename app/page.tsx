import Image from "next/image";
import { StaggerFadeIn, FadeInSection } from "./stagger-fade-in";
import { WorkCard } from "./WorkCard";
import { MagnifyHero } from "./magnify-hero";
import { StickyHeader } from "./sticky-header";

const workSections: {
  title: string;
  date: string;
  image?: string;
  /** Tailwind aspect-ratio class to match Figma proportions */
  aspect?: string;
  hasExternalLink?: boolean;
  url?: string;
  details?: {
    summary: string;
    bulletsTitle?: string;
    bullets?: string[];
    paragraphs?: string[];
    footer?: string;
    footerUrl?: string;
    mediaSrc?: string;
    mediaAlt?: string;
  };
}[] = [
  {
    title: "Contracted PM/Designer for Sway",
    date: "Currently designing",
    image: "/images/sway.svg",
    aspect: "aspect-[3/1]",
    details: {
      summary:
        "Sway is a civic tech platform that helps groups of voters coordinate their ballots to create real political leverage.",
      bulletsTitle: "I’m working part-time to:",
      bullets: [
        "Redesign their core voter-facing experiences",
        "Lead initiatives work across UX, product strategy, and product process",
        "Translate messy civic workflows into clear, usable interfaces for real voting groups.",
      ],
      footer: "More to come!",
    },
  },
  {
    title: '"Write your own" Quiz Question',
    date: "Released Aug 2025",
    image: "/images/quiz.svg",
    aspect: "aspect-[3/1]",
    details: {
      summary: "IXL's first user-authored content feature.",
      paragraphs: [
        "I drove product definition and UX while collaborating deeply with engineering to ship a flexible, scalable system. The feature unlocked regular assessment creation: teachers went from creating 0 assessments/week to ~2 assessments/week.",
        "Used regularly across 200k+ classrooms in the United States.",
      ],
      mediaSrc: "/images/quizfigma.svg",
      mediaAlt: "Quiz Question Figma board",
    },
  },
  {
    title: "California Takeoff",
    date: "Released Mar 2025",
    image: "/images/california.svg",
    aspect: "aspect-[3/1]",
    details: {
      summary: "California Takeoff is the first digital core curriculum approved by the California Board of Education.",
      paragraphs: [
        "I led product and UX design within a highly regulated RFP process, translating policy and compliance requirements into usable, pedagogically sound learning experiences. Working closely with engineering and curriculum teams, I designed systems that meet state standards while enabling personalized instruction for every classroom.",
      ],
      footer: "Check it out",
      footerUrl: "https://www.ixl.com/takeoffbyixl/california/curriculum",
    },
  },
  {
    title: "Harvard Tech for Social Good",
    date: "Anywhere from 2021-2024",
    image: "/images/t4sg.svg",
    aspect: "aspect-[3/1]",
    details: {
      summary: "Led product and design across multiple years for Harvard's student-run tech-for-good organization.",
      paragraphs: [
        "Directed cross-functional student teams building software for nonprofits. Coordinated 70+ user interviews. Pioneered end-to-end product design lifecycle: scoping projects with partner orgs, running design sprints, conducting design reviews for project teams.",
        "Worked with partners including the ACLU, City of Boston, and local community organizations.",
      ],
      footer: "Read our design docs",
      footerUrl: "https://drive.google.com/drive/folders/1NQttAiSYES-7Qi1fE6_oK8PAjN9MAuG2?usp=drive_link",
    },
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <StickyHeader targetId="hero" />
      <StaggerFadeIn className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Hero Section */}
        <FadeInSection className="mb-20">
          <MagnifyHero>
          <section id="hero">
            {/* Hero card with fibonacci spiral border */}
            <div className="relative rounded-lg bg-[url('/images/spiralbg.png')] bg-contain bg-no-repeat px-6 py-10 bg-[position:center_40px] md:bg-[position:center_-10px] md:px-10 md:py-10">
              <div className="relative z-10">
              {/* Portfolio title */}
              <h1 className="mb-1 text-center font-serif text-5xl italic md:text-7xl">
                portfolio
                <span className="ml-2 font-sans text-sm not-italic tracking-wide text-charcoal-light md:text-base">
                  v2026.0
                </span>
              </h1>
              <p className="mb-10 text-center ml-[100px] font-sans text-xs tracking-wide text-charcoal-light md:text-base">
                [sherry xinrui liu]
              </p>

              {/* Intro with headshot */}
              <div className="flex flex-col items-start gap-6 md:flex-row md:gap-10">
                {/* Headshot */}
                <div className="mx-auto flex-shrink-0 md:mx-0">
                  <div className="cursor-magnify" data-magnify-trigger>
                    <Image
                      src="/images/headshot.svg"
                      alt="Sherry Liu"
                      width={180}
                      height={180}
                      className="rounded-md"
                      priority
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-charcoal-light">
                    <span className="group-data-[magnify-active]/magnify:hidden">try my magnifying glass?</span>
                    <span className="hidden group-data-[magnify-active]/magnify:inline">okay, you can give it back</span>
                  </p>
                </div>

                {/* Intro text */}
                <div className="space-y-4 text-sm leading-relaxed md:text-base">
                  <p>
                    <strong>Hi Gabe! It&apos;s Sherry.</strong> Threw this
                    together last night. Enjoy. 🥳
                  </p>
                  <p>
                    <strong>Product manager/designer</strong> creating better [web]
                    UX for underserved communities. Currently improving education
                    for 1 in 3 K-12 students in the United States.
                  </p>
                  <p>
                    <strong>Passionate about tech for good.</strong>
                  </p>
                </div>
              </div>
              </div>
            </div>
          </section>
          </MagnifyHero>
        </FadeInSection>

        {/* Work Sections */}
        {workSections.map((work, index) => (
          <FadeInSection
            key={index}
            className={index < workSections.length - 1 ? "mb-16" : ""}
          >
            <WorkCard
              title={work.title}
              date={work.date}
              image={work.image}
              aspect={work.aspect}
              hasExternalLink={work.hasExternalLink}
              url={work.url}
              details={work.details}
            />
          </FadeInSection>
        ))}

        {/* Footer */}
        <FadeInSection>
          <footer className="mt-20 flex flex-col gap-4 border-t border-warm-gray/50 pt-8 text-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p>Thanks for checking this out</p>
              <p>Me and Claude Code like &#9996;</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <p>
                <a href="https://drive.google.com/file/d/14Ki6bSKAT2-WeS7banVjEOyyrCBfsuuq/view?usp=sharing" 
                target="_blank" rel="noopener noreferrer" className="underline hover:text-charcoal-light">
                  Resume
                </a>
              </p>
              <p>
                <a href="https://www.linkedin.com/in/sherry-liu-0183a7167/" target="_blank" rel="noopener noreferrer" 
                className="underline hover:text-charcoal-light">
                  LinkedIn
                </a>{" "}
                (which you already have)
              </p>
            </div>
          </footer>
        </FadeInSection>
      </StaggerFadeIn>
    </main>
  );
}
