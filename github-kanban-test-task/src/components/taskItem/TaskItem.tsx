// import { Card, CardContent } from '@mui/material';
import { Card} from '@chakra-ui/react';
import { Task } from '../../types/types';

type TaskItemProps = {
  task: Task;
};

const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <Card.Root>
      <Card.Body>{task.title}</Card.Body>
    </Card.Root>
  );
};

export default TaskItem;
