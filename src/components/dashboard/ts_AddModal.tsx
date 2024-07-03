import React, { useState } from "react";
import { getRandomColors } from "./ts_getRandomColors.ts";
import { v4 as uuidv4 } from "uuid";

interface Tag {
    title: string;
    bg: string;
    text: string;
}

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    handleAddTask: (taskData: any) => void;
}


const AddModal = ({ isOpen, onClose,  handleAddTask }: AddModalProps) => {
    const initialTaskData = {
        id: uuidv4(),
        title: "",
        description: "",
        priority: "",
        deadline: 0,
        image: "",
        alt: "",
        tags: [] as Tag[],
    };

    const [taskData, setTaskData] = useState(initialTaskData);
    const [tagTitle, setTagTitle] = useState("");
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
    
            reader.onload = function (e) {
                if (e.target) {
                    const imageData = e.target.result as string;
                    setTaskData({ ...taskData, image: imageData });
                }
            };
    
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    

    const handleAddTag = () => {
        if (tagTitle.trim() !== "") {
            const { bg, text } = getRandomColors();
            const newTag: Tag = { title: tagTitle.trim(), bg, text };
            setTaskData({ ...taskData, tags: [...taskData.tags, newTag] });
            setTagTitle("");
        }
    };

    const closeModal = () => {
        onClose();
        setTaskData(initialTaskData);
    };

    const handleSubmit = () => {
        if (validateTaskData()) {
            handleAddTask(taskData);
            closeModal();
        } else {
            setError("Fill all fields & Deadline must be a positive number between 1 and 99 minutes.");
        }
    };

    const validateTaskData = () => {
        if (taskData.title.trim() === "" ||
            taskData.description.trim() === "" ||
            taskData.priority.trim() === "" ||
            taskData.tags.length === 0) {
            return false;
        }

        if (taskData.deadline <= 0 || taskData.deadline > 99) {
            setError("Deadline must be a positive number between 1 and 99 minutes.");
            return false;
        }

        return true;
    };

    return (
        <div
            className={`w-screen h-screen place-items-center fixed top-0 left-0 ${
                isOpen ? "grid" : "hidden"
            }`}
        >
            <div
                className="w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20"
                onClick={closeModal}
            ></div>
            <div className="md:w-[30vw] w-[90%] bg-white rounded-lg shadow-md z-50 flex flex-col items-center gap-3 px-5 py-6">
                <input
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full h-12 px-3 outline-none rounded-md bg-black border border-slate-300 text-sm font-medium"
                />
                <input
                    type="text"
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full h-12 px-3 outline-none rounded-md bg-black border border-slate-300 text-sm font-medium"
                />
                <select
                    name="priority"
                    onChange={handleChange}
                    value={taskData.priority}
                    className="w-full h-12 px-2 outline-none rounded-md bg-black border border-slate-300 text-sm"
                >
                    <option value="">Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input
                    type="number"
                    name="deadline"
                    value={taskData.deadline}
                    onChange={handleChange}
                    placeholder="Deadline"
                    className="w-full h-12 px-3 outline-none rounded-md bg-black border border-slate-300 text-sm"
                />
                <input
                    type="text"
                    value={tagTitle}
                    onChange={(e) => setTagTitle(e.target.value)}
                    placeholder="Tag Title"
                    className="w-full h-12 px-3 outline-none rounded-md bg-black border border-slate-300 text-sm"
                />
                <button
                    className="w-full rounded-md h-9 bg-blue-500 text-amber-50 font-medium"
                    onClick={handleAddTag}
                >
                    Add Tag
                </button>
                <div className="w-full">
                    {taskData.tags && <span>Tags:</span>}
                    {taskData.tags.map((tag, index) => (
                        <div
                            key={index}
                            className="inline-block mx-1 px-[10px] py-[2px] text-[13px] font-medium rounded-md"
                            style={{ backgroundColor: tag.bg, color: tag.text }}
                        >
                            {tag.title}
                        </div>
                    ))}
                </div>
                <div className="w-full flex items-center gap-4 justify-between">
                    <input
                        type="text"
                        name="alt"
                        value={taskData.alt}
                        onChange={handleChange}
                        placeholder="Image Alt"
                        className="w-full h-12 px-3 outline-none rounded-md bg-black border border-slate-300 text-sm"
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="w-full"
                    />
                    {taskData.image && <img src={taskData.image} alt={taskData.alt} style={{ maxWidth: "100%", maxHeight: "100px" }} />}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    className="w-full mt-3 rounded-md h-9 bg-blue-500 text-blue-50 font-medium"
                    onClick={handleSubmit}
                >
                    Submit Task
                </button>
            </div>
        </div>
    );
};

export default AddModal;
