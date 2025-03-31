import { BoardSections, BoardState, Status, Task } from "../types/types";
import { BOARD_SECTIONS } from "../constants/index";
import { getTasksByStatus } from "./tasks";

export const initializeBoard = (tasks: Task[]) => {
  const boardSections: BoardSections = {};

  Object.keys(BOARD_SECTIONS).forEach((boardSectionKey) => {
    boardSections[boardSectionKey] = getTasksByStatus(
      tasks,
      boardSectionKey as Status
    );
  });

  return boardSections;
};

export const findBoardSectionContainer = (
  boardSections: BoardSections,
  id: string
) => {
  if (id in boardSections) {
    return id;  }
  const container = Object.keys(boardSections).find((key) =>
    boardSections[key].find((item) => item.id === id)
  );
  return container;
};

export const getStoredBoardState = (
  repoName: string
): BoardState["boardSections"] | null => {
  const storedData = localStorage.getItem(`boardState-${repoName}`);
  return storedData ? JSON.parse(storedData) : null;
};

export const saveBoardState = (
  repoName: string,
  boardSections: BoardState["boardSections"]
) => {
  localStorage.setItem(`boardState-${repoName}`, JSON.stringify(boardSections));
};
