import PortfolioFooter from './layout/PortfolioFooter';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';

const questions = [
  [
    'What does Adib / Visbeyond do?',
    'We build high-impact websites, brand identities, AI-powered automation, and cinematic 3D visuals designed for maximum ROI and seamless digital experiences.',
  ],
  [
    'How do we get started?',
    'Send a short description of your project, timeline, and goals. We set up a brief onboarding call and begin executing immediately.',
  ],
  [
    'Do you use AI in your work?',
    'We combine AI for rapid prototyping, data automation, and research with 100% human-crafted creative art, coding, and production to deliver pristine quality.',
  ],
  [
    'Why choose us over traditional agencies?',
    'You work directly with a senior technologist and designer who connects visual brand identity, UI/UX engineering, and technical implementation without agency overhead.',
  ],
  [
    'What is your delivery timeline?',
    'Sprint deliverables typically range from 48 hours for rapid design assets to 2–3 weeks for full website and 3D architectural setups.',
  ],
  [
    'How do revisions and feedback work?',
    'We maintain transparent communication with dedicated design boards and iterative sprints until the project outcome is pixel-perfect.',
  ],
];

export default function HomeSections() {
  return (
    <>
      {/* All Projects Navigation Bar */}
      <Link className="vb-all-projects group" to="/projects">
        <span className="flex items-center justify-center gap-2">
          All Projects <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </Link>

      {/* Frequently Asked Questions */}
      <section className="vb-faq" aria-label="Frequently asked questions">
        {questions.map(([question, answer]) => (
          <details key={question} className="group">
            <summary>
              <span>{question}</span>
              <Plus size={20} className="transition-transform duration-300 group-open:rotate-45 text-[#e62e05]" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <PortfolioFooter />
    </>
  );
}
