import React from "react";
import { Grid, List, ListItem, ListItemText } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const listData = [
  {
    id: 'item01',
    orderId: 'order1',
    text: 'Text for Item 01',
  },
  {
    id: 'item02',
    orderId: 'order2',
    text: 'Text for Item 02',
  },
  {
    id: 'item03',
    orderId: 'order3',
    text: 'Text for Item 03',
  },
  {
    id: 'item04',
    orderId: 'order4',
    text: 'Text for Item 04',
  },
  {
    id: 'item04',
    orderId: 'order5',
    text: 'Text for Item 04 - Duplicate',
  },
];

const listNewData = [
  {
    id: 'item11',
    orderId: 'order1',
    text: 'Text for Item 11',
  },
  {
    id: 'item12',
    orderId: 'order2',
    text: 'Text for Item 12',
  },
  {
    id: 'item13',
    orderId: 'order3',
    text: 'Text for Item 13',
  },
  {
    id: 'item14',
    orderId: 'order4',
    text: 'Text for Item 14',
  },
];

const onDragStart = (info) => {
  console.log('DnD Started:', info);
};

const onDragEnd = (result) => {
  console.log('DnD Result:', result);
  const { source, destination, draggableId} = result;
  if (!destination) {
    return;
  }
  if (source.droppableId == destination.droppableId && source.index == destination.index) {
    return;
  }
};

const DragItem = (props) => {
  const { item, index } = props;
  return (
    <Draggable
      draggableId={item.orderId}
      index={index}
    >
      {(provided, snapshot) => (
        <ListItem 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ 
            background: snapshot.isDragging ? 'pink' : 'white', 
            border: 1,
            borderRadius: '4px',
            m: 1,
            width: 300,
          }}
        >
          {item.text}
        </ListItem>
      )}
    </Draggable>
  );
};

export default function LadsBySegments() {
  return (
    <DragDropContext 
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Grid container >
        <Grid item xs={6}>
          <Droppable droppableId="main-list">
            {(provided, snapshot) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  width: 400,
                  transition: 'background-color 0.2s ease',
                  background: snapshot.isDraggingOver
                    ? 'gold'
                    : 'inherit'
                }}
              >
                {listData.map((item, index) => (
                  <DragItem 
                    key={index} 
                    item={item}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Grid>
        <Grid item xs={6}>
          <Droppable droppableId="add-list" isDropDisabled>
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  width: 400,
                }}
              >
                {listNewData.map((item, index) => (
                  <Draggable
                    key={item.id} 
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided) =>(
                      <ListItem 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ 
                          background: 'white', 
                          border: 1,
                          borderRadius: '4px',
                          m: 1,
                          width: 300,
                        }}
                      >
                        {item.text}
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};