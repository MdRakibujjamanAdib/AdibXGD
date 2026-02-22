
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { personalInfo } from '../data/content';
import PageTransition from '../components/layout/PageTransition';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageTransition>
      <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left Column */}
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-bold mb-12 tracking-tighter text-black dark:text-white leading-[0.9]"
              >
                Let's <br />
                <span className="text-blue-600 dark:text-blue-500">Talk.</span>
              </motion.h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-16 leading-relaxed max-w-lg">
                Have a project in mind? I'm always open to discussing new opportunities, creative ideas, or just having a chat.
              </p>

              <div className="space-y-10">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Email</h3>
                  <a href={`mailto:${personalInfo.email}`} className="text-2xl md:text-3xl font-bold hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
                
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Socials</h3>
                  <div className="flex gap-6">
                    <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-500 transition-colors">LinkedIn</a>
                    <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-500 transition-colors">GitHub</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Minimal Form */}
            <div className="lg:pt-8">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 dark:bg-zinc-900 p-12 rounded-3xl text-center"
                >
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-500 mb-6 mx-auto">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-black dark:text-white">Message Sent</h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">I'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-500 font-bold text-lg"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 border-gray-200 dark:border-zinc-800 py-4 text-xl md:text-2xl font-bold text-black dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors placeholder-gray-300 dark:placeholder-zinc-700"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 border-gray-200 dark:border-zinc-800 py-4 text-xl md:text-2xl font-bold text-black dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors placeholder-gray-300 dark:placeholder-zinc-700"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full bg-transparent border-b-2 border-gray-200 dark:border-zinc-800 py-4 text-xl md:text-2xl font-bold text-black dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors placeholder-gray-300 dark:placeholder-zinc-700 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 text-2xl font-bold text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors mt-8 group"
                  >
                    Send Message <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
