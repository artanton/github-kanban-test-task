import { Container, Grid, GridItem } from "@chakra-ui/react";
import {useEffect, useState } from "react";
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";

import { findBoardSectionContainer } from "../../utils/board";
import BoardSection from "../sectionItem/BoardSection";
import TaskItem from "../taskItem/TaskItem";
import { getTaskById, taskToArray } from "../../utils/tasks";
import { BoardSections as BoardSectionsType } from "../../types/types";
import { BOARD_SECTIONS } from "@/constants";
import { selectTasks } from "@/redux/selectors.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateByUser } from "@/redux/taskSlice";

// const INITIAL_TASKS = taskFromBack.map((issue) => ({
//   id: issue.id.toString(),
//   repository_url:issue.repository_url,
//   number: issue.number,
//   title: issue.title,
//   status: issue.state as Status, 
//   comments: issue.comments,
//   userType: issue.user.type,
//   createdAt: issue.created_at
// }));

const BoardSectionList = () => {
  const allTasks = useSelector(selectTasks);
  const dispatch = useDispatch<AppDispatch>();

  const tasks = taskToArray(allTasks);
  
  // const initialBoardSections = initializeBoard([]);
  const [boardSections, setBoardSections] =
    useState<BoardSectionsType>(allTasks);    

  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);
  useEffect(()=>{setBoardSections(allTasks)},[allTasks])

useEffect(()=>{
  dispatch(updateByUser(boardSections));
},[boardSections])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setBoardSections((boardSection) => {
      const activeItems = boardSection[activeContainer];
      const overItems = boardSection[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...boardSection,
        [activeContainer]: [
          ...boardSection[activeContainer].filter(
            (item) => item.id !== active.id
          ),
        ],
        [overContainer]: [
          ...boardSection[overContainer].slice(0, overIndex),
          boardSections[activeContainer][activeIndex],
          ...boardSection[overContainer].slice(
            overIndex,
            boardSection[overContainer].length
          ),
        ],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (task) => task.id === active.id
    );
    const overIndex = boardSections[overContainer].findIndex(
      (task) => task.id === over?.id
    );

    if (activeIndex !== overIndex) {
      setBoardSections((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(
          boardSection[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveTaskId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

  return (
    <Container>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Grid
          style={{ padding: "40px" }}
          templateColumns="repeat(3, 1fr)"
          gap="14"
        >
          {Object.keys(boardSections).map((boardSectionKey) => (
            <GridItem
              
              colSpan={1}
              key={boardSectionKey}
            >
              <BoardSection
              
                id={boardSectionKey}
                title={
                  BOARD_SECTIONS[boardSectionKey as keyof typeof BOARD_SECTIONS]
                }
                tasks={boardSections[boardSectionKey]}
                
              />
            </GridItem>
          ))}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <TaskItem task={task} /> : null}
          </DragOverlay>
        </Grid>
      </DndContext>
    </Container>
  );
};

export default BoardSectionList;
