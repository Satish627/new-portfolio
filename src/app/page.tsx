import { projects, skills, experience } from "@/content/projects";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <>
      <section id="hero" className="section hero">
        <p className="kicker">Act I · Arrival — Software developer · Copenhagen</p>
        <h1 className="display">
          Building living
          <br />
          <em>interfaces</em> from code.
        </h1>
        <p className="lede">
          I&apos;m Satish Gurung — a full-stack developer and MSc Computer
          Science student at DTU, crafting immersive, performant experiences
          for the web.
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
              {project.link && (
                <a
                  className="project-link"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.linkLabel ?? "View"} ↗
                </a>
              )}
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
          I&apos;m a Copenhagen-based developer — MSc Computer Science at DTU,
          BEng Software Technology from VIA — who cares about the space where
          engineering meets design: clean architecture underneath, interfaces
          that feel alive on top.
        </p>
        <div className="tags">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="experience" className="section">
        <p className="kicker">Act IV · Reaching</p>
        <h2 className="display">Experience</h2>
        <div className="timeline">
          {experience.map((item) => (
            <div key={item.title} className="timeline-item">
              <p className="when">
                {item.when} · {item.where}
              </p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
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
          <a
            href="https://github.com/Satish627"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/satish-gurung-3a2781223"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href={`${base}/Satish_Gurung_CV.pdf`} target="_blank">
            CV
          </a>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Satish Gurung · Built with Next.js +
        Three.js
      </footer>
    </>
  );
}
