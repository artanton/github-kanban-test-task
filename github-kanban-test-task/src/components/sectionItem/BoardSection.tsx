import React from "react";
// import Box from "@mui/material/Box";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
// import Typography from "@mui/material/Typography";
import { Task } from "../../types/types";
import TaskItem from "../taskItem/TaskItem";
import SortableTaskItem from "../taskList/TaskList";
import { Box } from "@chakra-ui/react";

type BoardSectionProps = {
  id: number;
  title: string;
  tasks: Task[];
};

const BoardSection = ({ id, title, tasks }: BoardSectionProps) => {
  const { setNodeRef } = useDroppable({
    id: id.toString(),
  });

  return (
    <Box >
      {/* <Typography variant="h6" sx={{ mb: 2 }}> */}
        {title}
      {/* </Typography> */}
      <SortableContext
        id={id.toString()}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef}>
          {tasks.map((task) => (
            <Box key={task.id} >
              <SortableTaskItem id={task.id}>
                <TaskItem task={task} />
              </SortableTaskItem>
            </Box>
          ))}
        </div>
      </SortableContext>
    </Box>
  );
};

export default BoardSection;
