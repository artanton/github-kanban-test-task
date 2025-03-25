import { BoardState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "./operators";
import {
  getStoredBoardState,
  initializeBoard,
  saveBoardState,
} from "./../utils/board";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { taskToArray, updateTaskStatus } from "./../utils/tasks";

const initialState: BoardState = {
  boardSections: {
    open: [],
    in_progress: [],
    done: [],
  },
  repoName: "",
  repoRate: 0,
  isLoading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateByUser(state: BoardState, action) {
      if (!taskToArray(action.payload).length) {
        return;
      }
      const boardOrder = action.payload;
      const updatedTasks = updateTaskStatus(boardOrder);
      state.boardSections = updatedTasks;
      const repoName = localStorage.getItem("currentRepo");
      if (repoName) {
        saveBoardState(repoName, updatedTasks);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state: BoardState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state: BoardState, action) => {
        state.isLoading = false;
        state.error = null;
        state.repoName = action.payload.repoName;
        state.repoRate = action.payload.repoRate;

        const loadingRepoName = action.payload.repoName;
        const taskPayload = action.payload.tasks;

        localStorage.setItem(
          "RepoRate",
          JSON.stringify(action.payload.repoRate)
        );

        localStorage.setItem("currentRepo", loadingRepoName);
        const storedBoard = getStoredBoardState(loadingRepoName);

        if (storedBoard) {
          const storedTasks = taskToArray(storedBoard);

          const newTasks = taskPayload.filter(
            (task) =>
              !storedTasks.find((storedTask) => storedTask.id === task.id)
          );

          const presentTasks = storedTasks.filter((storedTask) =>
            taskPayload.some((task) => task.id === storedTask.id)
          );

          const toSave = initializeBoard([...presentTasks, ...newTasks]);

          state.boardSections = toSave;

          saveBoardState(loadingRepoName, toSave);
        } else {
          const newData = initializeBoard(taskPayload);

          state.boardSections = newData;

          saveBoardState(loadingRepoName, state.boardSections);
        }
      })
      .addCase(
        fetchTasks.rejected,
        (state: BoardState, action: PayloadAction<unknown>) => {
          state.isLoading = false;
          state.error = action.payload as string;
          Notify.failure((action.payload as string) || "Registration failed");
        }
      );
  },
});

export const boardReducer = boardSlice.reducer;
export const { updateByUser } = boardSlice.actions;
