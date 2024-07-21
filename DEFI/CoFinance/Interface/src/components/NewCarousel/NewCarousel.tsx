import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Button from '../Button/index'; // Adjust the path as needed
import { Link } from 'react-router-dom';

const CustomCarousel = () => {
  const slidesData = [
    {
      url: 'https://deltaswap.io',
      btn: 'dApps',
      description:
        'Unified cross-chain interface, average transaction speed within 100 secs, no-slippage swap.',
      imagePath: './carousel/delta-logo.svg',
    },
    {
      url: 'https://restake.app/planq',
      btn: 'dApps',
      description:
        'REStake automatically imports Cosmos chains from the Chain Registry',
      imagePath: './carousel/castrum.svg',
    },
    {
      url: 'https://evm.planq.network/',
      btn: 'dApps',
      description: 'Planq EVM Explorer',
      imagePath: './carousel/blockscout_logo.svg',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} className="bg-gray-100 py-10">
      {slidesData.map((slide, index) => (
        <div key={index} className="flex justify-center px-4">
          <Link to={slide.url} target="_blank">
            <div className="bg-gray-800 text-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl w-full max-w-sm">
              <figure className="p-6">
                <img src={slide.imagePath} alt={slide.description} className="rounded-lg max-w-full h-36 object-contain mx-auto" />
              </figure>
              <div className="p-4 text-center">
                <div className="flex justify-center mb-4">
                  <Button className="bg-transparent border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                    <span className="text-blue-500 font-medium">
                      {slide.btn}
                    </span>
                  </Button>
                </div>
                <p className="text-gray-300 text-sm">
                  {slide.description}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </Slider>
  );
};

export default CustomCarousel;
