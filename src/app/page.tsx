import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <section id="hero" className="section hero">
        <p className="kicker">Act I · Arrival — Software engineer</p>
        <h1 className="display">
          Building living
          <br />
          <em>interfaces</em> from code.
        </h1>
        <p className="lede">
          I&apos;m Satish — a full-stack developer crafting immersive,
          performant experiences for the web.
        </p>
        <div className="scroll-cue">Scroll</div>
      </section>

      <section id="work" className="section">
        <p className="kicker">Act II · The work</p>
        <h2 className="display">Selected work</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.slug} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.oneLiner}</p>
              <div className="project-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="section">
        <p className="kicker">Act III · The making</p>
        <h2 className="display">
          Code is a <em>craft</em>.
        </h2>
        <p className="lede">
          I care about the space where engineering meets design — interfaces
          that feel alive without getting in the way. This bio is a
          placeholder; the real story lands here soon.
        </p>
      </section>

      <section id="experience" className="section">
        <p className="kicker">Act IV · Reaching</p>
        <h2 className="display">Experience</h2>
        <div className="timeline">
          <div className="timeline-item">
            <p className="when">Placeholder · 20XX — now</p>
            <h3>Role goes here</h3>
            <p>
              A sentence about what was built, shipped, or learned. Replace
              with real experience entries.
            </p>
          </div>
          <div className="timeline-item">
            <p className="when">Placeholder · 20XX — 20XX</p>
            <h3>Earlier role goes here</h3>
            <p>Another placeholder entry for the timeline.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <p className="kicker">Act V · Hello</p>
        <h2 className="display">
          Let&apos;s build something <em>alive</em>.
        </h2>
        <a className="contact-link" href="mailto:satish.grg627@gmail.com">
          satish.grg627@gmail.com
        </a>
        <div className="socials">
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            X
          </a>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Satish · Built with Next.js + Three.js
      </footer>
    </>
  );
}
