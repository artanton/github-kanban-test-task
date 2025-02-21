import { useSelector } from "react-redux";
import { RequestForm } from "./components/reqForm/ReqForm";
import BoardSectionList from "./components/sectionList/BoardSectionList";
import { selectError, selectIsLoading, selectTasks } from "./redux/selectors";
import { BoardSections } from "./types/types";

import { Box } from "@chakra-ui/react";
import { RepoSection } from "./components/repoSection/RepoSection";
import './App.css';

export const App = () => {
  const allTasks = useSelector(selectTasks);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectError);

  const isTasks = (allTasks: BoardSections) => {
    for (const key in allTasks) {
      if (allTasks[key].length > 0) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <RequestForm />
      {isLoading && (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          minHeight={"100vh"}
          fontSize={"4xl"}
        >
          Loading...
        </Box>
      )}
      {!isError && isTasks(allTasks) && 
      <div className="app-container">
      <RepoSection/>
      <BoardSectionList />
      
      </div>}
    </>
  );
};
