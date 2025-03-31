import { selectTasks } from "@/redux/selectors.ts";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateByUser } from "@/redux/taskSlice";
import { isEqual } from "lodash";
import { Container, Grid, GridItem } from "@chakra-ui/react";
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
import { BOARD_SECTIONS } from "@/constants";
import BoardSection from "../sectionItem/BoardSection";
import TaskItem from "../taskItem/TaskItem";
import { findBoardSectionContainer } from "../../utils/board";
import { getTaskById, taskToArray } from "../../utils/tasks";
import { BoardSections as BoardSectionsType } from "../../types/types";
import { RepoSection } from "../repoSection/RepoSection";

const BoardSectionList = () => {
  const allTasks = useSelector(selectTasks);
  const dispatch = useDispatch<AppDispatch>();
  const [boardSections, setBoardSections] = useState<BoardSectionsType | null>(
    null
  );
  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

  const tasks = taskToArray(allTasks);
  const prevTasksRef = useRef(allTasks);

  useEffect(() => {
    if (!isEqual(prevTasksRef.current, allTasks)) {
      setBoardSections(allTasks);
      prevTasksRef.current = allTasks;
    }
  }, [allTasks]);

  useEffect(() => {
    if (
      boardSections !== null &&
      !isEqual(prevTasksRef.current, boardSections)
    ) {
      dispatch(updateByUser(boardSections));
    } else {
      setBoardSections(allTasks);
    }
  }, [boardSections, dispatch]);

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
    if (!boardSections) return;

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
      if (!boardSection) return boardSection;

      const activeItems = boardSection[activeContainer];
      const overItems = boardSection[overContainer];

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
    if (!boardSections) return;

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
      setBoardSections((boardSection) => {
        if (!boardSection) return boardSection;

        return {
          ...boardSection,
          [overContainer]: arrayMove(
            boardSection[overContainer],
            activeIndex,
            overIndex
          ),
        };
      });
    }

    setActiveTaskId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const task = activeTaskId ? getTaskById(tasks, activeTaskId) : null;

  return (
    <Container>
      <RepoSection/>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Grid
          style={{ padding: "20px" }}
          templateColumns="repeat(3, minmax(100px, 1fr))"
          gap="8"
        >
          {boardSections &&
            Object.keys(boardSections).map((boardSectionKey) => (
              <GridItem colSpan={1} key={boardSectionKey}>
                <BoardSection
                  id={boardSectionKey}
                  title={
                    BOARD_SECTIONS[
                      boardSectionKey as keyof typeof BOARD_SECTIONS
                    ]
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
