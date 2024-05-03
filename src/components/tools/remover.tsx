"use client"
import React, { useState, useEffect, useRef } from 'react';
import Dropzone from 'react-dropzone';
import imglyRemoveBackground from '@imgly/background-removal';

const BackgroundRemoval: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const imageRef = useRef<HTMLInputElement | null>(null);
    const uploadedImg = useRef<HTMLImageElement | null>(null);
    const [fileSize, setFileSize] = useState<number>(0);
    const [showUploadSection, setShowUploadSection] = useState<boolean>(true);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [showPopupBorder, setShowPopupBorder] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showPopup) {
            setShowPopupBorder(true);
            interval = setInterval(() => {
                setShowPopupBorder(false);
                setShowPopup(false);
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [showPopup]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime) {
            interval = setInterval(() => {
                const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
                setElapsedTime(parseFloat(elapsedTimeInSeconds.toFixed(1)));
            }, 10);
        }
        return () => clearInterval(interval);
    }, [startTime]);

    const handleDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file.type.split("/")[0] !== "image") {
            setShowPopup(true);
            return;
        }

        setImage(URL.createObjectURL(file));
        setResultImage(null);
        setFileSize(file.size);
        setShowUploadSection(false);
        await removeBackground(file);
    };

    const removeBackground = async (file: File) => {
        try {
            setProcessing(true);
            setStartTime(Date.now());
            const blob = await imglyRemoveBackground(URL.createObjectURL(file));
            setResultImage(URL.createObjectURL(blob));
        } catch (error) {
            console.error('Error removing background:', error);
        } finally {
            setProcessing(false);
            setStartTime(null);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = resultImage!;
        link.download = 'background_removed_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadNewImage = () => {
        if (imageRef.current) {
            imageRef.current.click();
        }
    };

    const getElapsedTime = () => {
        if (!startTime) return "";
        return `${elapsedTime}s / ${(fileSize / 5166).toFixed(1)}s`;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {showPopup && (
                <div className={`fixed top-16 -right-50 transition-all duration-500 ${showPopupBorder ? 'right-1' : ''}`}>
                    <div className="bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 p-4 mb-4 text-yellow-800 rounded-lg flex items-center relative">
                        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Warning</span>
                        <div className="ms-3 text-sm font-medium">
                            Please upload an image file.
                        </div>
                        <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700" onClick={() => setShowPopup(false)}>
                            <span className="sr-only">Close</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b-lg ${showPopupBorder ? 'transition-all duration-10000' : ''}`}></div>
                </div>
            )}
            <div className="w-full min-w-1 max-w-lg p-6 bg-white rounded-lg shadow-md">
                {showUploadSection && (
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section
                                className="w-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6"
                                style={{ minHeight: '400px' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} style={{ display: 'none' }} />
                                <p className="text-gray-600">Drag & drop an image here, or click to select an image</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">Upload Image</button>
                            </section>
                        )}
                    </Dropzone>
                )}
                {image && !resultImage && (
                    <div style={{ opacity: "0.7" }} className="w-full min-w-10 h-96 relative flex justify-center items-center border-2 border-gray-300 rounded-lg p-6 mb-6">
                        <article className="" style={{ zIndex: '5', color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <div className="flex gap-2">
                                <div className="w-5 h-5 rounded-full animate-pulse bg-white"></div>
                                <div className="w-5 h-5 rounded-full animate-pulse bg-white"></div>
                                <div className="w-5 h-5 rounded-full animate-pulse bg-white"></div>
                            </div>
                        </article>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black',
                            opacity: '0.5'
                        }}></div>
                        <img
                            ref={uploadedImg}
                            src={image}
                            alt="Uploaded"
                            className="max-w-full max-h-full"
                        />
                        <div className="absolute w-full h-full border-2 border-yellow-400 animate-scanner"></div>
                    </div>
                )}
                {resultImage && (
                    <div>
                        <div className="w-full h-96 relative flex flex-col justify-center items-center border-2 border-gray-300 rounded-lg p-6 mb-6">
                            <img
                                src={resultImage}
                                alt="Result"
                                className="max-w-full max-h-full"
                            />
                        </div>
                        <div className="mt-4 justify-end text-end">
                            <input
                                id="image"
                                ref={imageRef}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleDrop(Array.from(e.target.files || []))}
                            />
                            <button
                                onClick={handleUploadNewImage}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md ml-2 hover:bg-gray-400 transition duration-300 ease-in-out"
                            >
                                Upload New Image
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md mr-2 hover:bg-blue-600 transition duration-300 ease-in-out"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                )}
                {processing && (
                    <div className="text-center justify-end mt-6">
                        <p className="text-gray-600 justify-items-end">{getElapsedTime()}</p>
                    </div>
                )}
            </div>
            <style>
                {`
                    @keyframes scanner {
                        0% {
                            transform: translateY(2px);
                        }
                        50% {
                            transform: translateY(calc(100% + ${uploadedImg.current?.height}px));
                        }
                        100% {
                            transform: translateY(calc(100% - 2px));
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default BackgroundRemoval;
