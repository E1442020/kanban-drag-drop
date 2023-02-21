import React, { useState,useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {
  const [task,setTask]=useState('');
  const [taskItems,setTaskItems]=useState([])
  // const taskItem = [
  //   { id: "1", name: "Sleeping" },
  //   { id: "2", name: "Running" },
  //   { id: "3", name: "Eating" },
  //   { id: "4", name: "Playing" },

  // ];

  

   //get taskItems from localStorage

   const checkTaskItemsInfo = () => {
    let info = localStorage.getItem("taskItemsInfo");
    if (info === null) {
      return [];
    }
    return JSON.parse(info);
  };

  useEffect(() => {
   
    setTaskItems(checkTaskItemsInfo());
  }, []);

   //set taskItems to localStorage

   let setTaskItemsToLocalStorage = () => {
    localStorage.setItem("taskItemsInfo", JSON.stringify(taskItems));
  };

   //Add New taskItem

   const addNewTaskItem = () => {
    if (task.trim() == null ) return;
    let id;
    if (taskItems.length <= 0) {
      id = 1;
    } else {
      id = taskItems[taskItems.length - 1].id + 1;
    }
    const newTaskItem = {
      id: id,
      title: task,
      
    };

    taskItems.push(newTaskItem);
    console.log(taskItems)
    setTaskItemsToLocalStorage();
    
  };

  const taskStatus = {
    requested: {
      name: "Requested",
      items: taskItems
    },
    toDo: {
      name: "To do",
      items: []
    },
    inProgress: {
      name: "In Progress",
      items: []
    },
    done: {
      name: "Done",
      items: []
    }
  };
  console.log(taskStatus.requested.items)

  function onDragEnd(result, columns, setColumns) {
    console.log(result);
    if (!result.destination) return;
    const { source, destination } = result;


    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }

    
    // const items = Array.from(characters);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);
    // updateCharacters(items);
  }
  const [columns, setColumns] = useState(taskStatus);

  return (
    <>
          <input type='text' placeholder="Add Task" value={task} onChange={(e)=>setTask(e.target.value)} />
          <button onClick={addNewTaskItem}>Add</button>

    <div className='page-container'>
      <DragDropContext  onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
      {Object.entries(columns).map(([columnId, column], index) => {
            return (
              
              <div
              
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }} >
        <Droppable droppableId={columnId} key={columnId}>
          {(provided) => (
            <ul
              className="characters"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {column.items.map((item, index) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                      
                      {item.name}                      </li>
                    )}
                  </Draggable>
                );
              })}
                {provided.placeholder}
            </ul>
          )}
        </Droppable>
      
             
        </div>
              </div>
              
            );
          })}
      </DragDropContext>
      </div>
        
        
     
    </>
  );
}



