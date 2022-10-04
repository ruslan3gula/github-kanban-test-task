import React, { useState } from 'react';
import './DragList.css';

export const DragList = () => {
  const [boards, setBoards] = useState([
    { id: 1, title: 'OPEN', items: [{ id: 1, title: 'Мішок' }] },
    { id: 2, title: 'IN PROGRESS', items: [{ id: 1, title: 'Свиня' }] },
    {
      id: 3,
      title: 'DONE',
      items: [
        { id: 1, title: 'Кінь' },
        { id: 2, title: 'Тісто' },
        { id: 3, title: 'Паляниця' },
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

  const onDragOverHandler = (e: any, board: any, item: any) => {
    console.log('debug > onDragOverHandler===', item);

    e.preventDefault();
    if (e.target.className == 'item') {
      e.target.style.boxShadow = '0 4px 3px grey';
      e.target.style.border = 'solid 2px red';
    }
  };

  const onDragLeaveHandler = (e: any) => {
    e.target.style.boxShadow = 'none';
    e.target.style.border = '2px solid lightpink';
  };

  const onDragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
    console.log('debug > onDragStartHandler===', item);
  };

  const onDragEndHandler = (e: any, board: any, item: any) => {
    e.target.style.boxShadow = 'none';
    console.log('debug > onDragEndHandler ===', item);
  };

  const onDropHandler = (e: any, board: any, item: any) => {
    console.log('debug > onDropHandler===', item);

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
    }
  };

  return (
    <div className="wrapp">
      {boards.map(board => (
        <div
          className="board"
          onDragOver={e => onDragOverHandler(e, null, null)}
          onDrop={e => onDropBoardHandler(e, board)}
        >
          <div className="board_title">{board.title}</div>
          {board.items.map(item => (
            <div
              className="item"
              draggable="true"
              onDragOver={e => onDragOverHandler(e, board, item)}
              onDragLeave={e => onDragLeaveHandler(e)}
              onDragStart={e => onDragStartHandler(e, board, item)}
              onDragEnd={e => onDragEndHandler(e, board, item)}
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
