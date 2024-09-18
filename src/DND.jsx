import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Initial tasks setup
const initialTasks = {
  todo: JSON.parse(localStorage.getItem("todoTasks")) || [],
  Running: [],
  Completed: [],
};

// TaskInput Component to add tasks to the todo list
const TaskInput = ({ addTask }) => {
  const [taskContent, setTaskContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskContent.trim()) {
      addTask(taskContent);
      setTaskContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        placeholder="Add a new task"
        style={{ padding: "8px", width: "200px", marginRight: "10px" }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Add Task
      </button>
    </form>
  );
};

// Main DND Component
export const DND = () => {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    localStorage.setItem("todoTasks", JSON.stringify(tasks.todo));
  }, [tasks.todo]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside any droppable area
    if (!destination) return;

    // Reorder within the same list
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(tasks[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: items,
      }));
    } else {
      // Moving task from one list to another
      const sourceItems = Array.from(tasks[source.droppableId]);
      const [movedItem] = sourceItems.splice(source.index, 1);

      const destinationItems = Array.from(tasks[destination.droppableId]);
      destinationItems.splice(destination.index, 0, movedItem);

      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems,
      }));
    }
  };

  const addTask = (content) => {
    const newTask = {
      id: `task-${Date.now()}`, // Create a unique id using current timestamp
      content,
    };

    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, newTask],
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <TaskInput addTask={addTask} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {Object.entries(tasks).map(([key, items]) => (
            <Droppable droppableId={key} key={key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver
                      ? "#e0e0e0"
                      : "#f4f5f7",
                    padding: 10,
                    width: 250,
                    minHeight: 400,
                    borderRadius: 5,
                    transition: "background-color 0.2s ease",
                    border: "1px solid #ccc",
                  }}
                >
                  <h3 style={{ textAlign: "center", margin: "0 0 10px" }}>
                    {key.replace(/^\w/, (c) => c.toUpperCase())}
                  </h3>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: 16,
                            margin: "0 0 8px 0",
                            minHeight: "50px",
                            backgroundColor: snapshot.isDragging
                              ? "#263b4a"
                              : "#456c86",
                            color: "white",
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
