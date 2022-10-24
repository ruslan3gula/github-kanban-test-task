import React, { useState } from "react";
import "./DragList.css";

export const DragList = ({
  boards,
  setBoards,
  onDragStartHandler,
  onDragEndHandler,
  onDropBoardHandler,
  onDropHandler,
}: any) => {
  const onDragOverHandler = (e: any, board: any, item: any) => {
    console.log("debug > onDragOverHandler===", item);

    e.preventDefault();
    if (e.target.className == "item") {
      e.target.style.boxShadow = "0 4px 3px grey";
      e.target.style.border = "solid 2px red";
    }
  };

  const onDragLeaveHandler = (e: any) => {
    e.target.style.boxShadow = "none";
    e.target.style.border = "2px solid lightpink";
  };

  return (
    <div className="wrapp">
      {boards.map((board: any) => (
        <div
          className="board"
          onDragOver={(e) => onDragOverHandler(e, null, null)}
          onDrop={(e) => onDropBoardHandler(e, board)}
        >
          <div className="board_title">{board.title}</div>
          {board.items.map((item: any) => (
            <div
              className="item"
              draggable="true"
              onDragOver={(e) => onDragOverHandler(e, board, item)}
              onDragLeave={(e) => onDragLeaveHandler(e)}
              onDragStart={(e) => onDragStartHandler(e, board, item)}
              onDragEnd={(e) => onDragEndHandler(e, board, item)}
              onDrop={(e) => onDropHandler(e, board, item)}
            >
              {item.id} {item.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
