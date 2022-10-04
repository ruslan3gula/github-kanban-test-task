import React, { useState } from 'react';
import './DragList.css';

export const DragList = () => {
  const [boards, setBoards] = useState([
    { id: 1, title: 'OPEN', items: [{ id: 1, title: 'Мішок' }] },
    { id: 2, title: 'IN PROGRESS', items: [{ id: 2, title: 'Свиня' }] },
    {
      id: 3,
      title: 'DONE',
      items: [
        { id: 3, title: 'Кінь' },
        { id: 4, title: 'Тісто' },
        { id: 5, title: 'Паляниця' },
      ],
    },
  ]);

  const [currentBoard, setCurrentBoard] = useState<{
    id: number;
    title: string;
    items: [
      {
        id: string;
        title: string;
      }
    ];
  } | null>(null);

  const [currentItem, setCurrentItem] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const onDragOverHandler = (e: any, board: any) => {
    e.preventDefault();
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px grey';
      e.target.style.border = 'solid 2px red';
    } else if (e.target.className === 'board' && board !== currentBoard) {
      e.target.style.border = '5px solid red';
    }
  };

  const onDragLeaveHandler = (e: any) => {
    if (e.target.className === 'item') {
      e.target.style.boxShadow = 'none';
      e.target.style.border = '2px solid lightpink';
    } else if (e.target.className === 'board') {
      e.target.style.border = '5px solid lightgray';
    }
  };

  const onDragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const onDragEndHandler = (e: any) => {
    e.target.style.boxShadow = 'none';
    e.target.style.border = '2px solid lightpink';
  };

  const onDropHandler = (e: any, board: any, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBoard && currentItem) {
      const currentIndex = currentBoard.items.indexOf(currentItem);

      currentBoard.items.splice(currentIndex, 1);

      const dropIndex = board.items.indexOf(item);

      const offset = board === currentBoard && currentIndex === dropIndex ? 1 : 0;

      board.items.splice(dropIndex + offset, 0, currentItem);
      setBoards(
        boards.map(b => {
          if (b.id === board.id) {
            return board;
          }
          if (b.id === currentBoard.id) {
            return currentBoard;
          }
          return b;
        })
      );
      e.target.style.boxShadow = 'none';
      e.target.style.border = '2px solid lightpink';
    }
  };

  const onDropBoardHandler = (e: any, board: any) => {
    e.preventDefault();
    if (currentBoard && currentItem) {
      const currentIndex = currentBoard.items.indexOf(currentItem);

      currentBoard.items.splice(currentIndex, 1);

      board.items.push(currentItem);
      setBoards(
        boards.map(b => {
          if (b.id === board.id) {
            return board;
          }
          if (b.id === currentBoard.id) {
            return currentBoard;
          }
          return b;
        })
      );
      e.target.style.border = '5px solid lightgray';
    }
  };

  return (
    <div className="wrapp">
      {boards.map(board => (
        <div
          key={board.id}
          className="board"
          onDragOver={e => onDragOverHandler(e, board)}
          onDrop={e => onDropBoardHandler(e, board)}
          onDragLeave={e => onDragLeaveHandler(e)}
        >
          <div className="board_title">{board.title}</div>
          {board.items.map(item => (
            <div
              key={item.id}
              className="item"
              draggable="true"
              onDragOver={e => onDragOverHandler(e, null)}
              onDragLeave={e => onDragLeaveHandler(e)}
              onDragStart={e => onDragStartHandler(e, board, item)}
              onDragEnd={e => onDragEndHandler(e)}
              onDrop={e => onDropHandler(e, board, item)}
            >
              {item.id} {item.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
