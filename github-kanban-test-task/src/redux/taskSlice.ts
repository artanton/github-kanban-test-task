import { Task } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks } from "./operators";
import { initializeBoard } from "@/utils/board";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

interface BoardState {
  // repoName: string | null;
  boardSections: {
    [name: string]: Task[];
  };
  isLoading: boolean;
  error: null | string;
}

const initialState: BoardState = {
  // repoName: null,
  boardSections: {
    open: [],
    in_progress: [],
    done: [],
  },
  isLoading: false,
  error: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateByUser(state: BoardState, action) {
      state.boardSections = action.payload;
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
        const boardSectionsOrder = initializeBoard(action.payload);
       
        state.boardSections = boardSectionsOrder;
      })
      .addCase(
        fetchTasks.rejected,
        (state: BoardState, action: PayloadAction<unknown>) => {
          state.isLoading = false;
          state.error = action.payload as string;
          Notify.failure((action.payload as string) || 'Registration failed');
        }
      );
  },
});

export const boardReducer = boardSlice.reducer;
export const {updateByUser} = boardSlice.actions;