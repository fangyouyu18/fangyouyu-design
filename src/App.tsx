import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Heart,
  Mail,
  Map,
  MessageSquare,
  Moon,
  Network,
  PanelsTopLeft,
  Phone,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import Galaxy from "./components/Galaxy";
import ShinyText from "./components/ShinyText";
import { evidenceIcon, featuredProject, growthStages, projects } from "./content/projects";
import type { Project } from "./content/projects";

type Theme = "light" | "dark";

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const projectId = hash.startsWith("#/projects/") ? hash.replace("#/projects/", "") : null;
  const route = hash.replace(/^#\/?/, "").split("/")[0] || "home";
  return { hash, projectId, route };
}

function ParticleField({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let animationId = 0;
    const particles = Array.from({ length: 72 }, (_, index) => ({
      x: (index * 97) % 1100,
      y: (index * 53) % 620,
      vx: ((index % 5) - 2) * 0.12,
      vy: ((index % 7) - 3) * 0.08,
      size: 1 + (index % 3) * 0.45,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);
      const dot = theme === "dark" ? "rgba(121, 213, 204, 0.76)" : "rgba(10, 92, 118, 0.68)";
      const line = theme === "dark" ? "rgba(121, 213, 204, 0.16)" : "rgba(10, 92, 118, 0.14)";
      const pulse = 0.6 + Math.sin(frame / 90) * 0.22;

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.beginPath();
        context.fillStyle = dot;
        context.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        context.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 118) {
            context.beginPath();
            context.strokeStyle = line;
            context.lineWidth = 1 - distance / 118;
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      animationId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}

function App() {
  const { projectId, route } = useHashRoute();
  const currentProject = projects.find((project) => project.id === projectId);

  return (
    <div className="app-shell">
      {currentProject ? <ProjectDetail project={currentProject} /> : <RouteView route={route} />}
    </div>
  );
}

function RouteView({ route }: { route: string }) {
  if (route === "profile") return <ProfilePage />;
  if (route === "skills") return <SkillsPage />;
  if (route === "projects") return <ProjectsPage />;
  if (route === "contact") return <ContactPage />;
  if (route === "life") return <LifePage />;
  return <Home />;
}

function SubpageShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={`subpage-shell ${className}`.trim()}>
      <span className="subpage-bg" aria-hidden="true" />
      <Galaxy
        density={0.58}
        glowIntensity={0.12}
        mouseInteraction={false}
        repulsionStrength={0.42}
        rotationSpeed={0.018}
        saturation={0}
        speed={0.42}
        starSpeed={0.24}
        twinkleIntensity={0.12}
      />
      <span className="subpage-overlay" aria-hidden="true" />
      <span className="subpage-hud" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <div className="subpage-content">{children}</div>
    </main>
  );
}

function Header({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#/" aria-label="返回首页">
        <span className="brand-mark">AI</span>
        <span>
          <strong>训练师作品集</strong>
          <small>标注 / 质检 / Prompt / 评估</small>
        </span>
      </a>
      <nav className="nav-links" aria-label="主导航">
        <a href="#/profile">个人</a>
        <a href="#/skills">能力</a>
        <a href="#/projects">项目</a>
        <a href="#/life">生活</a>
        <a className="nav-cta" href="#/contact">联系</a>
        <button
          className="icon-button"
          type="button"
          aria-label={theme === "light" ? "切换深色模式" : "切换浅色模式"}
          title={theme === "light" ? "切换深色模式" : "切换浅色模式"}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
    </header>
  );
}

function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const modules = [
    {
      href: "#/profile",
      title: "个人信息",
      displayTitle: "基本信息",
      label: "Profile",
      description: "姓名、学历、求职定位和基础信息。",
      icon: User,
      meta: "方友余 / 本科",
    },
    {
      href: "#/skills",
      title: "能力",
      displayTitle: "个人能力",
      label: "Skills",
      description: "数据标注、质检、Prompt、工作流与模型评估。",
      icon: BarChart3,
      meta: "6 组能力",
    },
    {
      href: "#/projects",
      title: "项目",
      displayTitle: "历史项目",
      label: "Projects",
      description: "按成长路径整理的 AI训练师项目案例。",
      icon: BriefcaseBusiness,
      meta: "5 个案例",
    },
    {
      href: "#/contact",
      title: "联系方式",
      displayTitle: "联系方式",
      label: "Contact",
      description: "电话、邮箱和后续简历入口。",
      icon: Mail,
      meta: "可直接沟通",
    },
    {
      href: "#/life",
      title: "个人生活",
      displayTitle: "个人生活",
      label: "Life",
      description: "用于补充性格、兴趣和长期成长记录。",
      icon: Heart,
      meta: "待补充",
    },
  ];
  const heroModules = modules.filter((module) => module.href !== "#/contact");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--cursor-x", `${x}%`);
    hero.style.setProperty("--cursor-y", `${y}%`);
  };

  return (
    <main>
      <section className="welcome-hero" ref={heroRef} onPointerMove={handleHeroPointerMove}>
        <span className="welcome-bg" aria-hidden="true" />
        {!prefersReducedMotion && (
          <Galaxy
            density={1.18}
            glowIntensity={0.28}
            hueShift={126}
            repulsionStrength={2.85}
            rotationSpeed={0.034}
            saturation={0}
            speed={0.74}
            starSpeed={0.42}
            twinkleIntensity={0.24}
          />
        )}
        <span className="welcome-depth" aria-hidden="true" />
        <span className="welcome-light" aria-hidden="true" />
        <span className="welcome-beams" aria-hidden="true" />
        <nav className="welcome-nav" aria-label="首页导航">
          <a className="welcome-brand" href="#/">
            <span className="hud-status" aria-hidden="true" />
            <span>
              <strong>方友余</strong>
              <small>Personal Space</small>
            </span>
          </a>
          <a className="welcome-cta" href="#/contact">
            <span>
              <strong>联系</strong>
              <small>Available</small>
            </span>
            <span className="hud-signal" aria-hidden="true" />
          </a>
        </nav>

        <div className="welcome-content">
          <span>Personal Portfolio</span>
          <h1>
            <ShinyText
              text="Hi，欢迎来到我的世界。"
              className="welcome-shiny-title"
              color="rgba(236, 233, 224, 0.92)"
              shineColor="#fffdf6"
              speed={1.5}
              spread={110}
              yoyo
            />
          </h1>
          <p>保持清醒，持续学习，把复杂问题整理成清楚的表达。</p>
          <div className="hero-module-links" aria-label="作品集模块入口">
            {heroModules.map((module, moduleIndex) => {
              const Icon = module.icon;
              return (
                <a className="hero-module-link" href={module.href} key={module.title}>
                  <span className="particle-cloud" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, particleIndex) => (
                      <i
                        className="particle-dot"
                        key={particleIndex}
                        style={{
                          "--x": `${12 + ((particleIndex * 17 + moduleIndex * 11) % 76)}%`,
                          "--y": `${34 + ((particleIndex * 23 + moduleIndex * 7) % 74)}%`,
                          "--dx": `${((particleIndex % 7) - 3) * 9}px`,
                          "--dy": `${-52 - ((particleIndex * 13 + moduleIndex * 9) % 34)}px`,
                          "--size": `${3 + ((particleIndex + moduleIndex) % 3)}px`,
                          "--delay": `${-(particleIndex * 0.58 + moduleIndex * 0.25)}s`,
                        } as React.CSSProperties}
                      />
                    ))}
                  </span>
                  <span className="module-surface">
                    <span className="module-hover-circle" aria-hidden="true" />
                    <span className="tech-icon-wrap">
                      <span className="tech-icon-core">
                        <Icon size={22} />
                      </span>
                      <span className="icon-dissolve-particles" aria-hidden="true">
                        {Array.from({ length: 12 }, (_, iconParticleIndex) => (
                          <i
                            key={iconParticleIndex}
                            style={{
                              "--ix": `${32 + ((iconParticleIndex * 17 + moduleIndex * 7) % 38)}%`,
                              "--iy": `${28 + ((iconParticleIndex * 19 + moduleIndex * 9) % 44)}%`,
                              "--idx": `${((iconParticleIndex % 6) - 2.5) * 13}px`,
                              "--idy": `${((iconParticleIndex % 4) - 1.5) * 9}px`,
                              "--idelay": `${iconParticleIndex * 0.026}s`,
                            } as React.CSSProperties}
                          />
                        ))}
                      </span>
                    </span>
                    <span className="module-label-stack">
                      <span className="module-label-text">{module.displayTitle}</span>
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfilePage() {
  return (
    <SubpageShell className="subpage-profile">
      <section className="page-hero">
        <a className="back-link" href="#/">
          <ArrowLeft size={18} />
          返回模块
        </a>
        <p className="eyebrow">
          <User size={16} />
          Profile
        </p>
        <h1>方友余</h1>
        <p>本科，应届生，目标岗位为 AI训练师。作品集聚焦可验证的训练流程、评估标准和项目表达。</p>
      </section>

      <section className="info-grid">
        <InfoCard icon={<User size={22} />} title="姓名" value="方友余" />
        <InfoCard icon={<GraduationCap size={22} />} title="学历" value="本科" />
        <InfoCard icon={<BriefcaseBusiness size={22} />} title="求职方向" value="AI训练师" />
        <InfoCard icon={<Map size={22} />} title="作品集定位" value="成长型 AI训练项目展示" />
      </section>

      <section className="section-band compact-section">
        <SectionHeading
          icon={<Sparkles size={20} />}
          label="Positioning"
          title="核心定位"
          description="以客服办公场景为切入点，从基础标注逐步扩展到质检、Prompt、工作流和模型评估，展示应届生可落地的学习路径和执行能力。"
        />
      </section>
    </SubpageShell>
  );
}

function SkillsPage() {
  return (
    <SubpageShell className="subpage-skills">
      <section className="page-hero">
        <a className="back-link" href="#/">
          <ArrowLeft size={18} />
          返回模块
        </a>
        <p className="eyebrow">
          <BarChart3 size={16} />
          Skills
        </p>
        <h1>能力模块</h1>
        <p>能力展示绑定项目产出、评估标准和复盘文档，避免只罗列关键词。</p>
      </section>

      <section className="section-band compact-section">
        <div className="skill-layout">
          <div className="skill-column">
            <SkillRow title="数据理解" items={["意图识别", "标签体系", "边界样例", "语料清洗"]} />
            <SkillRow title="质量管理" items={["抽检规则", "错误归因", "返修建议", "一致性校准"]} />
            <SkillRow title="Prompt设计" items={["变量控制", "结构化输出", "风险约束", "效果对比"]} />
          </div>
          <div className="skill-column">
            <SkillRow title="工作流思维" items={["节点拆解", "人工升级", "异常兜底", "指标定义"]} />
            <SkillRow title="模型评估" items={["Rubric评分", "多模型对比", "错误分析", "专业报告"]} />
            <SkillRow title="表达改写" items={["客服语气", "事实完整", "行动清晰", "边界安全"]} />
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}

function ProjectsPage() {
  return (
    <SubpageShell className="subpage-projects">
      <section className="page-hero">
        <a className="back-link" href="#/">
          <ArrowLeft size={18} />
          返回模块
        </a>
        <SectionHeading
          icon={<Map size={20} />}
          label="Project Roadmap"
          title="从执行到评估的五段式项目路线"
        />
      </section>

      <section className="section-band compact-section">
        <div className="stage-track">
          {growthStages.map((item, index) => {
            const project = projects[index];

            return (
              <a className="stage-item" href={`#/projects/${project.id}`} key={item.stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.stage}</h3>
              <p>{item.focus}</p>
              <strong>{item.proof}</strong>
                <div className="tag-list stage-tags">
                  {project.abilities.map((ability) => (
                    <span key={ability}>{ability}</span>
                  ))}
                </div>
                <em>
                  阅读案例 <ArrowRight size={16} />
                </em>
              </a>
            );
          })}
        </div>
      </section>
    </SubpageShell>
  );
}

function ContactPage() {
  return (
    <SubpageShell className="subpage-contact">
      <section className="contact-section standalone-contact">
        <div>
          <p className="eyebrow">
            <MessageSquare size={16} />
            Contact
          </p>
          <h2>方友余，本科学历，目标岗位：AI训练师。</h2>
          <p>
            可沟通 AI训练师、数据标注质检、Prompt 运营、模型评估相关机会。
          </p>
        </div>
        <div className="contact-actions">
          <a className="primary-action" href="mailto:2528634375@qq.com">
            2528634375@qq.com <Mail size={18} />
          </a>
          <a className="secondary-action" href="tel:18868765277">
            18868765277 <Phone size={18} />
          </a>
          <a className="secondary-action" href="#/projects/multi-model-evaluation">
            查看代表案例 <ExternalLink size={18} />
          </a>
        </div>
      </section>
    </SubpageShell>
  );
}

function LifePage() {
  return (
    <SubpageShell className="subpage-life">
      <section className="page-hero">
        <a className="back-link" href="#/">
          <ArrowLeft size={18} />
          返回模块
        </a>
        <p className="eyebrow">
          <Heart size={16} />
          Life
        </p>
        <h1>个人生活</h1>
        <p>这里暂时保留为低密度页面，后续可以加入兴趣、阅读、学习记录或个人照片。</p>
      </section>

      <section className="life-panel">
        <div>
          <span>当前状态</span>
          <h2>先保持克制，不用无关生活内容稀释求职重点。</h2>
        </div>
        <p>
          后续建议只补充能支持职业形象的内容，例如长期学习记录、AI工具使用习惯、阅读笔记或个人表达能力样例。
        </p>
      </section>
    </SubpageShell>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <article className="info-card">
      {icon}
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function HomeGallery({ stats }: { stats: Array<{ value: string; label: string }> }) {
  return (
    <div className="home-gallery" aria-label="作品集视觉概览">
      <div className="stage-pills" aria-label="能力阶段">
        {growthStages.map((item) => (
          <span key={item.stage}>{item.stage}</span>
        ))}
      </div>
      <div className="gallery-grid">
        <article className="gallery-card gallery-card-large">
          <span>Featured case</span>
          <h2>{featuredProject.title}</h2>
          <p>{featuredProject.subtitle}</p>
          <a href={`#/projects/${featuredProject.id}`} aria-label={`查看${featuredProject.title}`}>
            阅读案例 <ArrowRight size={16} />
          </a>
        </article>
        <article className="gallery-card gallery-card-photo">
          <span>Evaluation notes</span>
          <div className="note-lines">
            <i />
            <i />
            <i />
            <i />
          </div>
        </article>
        <article className="gallery-card gallery-card-stat">
          <Network size={22} />
          <strong>{stats[0].value}</strong>
          <span>{stats[0].label}</span>
        </article>
        <article className="gallery-card gallery-card-stat">
          <strong>{stats[1].value}</strong>
          <span>{stats[1].label}</span>
        </article>
        <article className="gallery-card gallery-card-wide">
          <span>{stats[2].value}</span>
          <p>{stats[2].label}，先上线可信版本，再持续补充真实项目深度。</p>
        </article>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  label,
  title,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        {icon}
        {label}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon;

  return (
    <article className="project-card">
      <div className="card-topline">
        <span>{project.stage}</span>
        <Icon size={20} />
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tag-list">
        {project.abilities.slice(0, 4).map((ability) => (
          <span key={ability}>{ability}</span>
        ))}
      </div>
      <a href={`#/projects/${project.id}`}>
        阅读案例 <ArrowRight size={16} />
      </a>
    </article>
  );
}

function SkillRow({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="skill-row">
      <h3>{title}</h3>
      <div className="tag-list">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const Icon = project.icon;
  const EvidenceIcon = evidenceIcon;
  const related = useMemo(
    () => projects.filter((item) => item.id !== project.id).slice(0, 2),
    [project.id],
  );

  return (
    <SubpageShell className="project-detail-shell">
      <section className="detail-hero">
        <a className="back-link" href="#/">
          <ArrowLeft size={18} />
          返回首页
        </a>
        <div className="detail-hero-grid">
          <div>
            <p className="eyebrow">
              <Icon size={16} />
              {project.stage}
            </p>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
          </div>
          <aside className="detail-meta">
            <span>{project.role}</span>
            <strong>{project.duration}</strong>
            <div className="tag-list">
              {project.abilities.map((ability) => (
                <span key={ability}>{ability}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="detail-layout">
        <article className="detail-main">
          <ContentBlock title="业务背景" body={project.scenario} />
          <ContentBlock title="项目目标" body={project.goal} />

          <div className="content-block">
            <h2>执行方法</h2>
            <ol className="method-list">
              {project.method.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="sample-block">
            <div className="sample-header">
              <PanelsTopLeft size={20} />
              <h2>样例展示</h2>
            </div>
            <div className="sample-grid">
              <div>
                <span>输入</span>
                <p>{project.sample.input}</p>
              </div>
              <div>
                <span>处理结果</span>
                <p>{project.sample.output}</p>
              </div>
            </div>
            <p className="sample-note">{project.sample.note}</p>
          </div>

          <EvidenceSection title="评价标准" items={project.rubric} icon={<CheckCircle2 size={18} />} />
          <EvidenceSection title="阶段成果" items={project.outcomes} icon={<BarChart3 size={18} />} />
          <EvidenceSection title="复盘与改进" items={project.reflection} icon={<FileText size={18} />} />
        </article>

        <aside className="detail-sidebar">
          <div className="sidebar-panel">
            <div className="panel-header">
              <EvidenceIcon size={20} />
              <span>可展示产出物</span>
            </div>
            <ul>
              {project.artifacts.map((artifact) => (
                <li key={artifact}>{artifact}</li>
              ))}
            </ul>
          </div>
          <div className="sidebar-panel">
            <div className="panel-header">
              <Bot size={20} />
              <span>面试讲述点</span>
            </div>
            <ul>
              {project.interviewPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <a className="download-card" href="#contact">
            <Download size={18} />
            简历与项目文档链接后续放在这里
          </a>
        </aside>
      </section>

      <section className="related-section">
        <h2>继续查看其他阶段</h2>
        <div className="project-grid compact">
          {related.map((item) => (
            <ProjectCard project={item} key={item.id} />
          ))}
        </div>
      </section>
    </SubpageShell>
  );
}

function ContentBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="content-block">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function EvidenceSection({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="content-block">
      <h2 className="inline-heading">
        {icon}
        {title}
      </h2>
      <ul className="evidence-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>AI训练师作品集 / 第一版</span>
      <a href="#/">回到首页</a>
    </footer>
  );
}

export default App;
