import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome component
import { faArrowUp, faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the specific icons you need

export default function Subtask({ subtask, index, subtaskLength, onMoveUp, onMoveDown, onDelete }) {
    return (
        <div className="bg-gray-50 p-3 rounded shadow">
            <h5 className="font-bold">{subtask.title}</h5>
            <p>{subtask.description}</p>

            <div className="flex justify-end items-center space-x-2 mt-2">
                {/* Conditionally render "Move Up" button if not the first subtask */}
                {index > 0 && (
                    <button
                        onClick={() => onMoveUp(index)}
                        className="bg-gray-200 p-2 rounded-full text-blue-400 hover:bg-blue-400 hover:text-white"
                        aria-label="Move Up"
                    >
                        <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                )}

                {/* Conditionally render "Move Down" button if not the last subtask */}
                {index < subtaskLength - 1 && (
                    <button
                        onClick={() => onMoveDown(index)}
                        className="bg-gray-200 p-2 rounded-full text-blue-400 hover:bg-blue-400 hover:text-white"
                        aria-label="Move Down"
                    >
                        <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                )}

                {/* Delete button */}
                <button
                    onClick={() => onDelete(index)}
                    className="bg-red-400 px-3 py-2 rounded-full text-white"
                    aria-label="Delete"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </div>
    );
}