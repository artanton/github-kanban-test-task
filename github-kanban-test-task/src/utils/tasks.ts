import { Task, Status, BoardSections } from "../types/types";

export const getTasksByStatus = (tasks: Task[], status: Status) => {
  return tasks.filter((task) => task.status === status);
};

export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id);
};

export const taskAge = (task: Task) => {
  const createdDate = new Date(task.createdAt);
  const currentDate = new Date();
  const diffInMs = currentDate.getTime() - createdDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
};

export const taskToArray = (allTasks: BoardSections) => {
  let array: Task[] = [];
  for (const key in allTasks) {
    array = [...array, ...allTasks[key]];
  }
  return array;
};
