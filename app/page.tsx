import Image from "next/image";
import { StaggerFadeIn, FadeInSection } from "./stagger-fade-in";

const workSections: {
  title: string;
  date: string;
  image?: string;
  /** Tailwind aspect-ratio class to match Figma proportions */
  aspect?: string;
  hasExternalLink?: boolean;
  url?: string;
}[] = [
  {
    title: "Contracted PM/Designer for Sway",
    date: "Currently designing",
    image: "/images/sway.svg",
    aspect: "aspect-[3/1]",
  },
  {
    title: '"Write your own" Quiz Question',
    date: "Released Aug 2025",
    image: "/images/quiz.svg",
    aspect: "aspect-[3/1]",
  },
  {
    title: "California Takeoff",
    date: "Released Mar 2025",
    image: "/images/california.svg",
    aspect: "aspect-[3/1]",
  },
  {
    title: "Harvard Tech for Social Good",
    date: "Anywhere from 2021-2024",
    image: "/images/t4sg.svg",
    aspect: "aspect-[3/1]",
    hasExternalLink: true,
    url: "https://drive.google.com/drive/folders/1NQttAiSYES-7Qi1fE6_oK8PAjN9MAuG2?usp=drive_link",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <StaggerFadeIn className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Hero Section */}
        <FadeInSection className="mb-20">
          <section>
            {/* Hero card with fibonacci spiral border */}
            <div className="relative rounded-lg px-6 py-10 md:px-10 md:py-14" style={{
              backgroundImage: 'url(/images/spiralbg.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
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
                <div className="mx-auto flex-shrink-0 md:mx-0 cursor-magnify">
                  <Image
                    src="/images/headshot.svg"
                    alt="Sherry Liu"
                    width={180}
                    height={180}
                    className="rounded-md"
                    priority
                  />
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
        </FadeInSection>

        {/* Work Sections */}
        {workSections.map((work, index) => {
          const articleContent = (
            <article className="group cursor-magnify px-[20px]">
              {/* Title row */}
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-sm font-bold md:text-base">
                  {work.title}
                </h2>
                <span className="text-charcoal-light" aria-hidden="true">
                  &#9734;
                </span>
                <span className="text-sm text-charcoal-light">{work.date}</span>
              </div>

              {/* Image area */}
              {work.image && (
                <div className={`relative ${work.aspect ?? "aspect-[3/1]"} overflow-hidden rounded-lg bg-cream-dark p-4 transition-shadow group-hover:shadow-md md:p-6`}>
                  <Image
                    src={work.image}
                    alt={`${work.title} screenshot`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {!work.image && (
                <div className="relative flex aspect-[3/1] items-end justify-end rounded-lg bg-cream-dark p-4 transition-shadow group-hover:shadow-md md:p-6">
                  {work.hasExternalLink && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-charcoal-light"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  )}
                </div>
              )}
            </article>
          );

          return (
            <FadeInSection key={index} className={index < workSections.length - 1 ? "mb-16" : ""}>
              {work.url ? (
                <a href={work.url} target="_blank" rel="noopener noreferrer" className="block">
                  {articleContent}
                </a>
              ) : (
                articleContent
              )}
            </FadeInSection>
          );
        })}

        {/* Footer */}
        <FadeInSection>
          <footer className="mt-20 flex flex-col gap-4 border-t border-warm-gray/50 pt-8 text-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p>Thanks for checking this out</p>
              <p>Me and Claude Code like &#9996;</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <p>
                <a href="https://drive.google.com/file/d/14Ki6bSKAT2-WeS7banVjEOyyrCBfsuuq/view?usp=sharing" className="underline hover:text-charcoal-light">
                  Resume
                </a>
              </p>
              <p>
                <a href="https://www.linkedin.com/in/sherry-liu-0183a7167/" className="underline hover:text-charcoal-light">
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
