
'use client'

import React, { useState } from 'react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="bg-gray-800 py-4">
                <div className="container mx-auto flex items-center">

                    <div className="md:hidden ms-3 self-end">
                        <button id="mobile-menu-btn" className="text-white bg-none focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M3 18h18v-2H3v2zM3 13h18v-2H3v2zm0-5h18v-2H3v2z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center ms-5">
                        {/*} <img src="https://www.themexpert.com/images/logo-white.svg" alt="Logo" className="h-8 mr-2"/>
                        */}
                        <span className="text-2xl font-bold text-amber-100">j</span>
                        <div className="bg-amber-950 border-0 rounded-md p-1">
                            <span className="text-red-200">D</span>
                            <span className="text-green-400">E</span>
                            <span className="text-yellow-600">V</span>
                        </div>

                        <div className="ms-7 hidden md:flex">
                            <span className="text-white font-bold text-2xl">Background Remover</span>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-grow justify-center">
                        <a href="https://themexpert.com/" className="text-white hover:text-gray-400 mx-4">Home</a>
                        <a href="https://signgen.netlify.app/" className="text-white hover:text-gray-400 mx-4">Signature
                            Generator</a>
                        <a href="https://themexpert.com/contact"
                           className="text-white hover:text-gray-400 mx-4">Contact</a>
                    </div>


                </div>
            </nav>

            <div
                className={`container mx-auto ${isMobileMenuOpen ? 'block' : 'hidden'} z-10 fixed md:hidden bg-gray-800 py-4`}>
                <div className=" text-center">
                    <span className="text-white font-bold text-2xl">Background Remover</span>
                </div>
                <div className="flex flex-col items-center mt-4">
                    <a href="https://themexpert.com/" className="text-white hover:text-gray-400">Home</a>
                    <a href="https://signgen.netlify.app/" className="text-white hover:text-gray-400 mt-2">Signature Generator</a>
                    <a href="https://themexpert.com/contact" className="text-white hover:text-gray-400 mt-2">Contact</a>
                </div>
            </div>
        </>
    );
};

export default Header;
