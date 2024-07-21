'use client';
import React from 'react';
import BackgroundGradient  from './ui/BackgroundGradient';  
import projectData from '../data/network.json';  // Adjust the path based on your project structure
import Link from 'next/link';
import Image from 'next/image';

interface Project {
    name: string;
    description: string;
    image: string;
    website: string; // Added website field for more relevant info
}

const FeaturedBlockchainProjects = () => {

    // Filtering out the featured projects if any logic is needed (e.g., based on some property)
    const featuredProjects = projectData.projects;  // Adjust filtering logic as needed

    return (
        <div className="relative py-12">
            {/* Apply gradient background */}
            <div className="absolute inset-0 BackgroundGradient z-[-1]"></div>
            <div className="relative">
                <div className="text-center">
                    <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">FEATURED BLOCKCHAIN PROJECTS</h2>
                    <p className="my-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Explore the Leading Projects</p>
                </div>
                <div className="mt-10 mx-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {featuredProjects.map((project: Project, index: number) => (
                            <div key={index} className="flex justify-center">
                                <BackgroundGradient
                                    className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm"
                                >
                                    <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                                        <Image
                                            src={project.image}
                                            alt={project.name}
                                            height={400}
                                            width={400}
                                            className="object-contain rounded rounded-ss-lg"
                                        />
                                        <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">{project.name}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">{project.description}</p>
                                        <Link href={project.website} className='mt-2 text-teal-600 hover:underline'>
                                            Visit Website
                                        </Link>
                                    </div>
                                </BackgroundGradient>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeaturedBlockchainProjects;
