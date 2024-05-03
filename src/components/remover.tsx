
'use client'
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
        return `Removing background... ${elapsedTime}s / ${(fileSize / 5166 ).toFixed(1)}s`;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full min-w-1 max-w-lg p-6 bg-white rounded-lg shadow-md">
                {showUploadSection && (
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <section
                                className="w-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6"
                                style={{ minHeight: '400px' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} style={{display: 'none'}}/>
                                <p className="text-gray-600">Drag & drop an image here, or click to select an image</p>
                                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">Upload Image</button>
                            </section>
                        )}
                    </Dropzone>
                )}
                {image && !resultImage && (
                    <div style={{minWidth: "450px", opacity: "0.7", backgroundColor: 'black'}} className="w-full min-w-10 h-96 relative flex justify-center items-center border-2 border-gray-300 rounded-lg p-6 mb-6">
                        <article
                            style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                            <svg className="animate-spin h-10 w-10 mr-3 text-blue-500"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </article>
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
                    <div style={{minWidth: '450px'}}>
                    <div
                            className="w-full h-96 relative flex flex-col justify-center items-center border-2 border-gray-300 rounded-lg p-6 mb-6">
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
                                style={{display: 'none'}}
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
                    <div className="text-center mt-6">
                        <p className="text-gray-600">{getElapsedTime()}</p>
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
