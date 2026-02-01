import React from 'react';
import SpotlightCard from '../components/ui/SpotlightCard';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    About the Developer
                </h1>

                <h2 className="text-2xl font-semibold mb-2 dark:text-white">Gnanasekaran</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 italic">
                    Aspiring Java Developer | Full Stack Enthusiast
                </p>

                <SpotlightCard className="text-left p-8" spotlightColor="rgba(124, 58, 237, 0.2)">
                    <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Professional Summary</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Aspiring Java Developer with a strong foundation in Core Java, OOP, and SQL, eager to assist in developing and maintaining high-quality Java-based applications. Passionate about writing clean, well-documented code and following industry best practices. Specific interest in collaborating with senior developers to fix bugs, support testing activities, and contribute to scalable software solutions.
                    </p>

                    <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Technical Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            <strong className="block text-blue-600 dark:text-blue-400 mb-1">Core & Backend</strong>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">Java (OOP, Multithreading, Streams), Python, SQL, Custom DSA</span>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            <strong className="block text-purple-600 dark:text-purple-400 mb-1">Web & Tools</strong>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">HTML5, CSS3, JSON, Docker, Git & GitHub, Linux</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mt-8 mb-4 dark:text-gray-100">Education</h3>
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold dark:text-white">B.E. Computer Science and Engineering</h4>
                        <p className="text-gray-500 dark:text-gray-400">C. Abdul Hakeem College of Engineering</p>
                        <p className="text-sm text-gray-400">2022 – 2026 | CGPA: 7.8</p>
                    </div>
                </SpotlightCard>
            </div>
        </div>
    );
};

export default About;
