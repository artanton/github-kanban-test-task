import { Card } from "@chakra-ui/react";
import { Task } from "../../types/types";
import { taskAge } from "@/utils/tasks";

type TaskItemProps = {
  task: Task;
};

const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <Card.Root>
      <Card.Body gap="4">
        <Card.Title mt="2">{task.title}</Card.Title>
        <Card.Description>
          {taskAge(task)
            ? `#${task.number} opened ${taskAge(task)} days ago`
            : `#${task.number} opened today`}
          <br />
          {task.userType && `${task.userType} | Comments: ${task.comments}`}
        </Card.Description>
      </Card.Body>
    </Card.Root>
  );
};

export default TaskItem;
