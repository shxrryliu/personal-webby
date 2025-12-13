'use client';

import { useState } from 'react';

type WindowType = 'about' | 'work' | 'contact' | null;

export default function Home() {
  const [openWindow, setOpenWindow] = useState<WindowType>('about');

  const handleFolderClick = (type: WindowType) => {
    setOpenWindow(openWindow === type ? null : type);
  };

  const closeWindow = () => {
    setOpenWindow(null);
  };

  return (
    <div className="min-h-screen bg-[#EBE8DF] relative overflow-hidden">
      {/* Fibonacci Spiral Background Image - positioned from top-left */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/fibonacci-spiral.png)',
          backgroundPosition: 'top left',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: 1
        }}
      ></div>

      {/* Hero Section - approximately 60-65% of viewport height */}
      <div className="relative h-[65vh] flex flex-col items-center justify-start pt-12">
        {/* Title Section */}
        <div className="relative z-10 text-center mb-6">
          <div className="flex items-baseline justify-center gap-3">
            <h1 className="text-5xl md:text-6xl text-black font-playfair font-semibold italic">
              portfolio
            </h1>
            <span className="text-[10px] font-sans text-black">v2026.0</span>
          </div>
          <p className="text-[10px] font-sans text-black mt-1">[sherry xinrui liu]</p>
        </div>

        {/* Central Portrait with Circular Mask - positioned slightly left of center */}
        <div className="relative z-10 mb-4 -ml-8">
          <div className="w-40 h-40 md:w-48 md:h-48 relative">
            {/* Circular portrait cutout */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
              {/* Placeholder portrait */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-400"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Folder Icons - positioned along golden spiral to match Figma */}
        <div className="relative z-10 w-full h-full">
          {/* about.me folder - left of portrait, slightly below horizontal center */}
          <div className="absolute left-[18%] top-[-50%]">
            <button
              onClick={() => handleFolderClick('about')}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-14 md:w-20 md:h-16 bg-[#DDA097] rounded-t-lg rounded-br-lg shadow-md flex items-center justify-center">
                <div className="w-10 h-8 md:w-12 md:h-10 bg-white/20 rounded"></div>
              </div>
              <span className="text-[10px] font-sans text-black mt-1">about.me</span>
            </button>
          </div>

          {/* my_work.hehe folder - top-right of portrait */}
          <div className="absolute right-[18%] top-[28%]">
            <button
              onClick={() => handleFolderClick('work')}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-14 md:w-20 md:h-16 bg-[#A7D7F2] rounded-t-lg rounded-br-lg shadow-md flex items-center justify-center">
                <div className="w-10 h-8 md:w-12 md:h-10 bg-white/20 rounded"></div>
              </div>
              <span className="text-[10px] font-sans text-black mt-1">my_work.hehe</span>
            </button>
          </div>

          {/* contact.info folder - bottom-right of portrait */}
          <div className="absolute right-[12%] bottom-[22%]">
            <button
              onClick={() => handleFolderClick('contact')}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-14 md:w-20 md:h-16 bg-[#F28B82] rounded-t-lg rounded-br-lg shadow-md flex items-center justify-center">
                <div className="w-10 h-8 md:w-12 md:h-10 bg-white/20 rounded"></div>
              </div>
              <span className="text-[10px] font-sans text-black mt-1">contact.info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mac-style Window - approximately 35-40% of viewport height */}
      {openWindow && (
        <div className="absolute bottom-0 left-0 right-0 h-[35vh] flex items-end justify-start pb-6 pl-8 pr-8">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Window Title Bar */}
            <div className="bg-gray-200 h-8 flex items-center px-3 gap-2">
              {/* macOS window controls */}
              <div className="flex gap-1.5">
                <button
                  onClick={closeWindow}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer"
                ></button>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm font-semibold text-black">
                  {openWindow === 'about' && 'about me'}
                  {openWindow === 'work' && 'my work'}
                  {openWindow === 'contact' && 'contact info'}
                </span>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex h-[calc(35vh-2rem)]">
              {/* Left Sidebar */}
              <div className="w-20 bg-gray-200 relative">
                {/* Sidebar image placeholder - peeking from left */}
                <div className="absolute left-0 top-4 w-14 h-40 bg-gray-300" 
                     style={{
                       clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 0 100%)',
                       borderRadius: '0 8px 8px 0'
                     }}></div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                {openWindow === 'about' && (
                  <div>
                    <h2 className="text-lg font-bold text-black mb-3">about me</h2>
                    <p className="text-sm text-black mb-4">
                      I design thoughtful technology to make the world a better place
                    </p>
                    <ul className="space-y-1.5 text-sm text-black">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          currently: a product manager at IXL Learning, serving 1 in 3 K-12 students in the United States
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>reading to expand my personal canon</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>writing about work, living, and relationships</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>painting, vintage shopping, exploring sf</span>
                      </li>
                    </ul>
                  </div>
                )}

                {openWindow === 'work' && (
                  <div>
                    <h2 className="text-lg font-bold text-black mb-3">my work</h2>
                    <p className="text-sm text-black">Work content goes here...</p>
                  </div>
                )}

                {openWindow === 'contact' && (
                  <div>
                    <h2 className="text-lg font-bold text-black mb-3">contact info</h2>
                    <p className="text-sm text-black">Contact information goes here...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
