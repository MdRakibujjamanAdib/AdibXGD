import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { blogs } from '../data/blogs';
import PageTransition from '../components/layout/PageTransition';
import SEO from '../components/SEO';

const BlogDetails = () => {
    const { slug } = useParams<{ slug: string }>();

    // Find the blog post based on the slug
    const blog = blogs.find(b => b.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!blog) {
        return (
            <PageTransition>
                <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">The article you are looking for doesn't exist or has been moved.</p>
                    <Link to="/blogs" className="flex items-center gap-2 text-blue-600 dark:text-blue-500 hover:underline">
                        <ArrowLeft size={20} /> Back to Insights
                    </Link>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <SEO
                title={blog.title}
                description={blog.summary}
                image={blog.image}
                type="article"
            />
            <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-12 transition-colors font-medium">
                        <ArrowLeft size={20} /> Back to Insights
                    </Link>

                    <div className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono">
                            <span className="flex items-center gap-1"><Calendar size={16} /> {blog.date}</span>
                            <span className="flex items-center gap-1"><Tag size={16} /> {blog.category}</span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter leading-tight"
                        >
                            {blog.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12"
                        >
                            {blog.summary}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl overflow-hidden mb-16 aspect-[21/9]"
                    >
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:font-bold prose-headings:mt-12 prose-headings:mb-4 prose-a:text-blue-600 hover:prose-a:text-blue-500"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                </div>
            </div>
        </PageTransition>
    );
};

export default BlogDetails;
