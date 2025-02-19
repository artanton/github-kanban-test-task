import { Container, Grid, GridItem } from '@chakra-ui/react';
import React, { useState } from 'react';
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
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import {taskFromBack} from '../../../fakeData'
import { Status } from '../../types/types';

import { findBoardSectionContainer, initializeBoard } from '../../utils/board';
import BoardSection from '../sectionItem/BoardSection';
import TaskItem from '../taskItem/TaskItem';
import { getTaskById } from '../../utils/tasks';
import { BoardSections as BoardSectionsType } from '../../types/types';
import { BOARD_SECTIONS } from '@/constants';

const INITIAL_TASKS = taskFromBack.map(issue=>(
    {
        id: issue.id,
        // number: issue.number,
        title: issue.title,
        status: issue.state as Status, 
        description: issue.body,
        // comments: issue.comments,
        // userType: issue.user.type,
        // createdAt: issue.created_at
    }
));


const BoardSectionList = () => {
  const tasks = INITIAL_TASKS;
  const initialBoardSections = initializeBoard(INITIAL_TASKS);
  const [boardSections, setBoardSections] =
    useState<BoardSectionsType>(initialBoardSections);

  const [activeTaskId, setActiveTaskId] = useState<null | number>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as number);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    // Find the containers
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as number
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as number
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
      active.id as number
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as number
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
        <Grid templateColumns="repeat(3, 1fr)" gap="4">
          {Object.keys(boardSections).map((boardSectionKey) => (
            <GridItem colSpan={2} key={boardSectionKey}>
              <BoardSection
                id={parseInt(boardSectionKey, 10)} 
                title={BOARD_SECTIONS[boardSectionKey as keyof typeof BOARD_SECTIONS]}
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
