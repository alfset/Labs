'use client';
import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const promotions = [
    {
        image: '/Promotions/planq.jpg',
        altText: 'Unlock Your Financial Potential with DeFi!',
    },
    {
        image: '/Promotions/planq.jpg',
        altText: 'Seamless Blockchain Integration Awaits!',
    },
    {
        image: '/Promotions/planq.jpg',
        altText: 'Gain Insights with Real-Time Analytics',
    },
    {
        image: '/Promotions/planq.jpg',
        altText: 'Trustworthy and Transparent DeFi Solutions',
    },
    {
        image: '/Promotions/planq.jpg',
        altText: 'Diverse Financial Products at Your Fingertips',
    },
];

function PromotionBanner() {
    return (
        <div className="relative py-12 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md z-[-1]"></div>
            <div className="relative max-w-7xl mx-auto text-center">
                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 sm:text-4xl bg-glassy backdrop-filter backdrop-blur-md p-4 rounded-lg">
                    Enhance Your Blockchain Journey
                </p>
            </div>
            <div className="mt-10">
                <div className="flex overflow-x-auto">
                    <InfiniteMovingCards
                        items={promotions}
                        direction="right"
                        speed="slow"
                        pauseOnHover={true}
                        renderItem={({ image, altText }) => (
                            <div className="flex flex-col items-center justify-center p-4 bg-glassy backdrop-filter backdrop-blur-md rounded-lg shadow-lg mx-2 animate-border-pulse border-2 border-transparent">
                                <img
                                    src={image}
                                    alt={altText}
                                    className="object-cover w-full h-36 rounded-lg mb-2"
                                />
                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                    {altText}
                                </p>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default PromotionBanner;
