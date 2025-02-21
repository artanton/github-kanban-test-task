import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Task } from "../../types/types";
import TaskItem from "../taskItem/TaskItem";
import SortableTaskItem from "../taskList/TaskList";
import { Box } from "@chakra-ui/react";

type BoardSectionProps = {
  id: string;
  title: string;
  tasks: Task[];
};

const BoardSection = ({ id, title, tasks }: BoardSectionProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box>
      <Box fontSize="2xl" fontWeight="bold" mb={2} textAlign={"center"}>
        {title}
      </Box>
      <Box p="8" border="1px solid black" backgroundColor="#bdbcbc">
        <SortableContext
          id={id}
          items={tasks}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef}>
            {tasks.map((task) => (
              <Box
                key={task.id}
                mb={4}
                border="1px solid black"
                borderRadius="md"
              >
                <SortableTaskItem id={task.id}>
                  <TaskItem task={task} />
                </SortableTaskItem>
              </Box>
            ))}
          </div>
        </SortableContext>
      </Box>
    </Box>
  );
};

export default BoardSection;
