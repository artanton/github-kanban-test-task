import { RootState } from "../redux/store";

export const selectTasks =( state: RootState )=> state.boardSections;

export const selectIsLoading =( state: RootState ) => state.isLoading

export const selectError = ( state: RootState ) => state.error;

export const selectPepoRate = ( state: RootState ) => state.pepoRate; 

export const selectRepoName = ( state: RootState ) => state.repoName;