// src/pages/Home.jsx
// Landing page for She Can Foundation

import { Link } from 'react-router-dom';
import {
  HiArrowRight, HiHeart, HiLightningBolt, HiUserGroup, HiAcademicCap, HiGlobe,
} from 'react-icons/hi';

// ── Stats Data ──────────────────────────────────────────────────────────────
const stats = [
  { label: 'Women Empowered', value: '10,000+', icon: HiUserGroup },
  { label: 'Programs Launched', value: '50+', icon: HiLightningBolt },
  { label: 'States Reached', value: '15+', icon: HiGlobe },
  { label: 'Volunteers & Members', value: '500+', icon: HiAcademicCap },
];

// ── Program Cards ─────────────────────────────────────────────────────────────
const programs = [
  {
    icon: '🎓',
    title: 'Education & Skill Development',
    description: 'Providing underprivileged women access to quality education, vocational training, and digital literacy to build independent futures.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: '💼',
    title: 'Career & Livelihood Support',
    description: 'Mentorship, job-readiness workshops, and placement support to help women achieve financial independence and career growth.',
    color: 'from-primary-500 to-secondary-600',
  },
  {
    icon: '💡',
    title: 'Entrepreneurship & Self-Reliance',
    description: 'Equipping women with business skills, microfinance awareness, and mentorship to launch and sustain their own ventures.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: '🌱',
    title: 'Health & Social Welfare',
    description: 'Promoting physical and mental health awareness, hygiene education, and support during crisis situations for women in need.',
    color: 'from-green-500 to-teal-600',
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Priya Kumari',
    role: 'Skill Training Graduate',
    quote: 'She Can Foundation gave me the skill training I needed to start my own tailoring business. Today I support my entire family with dignity.',
    avatar: 'P',
    color: 'from-pink-500 to-purple-600',
  },
  {
    name: 'Sunita Devi',
    role: 'Program Participant',
    quote: 'The foundation not only taught me to read and write, but also helped me understand my rights. I am a different woman today because of She Can.',
    avatar: 'S',
    color: 'from-blue-500 to-teal-500',
  },
  {
    name: 'Meena Rawat',
    role: 'Entrepreneur & Member',
    quote: 'With support from She Can Foundation, I opened a small grocery shop. The encouragement and guidance from Reeta Mishra and the team was invaluable.',
    avatar: 'M',
    color: 'from-orange-500 to-pink-500',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-hero-gradient min-h-[85vh] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-pink-300 mb-6 animate-fade-in">
            <HiHeart className="w-4 h-4" />
            <span>Govt. Registered NGO · Indian Society Act, 1860</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Together We Can<br />
            Change <span className="text-pink-300">The World</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
            She Can Foundation is a government-registered NGO dedicated to empowering underprivileged women through education, skill development, health awareness, and social welfare. Founded by <span className="text-pink-300 font-semibold">Reeta Mishra</span>, we believe every woman deserves the opportunity to thrive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/contact" className="btn-primary text-base px-8 py-4">
              Get In Touch
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <a href="#programs" className="btn-secondary text-base px-8 py-4 border-white/40 text-white hover:bg-white/10">
              Our Programs
            </a>
          </div>

          {/* Floating stats bar */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-primary-400/30 transition-all duration-300 group shadow-xl">
                <Icon className="w-6 h-6 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-bold text-white font-heading">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Section ── */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              Our Mission
            </span>
            <h2 className="section-heading mb-6">
              Global Vision,<br />
              <span className="gradient-text">Local Action</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              She Can Foundation is committed to creating positive change and empowering women in communities across India and the globe. We don't ask for much — just help us with what you can: be it money, skill, or your time. Join our team and be a part of an organization dedicated to creating a more equitable society, one woman at a time.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              Founded by <span className="text-primary-600 dark:text-primary-400 font-semibold ml-1">Reeta Mishra</span>, President & Founder, She Can Foundation
            </div>
          </div>
        </div>
      </section>

      {/* ── Programs Section ── */}
      <section id="programs" className="py-20 bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              What We Do
            </span>
            <h2 className="section-heading mb-4">Our Programs</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Comprehensive support systems designed to help women at every stage of their journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map(({ icon, title, description, color }) => (
              <div
                key={title}
                className="card group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="section-heading mb-4">Stories That <span className="gradient-text">Inspire</span></h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Hear from the women whose lives have been transformed through our programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, avatar, color }) => (
              <div key={name} className="card hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">"{quote}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a <span className="text-pink-300">Difference?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
            Whether you want to volunteer, partner, or simply reach out — we'd love to hear from you.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-pink-50 font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
            Contact Us Today
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
