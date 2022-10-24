import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DragList } from "./components/DragList";

function App() {
  const [searchUrl, setSearchUrl] = useState<string>("");
  const updateSearch = (e: any) => {
    setSearchUrl(e.target.value);
  };

  let user = "";
  let repo = "";

  const [boards, setBoards] = useState<any>([]);

  const processSearchUrl = () => {
    const result = searchUrl.split("/");
    user = result[3];
    repo = result[4];
    fetch(`https://api.github.com/repos/${user}/${repo}/issues`)
      .then((res) => res.json())
      // .then((data) => console.log(data))
      .then((value) => filterIssues(value))
      .then((value) => setBoards(value));
  };

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

  const onDragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
    console.log("debug > onDragStartHandler===", item);
  };

  const onDragEndHandler = (e: any, board: any, item: any) => {
    e.target.style.boxShadow = "none";
    console.log("debug > onDragEndHandler ===", item);
  };

  const onDropHandler = (e: any, board: any, item: any) => {
    console.log("debug > onDropHandler===", item);

    e.preventDefault();
    e.stopPropagation();
    if (currentBoard && currentItem) {
      const currentIndex = currentBoard.items.indexOf(currentItem);

      currentBoard.items.splice(currentIndex, 1);

      const dropIndex = board.items.indexOf(item);

      const offset =
        board === currentBoard && currentIndex === dropIndex ? 1 : 0;

      board.items.splice(dropIndex + offset, 0, currentItem);
      setBoards(
        boards.map((b: any) => {
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
        boards.map((b: any) => {
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
    <div className="container">
      <input type="text" className="text" onChange={(e) => updateSearch(e)} />
      <button onClick={processSearchUrl}>Load issues</button>

      <DragList
        boards={boards}
        setBoards={setBoards}
        onDragStartHandler={onDragStartHandler}
        onDragEndHandler={onDragEndHandler}
        onDropHandler={onDropHandler}
        onDropBoardHandler={onDropBoardHandler}
      />
    </div>
  );
}

export default App;

interface TIssues {
  issues: [];
}

const filterIssues = (data: TIssues) => {
  console.log("data", data);
  const result: any = [
    { id: 1, title: "OPEN", items: data },
    { id: 2, title: "IN PROGRESS", items: [] },
    {
      id: 3,
      title: "DONE",
      items: [],
    },
  ];
  return result;
};
