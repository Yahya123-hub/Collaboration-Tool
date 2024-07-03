import { v4 as uuidv4 } from "uuid";
import { Columns } from "./ts_columns";
import { getRandomColors } from "./ts_getRandomColors.ts";



export const Board: Columns = {
	backlog: {
		name: "Backlog",
		items: [
			{
				id: uuidv4(),
				title: "Backlog Placeholder Task",
				description: "Description",
				priority: "medium",
				deadline: 50,
				alt: "task image",
				tags: [
					{ title: "Tag1", ...getRandomColors() },
					{ title: "Tag2", ...getRandomColors() },
				],
			},
		],
	},
	pending: {
		name: "Pending",
		items: [
			{
				id: uuidv4(),
				title: "Pending Placeholder Task",
				description: "Description",
				priority: "high",
				deadline: 50,
				tags: [
					{ title: "Tag1", ...getRandomColors() },
					{ title: "Tag2", ...getRandomColors() },
				],
			},
		],
	},
	todo: {
		name: "To Do",
		items: [
			{
				id: uuidv4(),
				title: "Todo Placeholder Task",
				description: "Description",
				priority: "medium",
				deadline: 50,
				tags: [
					{ title: "Tag1", ...getRandomColors() },
					{ title: "Tag2", ...getRandomColors() },
				],
			},
		],
	},
	doing: {
		name: "Doing",
		items: [
			{
				id: uuidv4(),
				title: "Doing Placeholder Task",
				description: "Description",
				priority: "low",
				deadline: 50,
				tags: [
					{ title: "Tag1", ...getRandomColors() },
					{ title: "Tag2", ...getRandomColors() },
				],
			},
		],
	},
	done: {
		name: "Done",
		items: [
			{
				id: uuidv4(),
				title: "Done Placeholder Task",
				description: "Description",
				priority: "high",
				deadline: 50,
				alt: "task image",
				tags: [
					{ title: "Tag1", ...getRandomColors() },
					{ title: "Tag2", ...getRandomColors() },
				],
			},
		],
	},
};