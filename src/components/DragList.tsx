import React, { useState } from "react";
import "./DragList.css";

export const DragList = () => {
  const [boards, setBoards] = useState([
    { id: 1, title: "OPEN", items: [{ id: 1, title: "Прибрати" }] },
    { id: 2, title: "IN PROGRESS", items: [{ id: 1, title: "Прибрати" }] },
    {
      id: 3,
      title: "DONE",
      items: [
        { id: 1, title: "Прибрати" },
        { id: 2, title: "Прибрати" },
      ],
    },
  ]);

  const [currentBoard, setCurrentBoard] = useState<{
    id: number;
    title: string;
    items: [];
  } | null>(null);
  const [currentItem, setCurrentItem] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const onDragOverHandler = (e: any) => {
    e.preventDefault();
    if (e.target.className == "item") {
      e.target.style.boxShadow = "0 4px 3px grey";
    }
  };
  const onDragLeaveHandler = (e: any) => {
    e.target.style.boxShadow = "none";
  };
  const onDragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const onDragEndHandler = (e: any, board: any, item: any) => {
    e.target.style.boxShadow = "none";
  };
  const onDropHandler = (e: any) => {
    e.preventDefault();
    const currentIndex = currentBoard?.items.indexOf(currentItem);
    currentBoard?.items.splice(currentIndex, 1);
    const dropIndex = board.items.indexOf(item);
    boards.items.splice(dropIndex + 1, 0, currentItem);
    setBoards(boards.map(a=>{
        if(b.id===boards.id){
return board
        }
        if (b.id===currentBoard?.id){}
  };
  return (
    <div className="wrapp">
      {boards.map((board) => (
        <div className="board">
          <div className="board_title">{board.title}</div>
          {board.items.map((item) => (
            <div
              className="item"
              draggable="true"
              onDragOver={(e) => onDragOverHandler(e)}
              onDragLeave={(e) => onDragLeaveHandler(e)}
              onDragStart={(e) => onDragStartHandler(e, board, item)}
              onDragEnd={(e) => onDragEndHandler(e, board, item)}
              onDrop={(e) => onDropHandler(e)}
            >
              {item.id} {item.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
