import { useSelector } from "react-redux";
import { RequestForm } from "./components/reqForm/ReqForm";
import BoardSectionList from "./components/sectionList/BoardSectionList";
import { selectError, selectIsLoading, selectTasks } from "./redux/selectors";
import { BoardSections } from "./types/types";

import { Box } from "@chakra-ui/react";
// import { RepoSection } from "./components/repoSection/RepoSection";


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
      <div>
      
      <BoardSectionList />
      
      </div>||<Box
        display={"flex"}
        justifyContent={"center"} 
        alignItems={"center"}
        minHeight={"100vh"}
        fontSize={"2xl"}
      >
        Enter a GitHub repository URL (e.g., https://github.com/facebook/react-native) in the input field and press Load.
      </Box>
      }
    </>
  );
};
