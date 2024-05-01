// components/BackgroundRemoval.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography } from '@material-ui/core';
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
    const [fileSize, setFileSize] = useState<number | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime) {
            interval = setInterval(() => {
                const elapsedTimeInSeconds = (Date.now() - startTime) / 1000;
                setElapsedTime(elapsedTimeInSeconds.toFixed(1));
            }, 10);
        }
        return () => clearInterval(interval);
    }, [startTime]);


    const handleDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setImage(URL.createObjectURL(file));
        setResultImage(null);
        setFileSize(file.size);
        console.log(fileSize)
        await removeBackground(file);
    };

    const removeBackground = async (file: File) => {
        try {
            setProcessing(true);
            setStartTime(Date.now());
            console.log("Processing Image");
            const blob = await imglyRemoveBackground(URL.createObjectURL(file));
            console.log("Process Complete");
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
        else {
            console.log(document.querySelector('#image'))
        }
        console.log(imageRef)
    };

    const getElapsedTime = () => {
        if (!startTime) return "";
        return `Removing background... ${elapsedTime}s / ${(fileSize / 5166 ).toFixed(1)}s`;
    };

    return (
        <div>
            {!resultImage && (
                <Dropzone onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <section style={{ display: image ? 'none' : 'block' }}>
                            <div
                                {...getRootProps()}
                                style={{
                                    width: '300px',
                                    height: '300px',
                                    margin: '20px auto',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: '#fff',
                                    border: '2px dashed #ddd',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <input {...getInputProps()} style={{display: 'none'}}/>
                                <Typography variant="body1" style={{ color: '#666', marginBottom: '10px' }}>
                                    Drag & drop an image here, or click to select an image
                                </Typography>
                                <Button variant="contained" color="primary" style={{ marginBottom: '10px' }}>
                                    Upload Image
                                </Button>
                            </div>
                        </section>
                    )}
                </Dropzone>
            )}
            {image && !resultImage && (
                <div style={{ position: 'relative', textAlign: 'center', marginTop: '20px' }}>

                    <div
                        style={{
                            position: 'absolute',
                            top: '-2px',
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#f6c57c',
                            borderRadius: '0',
                            zIndex: 2,
                            animation: 'scanner 4s linear infinite',
                            boxShadow: '0px 0px 10px 5px #FFB74D',
                        }}
                    ></div>
                    <img ref={uploadedImg}
                        src={image}
                        alt="Uploaded"
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0', border: '1px solid black', zIndex: 0 }}
                    />
                </div>
            )}
            {resultImage && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img src={resultImage} alt="Result" style={{border: '1px solid black', maxWidth: '100%', maxHeight: '300px' }} />
                    <div style={{marginTop: '16px'}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDownload}
                            style={{
                                textTransform: 'none',
                                borderRadius: '999px',
                                padding: '12px 24px',
                                marginRight: '10px'
                            }}
                        >
                            Download
                        </Button>
                        <input id='image' ref={imageRef} type='file' style={{display: 'none'}} onChange={(e) => handleDrop(e.target.files)}/>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUploadNewImage}
                            style={{textTransform: 'none', borderRadius: '999px', padding: '12px 24px'}}
                        >
                            Upload New Image
                        </Button>
                    </div>
                </div>
            )}
            {processing && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Typography variant="body1" style={{ color: '#666', marginBottom: '10px' }}>
                        {getElapsedTime()}
                    </Typography>
                </div>
            )}
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
