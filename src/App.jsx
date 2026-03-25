import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Users, User, CheckCircle, 
  Code, Laptop, Mail, MapPin, Briefcase, 
  Send, Calendar, Layers, Pen
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './index.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // GitHub Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const observerRefs = useRef([]);
  observerRefs.current = [];

  const addToRefs = (el) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  // Fetch GitHub Projects
  useEffect(() => {
    fetch('https://api.github.com/users/ebs-23/repos?sort=pushed')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          const fetchedProjects = data
            .filter(repo => !repo.fork)
            .slice(0, 6)
            .map(repo => ({
              id: repo.id,
              name: repo.name,
              description: repo.description || 'A project developed by Emil Binu Sam.',
              url: repo.html_url,
              language: repo.language
            }));
          setProjects(fetchedProjects);
        }
        setLoadingProjects(false);
      })
      .catch(err => {
        console.error("Failed to fetch GitHub projects", err);
        setLoadingProjects(false);
      });
  }, []);

  // Typing Effect
  useEffect(() => {
    const words = ['Software Developer', 'IEEE Student Branch Leader', 'Tech Enthusiast', 'Self-Taught Coder'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let timeoutId;

    const typeWriter = () => {
      const currentWord = words[wordIndex];
      if(isDeleting) {
        setTypedText(currentWord.substring(0, charIndex - 1));
        charIndex--;
        typeSpeed = 50;
      } else {
        setTypedText(currentWord.substring(0, charIndex + 1));
        charIndex++;
        typeSpeed = 100;
      }

      if(!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if(isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      timeoutId = setTimeout(typeWriter, typeSpeed);
    };

    timeoutId = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'skills', 'projects', 'services', 'contact'];
      let current = '';
      
      for (let id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.pageYOffset >= (sectionTop - 200)) {
            current = id;
          }
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    observerRefs.current.forEach(ref => {
      if(ref) observer.observe(ref);
    });

    return () => {
      observerRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [loadingProjects]); // Re-run when products map changes elements

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      e.target.reset();
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#" className="logo">Emil<span>.</span></a>
          <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            {['home', 'about', 'skills', 'projects', 'services', 'contact'].map(item => (
              <a 
                key={item}
                href={`#${item}`} 
                className={activeSection === item ? 'active' : ''}
                onClick={handleNavClick}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            <a href="#contact" className="btn btn-outline" onClick={handleNavClick}>Contact</a>
          </nav>
          <button 
            className="mobile-menu-btn" 
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} color="#e6edf3" /> : <Menu size={24} color="#e6edf3" />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-container">
            <div className="hero-content">
              <p className="greeting">Hi there, I am</p>
              <h1 className="hero-title">Emil Binu Sam</h1>
              <h2 className="hero-subtitle">
                <span className="typing-text">{typedText}</span><span className="cursor">&nbsp;</span>
              </h2>
              <p className="hero-desc">
                A passionate, tech-enthusiast self-taught developer from <strong>Sree Buddha College of Engineering, Alappuzha</strong>. I blend creativity with logic to build aesthetic and performant web applications.
              </p>
              <div className="hero-cta">
                <a href="#projects" className="btn btn-primary">View My Work</a>
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/emilbinusam/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin size={18} /></a>
                  <a href="https://github.com/ebs-23/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub size={18} /></a>
                  <a href="#" aria-label="IEEE"><Users size={18} /></a>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="blob-shape">
                <User size={120} className="profile-placeholder" />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about section-padding">
          <div className="container">
            <div className="section-title reveal" ref={addToRefs}>
              <h2>About Me</h2>
              <div className="underline"></div>
            </div>
            <div className="about-grid">
              <div className="about-text reveal" ref={addToRefs}>
                <h3>Passionate about tech & leadership.</h3>
                <p>I am a self-taught developer with a deep passion for software engineering. What started as curiosity has turned into a daily pursuit of learning and creating innovative solutions. I thrive in challenging environments and constantly push my boundaries to master new technologies.</p>
                <p>Beyond code, I take on leadership roles at the IEEE Student Branch (<strong>Sree Buddha College of Engineering, Alappuzha</strong>), where I help organize tech events, mentor peers, and foster a collaborative engineering community. I believe in the power of technology to connect and elevate people.</p>
                <ul className="about-highlights">
                  <li><CheckCircle size={18} className="highlight-icon" /> Self-Taught Developer</li>
                  <li><CheckCircle size={18} className="highlight-icon" /> IEEE Student Branch Leader</li>
                  <li><CheckCircle size={18} className="highlight-icon" /> UI/UX Enthusiast</li>
                </ul>
              </div>
              <div className="about-stats">
                <div className="stat-card glass-card reveal" ref={addToRefs}>
                  <Code size={36} className="stat-icon" />
                  <h4>10+</h4>
                  <p>Projects Built</p>
                </div>
                <div className="stat-card glass-card reveal" ref={addToRefs}>
                  <Users size={36} className="stat-icon" />
                  <h4>Leadership</h4>
                  <p>IEEE Student Branch</p>
                </div>
                <div className="stat-card glass-card reveal" ref={addToRefs}>
                  <Laptop size={36} className="stat-icon" />
                  <h4>Self-Taught</h4>
                  <p>Constant Learner</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="skills section-padding">
          <div className="container">
            <div className="section-title text-center reveal" ref={addToRefs}>
              <h2>Skills & Expertise</h2>
              <div className="underline mx-auto"></div>
            </div>
            <div className="skills-grid">
              <div className="skill-category glass-card reveal" ref={addToRefs}>
                <h3>Frontend</h3>
                <div className="skill-tags">
                  <span>HTML5</span>
                  <span>CSS3</span>
                  <span>JavaScript</span>
                  <span>React.js</span>
                  <span>Tailwind CSS</span>
                </div>
              </div>
              <div className="skill-category glass-card reveal" ref={addToRefs}>
                <h3>Backend</h3>
                <div className="skill-tags">
                  <span>Node.js</span>
                  <span>Express</span>
                  <span>Python</span>
                  <span>SQL</span>
                  <span>Dart</span>
                </div>
              </div>
              <div className="skill-category glass-card reveal" ref={addToRefs}>
                <h3>Tools & Leadership</h3>
                <div className="skill-tags">
                  <span>Git & GitHub</span>
                  <span>Figma</span>
                  <span>Event Management</span>
                  <span>Public Speaking</span>
                  <span>Team Leading</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects section-padding">
          <div className="container">
            <div className="section-title reveal" ref={addToRefs}>
              <h2>GitHub Projects</h2>
              <div className="underline"></div>
            </div>
            <div className="projects-grid">
              {loadingProjects ? (
                <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                  Loading projects from GitHub...
                </div>
              ) : projects.length > 0 ? (
                projects.map((project, index) => (
                  <div className="project-card glass-card reveal" ref={addToRefs} key={project.id} style={{ transitionDelay: `${index * 50}ms` }}>
                    <div className="project-img placeholder-img" style={{ height: '160px' }}>
                      <Briefcase size={48} />
                    </div>
                    <div className="project-info">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      {project.language && (
                        <div className="tech-stack">
                          <span>{project.language}</span>
                        </div>
                      )}
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline mt-3">View on GitHub</a>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-secondary)' }}>
                  No public repositories found.
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="services" className="services section-padding">
          <div className="container">
            <div className="section-title text-center reveal" ref={addToRefs}>
              <h2>My Services</h2>
              <div className="underline mx-auto"></div>
            </div>
            <div className="services-grid">
              <div className="service-card glass-card hover-lift reveal" ref={addToRefs}>
                <div className="service-icon">
                  <Code size={30} />
                </div>
                <h3>Web Development</h3>
                <p>Building responsive, fast, and accessible web applications using modern technologies.</p>
              </div>
              <div className="service-card glass-card hover-lift reveal" ref={addToRefs}>
                <div className="service-icon">
                  <Pen size={30} />
                </div>
                <h3>UI/UX Design</h3>
                <p>Creating intuitive and stunning user interfaces with a focus on seamless user experience.</p>
              </div>
              <div className="service-card glass-card hover-lift reveal" ref={addToRefs}>
                <div className="service-icon">
                  <Users size={30} />
                </div>
                <h3>Tech Leadership</h3>
                <p>Guiding technical teams, organizing tech events, and fostering collaborative environments.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-padding">
          <div className="container">
            <div className="contact-wrapper glass-card reveal" ref={addToRefs}>
              <div className="contact-info">
                <h2>Let's Connect</h2>
                <p>I'm currently looking for new opportunities, whether it's a role as a developer or collaborating on an exciting project. My inbox is always open!</p>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <Mail size={18} />
                    <span>hello@emilbinusam.com</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={18} />
                    <span>Kerala, India</span>
                  </div>
                </div>
                <div className="social-links mt-4">
                  <a href="https://www.linkedin.com/in/emilbinusam/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-btn"><FaLinkedin size={18} /></a>
                  <a href="https://github.com/ebs-23/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-btn"><FaGithub size={18} /></a>
                  <a href="#" aria-label="Twitter" className="social-btn"><FaTwitter size={18} /></a>
                </div>
              </div>
              <div className="contact-form">
                <form id="contactForm" onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="4" required placeholder="How can I help you?"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={isSending}>
                    {isSending ? 'Sending...' : isSent ? 'Sent Successfully!' : <><Send size={18} /> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2026 Emil Binu Sam. Built with passion at Sree Buddha College of Engineering.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
