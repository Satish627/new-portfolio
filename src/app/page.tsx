import Image from "next/image";
import {
  home,
  about,
  projects,
  education,
  contact,
} from "@/content/site";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <>
      <section id="home" className="section hero">
        <p className="kicker">{home.badge}</p>
        <h1 className="display">
          Software Developer building{" "}
          <em className="grad-text">modern web applications</em>.
        </h1>
        <p className="tagline">{home.tagline}</p>
        {home.paragraphs.map((p) => (
          <p key={p} className="lede">
            {p}
          </p>
        ))}
        <div className="tags">
          {home.techStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="cta-row">
          {home.ctas.map((cta) => (
            <a
              key={cta.label}
              href={cta.href}
              className={cta.variant === "solid" ? "btn btn-solid" : "btn"}
            >
              {cta.label}
            </a>
          ))}
        </div>
        <div className="scroll-cue">Scroll</div>
      </section>

      <section id="about" className="section">
        <p className="kicker">{about.kicker}</p>
        <h2 className="display">About me</h2>
        <p className="lede">{about.description}</p>
        <ul className="details">
          {about.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <div className="story-grid">
          {about.storySteps.map((step) => (
            <div key={step.phase} className="story-step">
              <p className="story-phase">{step.phase}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <p className="kicker">{projects.kicker}</p>
        <h2 className="display">Projects</h2>
        <p className="lede">{projects.description}</p>
        <div className="project-grid">
          {projects.featured.map((project) => (
            <article key={project.title} className="project-card">
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <p className="project-highlight">{project.highlight}</p>
              <div className="project-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              {project.links.length > 0 && (
                <div className="project-links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="section">
        <p className="kicker">{education.kicker}</p>
        <h2 className="display">Education</h2>
        <p className="lede">{education.description}</p>
        <div className="milestones">
          {education.milestones.map((m) => (
            <article key={m.institution} className="milestone">
              <div className="milestone-head">
                <Image
                  src={`${base}${m.logo}`}
                  alt={`${m.institution} logo`}
                  width={44}
                  height={44}
                  className="milestone-logo"
                  unoptimized
                />
                <div>
                  <h3>{m.institution}</h3>
                  <p className="milestone-meta">
                    {m.period} · {m.location}
                  </p>
                </div>
                <span className="milestone-status">{m.status}</span>
              </div>
              <p className="milestone-program">{m.program}</p>
              <p className="milestone-summary">{m.summary}</p>
              <div className="project-stack">
                {m.focus.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={m.website} target="_blank" rel="noreferrer">
                  Website ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section">
        <p className="kicker">{contact.kicker}</p>
        <h2 className="display">
          Let&apos;s build <em className="grad-text">something</em>.
        </h2>
        <p className="lede">{contact.description}</p>
        <ul className="details">
          {contact.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <div className="tags">
          {contact.availability.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
        <div className="contact-grid">
          {contact.contactInfo.map((info) => (
            <a
              key={info.label}
              href={info.href}
              className="contact-item"
              target={info.href.startsWith("http") ? "_blank" : undefined}
              rel={info.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <span className="contact-label">{info.label}</span>
              <span className="contact-value">{info.value}</span>
            </a>
          ))}
        </div>
        <div className="cta-row">
          <a
            className="btn btn-solid"
            href={`${base}${contact.cv.href}`}
            target="_blank"
          >
            {contact.cv.label}
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
