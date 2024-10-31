import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // Import motion and AnimatePresence
import axios from 'axios';
import SubTaskBlock from './SubTaskBlock'; // Import the Subtask component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faArrowUp, faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the specific icons you need


export default function TaskBlock({ step, index, resultLength, onMoveUp, onMoveDown, onDelete }) {
    const [subtasks, setSubtasks] = useState([]); // Store subtasks
    const [loadingSubtasks, setLoadingSubtasks] = useState(false); // Loading state for subtask generation

    // Fetch subtasks from the backend
    const handleGenerateSubtasks = async () => {
        setLoadingSubtasks(true); // Set loading state to true

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subtasks`, {
                step: {
                    title: step.title,
                    description: step.description,
                },
            });
            const responseData = response.data.result;
            const firstKey = Object.keys(responseData)[0] || null;
            console.log('Generated firstKey:', firstKey);
            if (firstKey && responseData[firstKey].constructor === ([]).constructor) {
                const generatedSubtasks = responseData[firstKey];
                console.log('Generated Subtasks:', generatedSubtasks);
                setSubtasks(generatedSubtasks);
            } else {
            setSubtasks([]);
            }
        } catch (error) {
            console.error('Error generating subtasks:', error);
            setSubtasks([]);
        } finally {
            setLoadingSubtasks(false); // Set loading state to false after fetching subtasks
        }
    };

    // Move subtask up
    const handleMoveSubtaskUp = (subtaskIndex) => {
        if (subtaskIndex > 0) {
            const newSubtasks = [...subtasks];
            const temp = newSubtasks[subtaskIndex - 1];
            newSubtasks[subtaskIndex - 1] = newSubtasks[subtaskIndex];
            newSubtasks[subtaskIndex] = temp;
            setSubtasks(newSubtasks);
        }
    };

    // Move subtask down
    const handleMoveSubtaskDown = (subtaskIndex) => {
        if (subtaskIndex < subtasks.length - 1) {
            const newSubtasks = [...subtasks];
            const temp = newSubtasks[subtaskIndex + 1];
            newSubtasks[subtaskIndex + 1] = newSubtasks[subtaskIndex];
            newSubtasks[subtaskIndex] = temp;
            setSubtasks(newSubtasks);
        }
    };

    // Delete a subtask
    const handleDeleteSubtask = (subtaskIndex) => {
        const newSubtasks = subtasks.filter((_, idx) => idx !== subtaskIndex);
        setSubtasks(newSubtasks);
    };

    return (
        <div
            className="bg-white p-4 rounded shadow-lg border border-gray-200"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-gray-700 mr-10">{step.description}</p>
                </div>

                {/* Arrows for move up and move down */}
                <div className="flex space-x-2">
                    {/* Conditionally render "Move Up" button if not the first item */}
                    {index > 0 && (
                        <button
                            onClick={() => onMoveUp(index)}
                            className="bg-gray-200 p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white"
                            aria-label="Move Up"
                        >
                            <FontAwesomeIcon icon={faArrowUp} />
                        </button>
                    )}

                    {/* Conditionally render "Move Down" button if not the last item */}
                    {index < resultLength - 1 && (
                        <button
                            onClick={() => onMoveDown(index)}
                            className="bg-gray-200 p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white"
                            aria-label="Move Down"
                        >
                            <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                    )}

                    {/* Delete button */}
                    <button
                        onClick={() => onDelete(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-full"
                        aria-label="Delete"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>

            <div className="flex space-x-2 mt-4">
                {/* Button to trigger subtask generation */}
                <button
                    onClick={handleGenerateSubtasks}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={loadingSubtasks}
                >
                    {loadingSubtasks ? 'Generating...' : 'Generate Subtasks'}
                </button>
            </div>

            {/* Render Subtasks */}
            {subtasks.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-300">
                {/* <h4 className="text-md font-semibold">Subtasks</h4> */}
                <AnimatePresence>
                    <div className="space-y-4">
                        {subtasks.map((subtask, idx) => (
                            <motion.div
                                key={subtask.title} // Ensure the key is provided for motion div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 20,
                                    damping: 10,
                                    duration: 0.1,
                                    ease: "easeInOut"
                                }}
                                layout
                            >
                                <SubTaskBlock
                                    subtask={subtask}
                                    index={idx}
                                    subtaskLength={subtasks.length}
                                    onMoveUp={handleMoveSubtaskUp}
                                    onMoveDown={handleMoveSubtaskDown}
                                    onDelete={handleDeleteSubtask}
                                />
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>  
            </div>
        )}
        </div>
    );
}