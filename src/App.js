import React, { useState,useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
export default function App() {
  const [task,setTask]=useState('');
  const [taskItems,setTaskItems]=useState([])
  const [taskStatus,setTaskStatus]=useState({requested: {
    name: "Requested",
    items: []
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
  }})
  const [columns, setColumns] = useState(taskStatus);


  const getTaskStatusFromLocalStorage = () => {
    let info = localStorage.getItem("droppable");
    if (info === null) {
     
      return taskStatus;
    }else
     

    return JSON.parse(info);
  };

  
   //Add New taskItem

   const addNewTaskItem = () => {
    if (task.trim() == null ) return;
    let id=uuidv4()
    
    const newTaskItem = {
      id:id,
      title: task,
      
    };
    const tempTaskItems=[...taskItems]
    tempTaskItems.push(newTaskItem);
    // console.log(taskItems)
    
    // setTaskItemsToLocalStorage();

    const tempStatus={...taskStatus}
    tempStatus.requested.items=[...tempTaskItems];
    setTaskItems(tempTaskItems)
    setTaskStatus(tempStatus);
    setColumns(tempStatus)
    localStorage.setItem('droppable',JSON.stringify(tempStatus))
    console.log(tempStatus)

    setTask('');
    
  };
  // localStorage.clear()
  useEffect(() => {
    
    let tempStatus=getTaskStatusFromLocalStorage();
    setTaskItems(tempStatus.requested.items)
    setTaskStatus(tempStatus);
    setColumns(tempStatus)
    console.log(tempStatus)
    
  }, []);
 


  function onDragEnd(result, columns, setColumns) {
    // console.log(result);
    if (!result.destination) return;
    const { source, destination } = result;


    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const updateColumnsObjectAfterDrag=
      {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      }
      localStorage.setItem('droppable',JSON.stringify(updateColumnsObjectAfterDrag))
      console.log(updateColumnsObjectAfterDrag)
      setColumns(updateColumnsObjectAfterDrag);
     
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const updateColumnsObjectAfterDrag={
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      }
      localStorage.setItem('droppable',JSON.stringify(updateColumnsObjectAfterDrag))
      console.log(updateColumnsObjectAfterDrag)
      setColumns(updateColumnsObjectAfterDrag);
      
    }
  }

 
  return (
    <>
    <div className='page-container'>
      <div className='input-container'>
          <input type='text' placeholder="Add Task" value={task} onChange={(e)=>setTask(e.target.value)} />
          <button onClick={addNewTaskItem}>+ADD</button>
          </div>
    <div className='tasks-container'>
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
        <Droppable droppableId={columnId} key={columnId} > 
          {(provided) => (
            <ul
              className="characters"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {column.items.map((item, index) => {
                return (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                      
                      {item.title}                      </li>
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
        
        
     </div>
    </>
  );
}



