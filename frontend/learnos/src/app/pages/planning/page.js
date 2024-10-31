"use client";
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/Navbar';
import TaskBlock from '@/app/components/TaskBlock'; // Import the TaskStep component
import { AnimatePresence, motion } from 'framer-motion'; // Import motion and AnimatePresence

export default function Planning() {
    const [prompt, setPrompt] = useState('');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        if (prompt) formData.append('prompt', prompt);
        if (file) formData.append('file', file);
        const test = [
            {
              "title": "Task 1",
              "description": "Description for Task 1"
            },
            {
              "title": "Task 2",
              "description": "Description for Task 2"
            }
        ]

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/breakdown`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const responseData = response.data.result;
            const firstKey = Object.keys(responseData)[0];
            const result = responseData[firstKey] || [];
            // console.log(result);
            setResult(result);
        } catch (error) {
            console.error('Error:', error);
            setResult([]); // If it's not an array, reset to an empty array
        }
        setLoading(false);
    };

    // Move step up
    const handleMoveUp = (index) => {
        if (index > 0) {
            const newResult = [...result];
            const temp = newResult[index - 1];
            newResult[index - 1] = newResult[index];
            newResult[index] = temp;
            setResult(newResult);
        }
    };

    // Move step down
    const handleMoveDown = (index) => {
        if (index < result.length - 1) {
            const newResult = [...result];
            const temp = newResult[index + 1];
            newResult[index + 1] = newResult[index];
            newResult[index] = temp;
            setResult(newResult);
        }
    };

    // Delete a step
    const handleDelete = (index) => {
        const newResult = result.filter((_, i) => i !== index);
        setResult(newResult);
    };

    // Clear all steps
    const handleClearAll = (e) => {
        e.preventDefault(); // Prevent form submission when clicking Clear All
        setResult([]); // Set the result to an empty array, clearing all steps
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-20 mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Task Breakdown Assistant</h1>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-4">
                        <label htmlFor="prompt" className="block mb-2">Enter your task or assignment:</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="4"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="file" className="block mb-2">Or upload a file:</label>
                        <input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".txt, .pdf, .docx"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                        {loading ? 'Processing...' : 'Break Down Task'}
                    </button>

                    <button 
                        onClick={handleClearAll} 
                        className="bg-red-500 text-white px-4 py-2 rounded mb-4 ml-5"
                    >
                        Clear All
                    </button>
                </form>

                {/* Display the result steps */}
                {result && result.length > 0 && (
                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="font-bold mb-2">Task Breakdown:</h2>
                        <AnimatePresence>
                            <div className="space-y-4"> {/* Adds vertical spacing between each block */}
                                {result.map((step, index) => (
                                    <motion.div
                                        key={step.title}
                                        initial={{ opacity: 0, y: 20 }} // Initial state when added
                                        animate={{ opacity: 1, y: 0 }}  // Animate when in view
                                        exit={{ opacity: 0, y: -20 }}   // Animate when removed
                                        transition={{
                                            type: "spring",   // Use spring for a smooth transition
                                            stiffness: 20,    // Adjust stiffness for the spring effect
                                            damping: 10,      // Control the dampening for the spring
                                            duration: 0.2,    // Duration of the animation
                                            ease: "easeInOut" // Smooth easing
                                        }}
                                        layout
                                    >
                                        <TaskBlock
                                            step={step}
                                            index={index}
                                            resultLength = {result.length}
                                            onMoveUp={handleMoveUp}
                                            onMoveDown={handleMoveDown}
                                            onDelete={handleDelete}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}