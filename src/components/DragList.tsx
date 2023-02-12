import React, { useState, FC } from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import "./DragList.css";
import { IssueStore, IssueStoreInstance } from "./IssueStore";
import {
  Services,
  updateLocalStorage,
  getLocalStorage,
  checkRepoInLocalStorage,
} from "../components/services";

interface DragList {
  issueStore: IssueStoreInstance;
}

const services = Services;

export const DragList: FC<DragList> = observer(({ issueStore }) => {
  console.log("issueStore", toJS(issueStore.issues));
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

  const [searchUrl, setSearchUrl] = useState<string>("");
  const updateSearch = (e: any) => {
    setSearchUrl(e.target.value);
  };

  function handleLocalStorage(updatedValue: any) {
    if (getLocalStorage(IssueStore.issues.user)) {
      const prevData = JSON.parse(getLocalStorage(IssueStore.issues.user)!);
      // console.log("prevData", toJS(prevData));
      const result = prevData.map((item: any) => {
        // console.log("item.repo", item.repo);

        if (item.repo === issueStore.issues.repo) {
          return { ...item, data: updatedValue };
        }
        return item;
      });
      // console.log("result", result);

      updateLocalStorage(issueStore.issues.user, result);
    }
  }

  const onDragOverHandler = (e: any, board: any, item: any) => {
    // console.log("debug > onDragOverHandler===", item);

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

  const onDragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
    // console.log("debug > onDragStartHandler===", item);
  };

  const onDragEndHandler = (e: any, board: any, item: any) => {
    e.target.style.boxShadow = "none";
    // console.log("debug > onDragEndHandler ===", item);
  };

  const onDropHandler = (e: any, board: any, item: any) => {
    // console.log("debug > onDropHandler===", item);

    e.preventDefault();
    e.stopPropagation();
    if (currentBoard && currentItem) {
      const currentIndex = currentBoard.items.indexOf(currentItem);

      currentBoard.items.splice(currentIndex, 1);

      const dropIndex = board.items.indexOf(item);

      const offset =
        board === currentBoard && currentIndex === dropIndex ? 1 : 0;

      board.items.splice(dropIndex + offset, 0, currentItem);

      issueStore.issues.data.map((b: any) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return currentBoard;
        }
        return b;
      });
      handleLocalStorage(issueStore.issues.data);
    }
  };
  const onDropBoardHandler = (e: any, board: any) => {
    e.preventDefault();
    if (currentBoard && currentItem) {
      const currentIndex = currentBoard.items.indexOf(currentItem);

      currentBoard.items.splice(currentIndex, 1);

      board.items.push(currentItem);

      issueStore.issues.data.map((item: any) => {
        if (item.id === board.id) {
          return board;
        }
        if (item.id === currentBoard.id) {
          return currentBoard;
        }
        return item;
      });
      handleLocalStorage(issueStore.issues.data);

      // console.log("onDropBoardHandler", issueStore.issues.data);
    }
  };

  const loadIssues = () => {
    issueStore.getIssue(searchUrl);
  };

  console.log("issueStore.issues", toJS(issueStore.issues));

  return (
    <div className="wrapp">
      <input type="text" className="text" onChange={(e) => updateSearch(e)} />
      <button onClick={() => loadIssues()}>Load issues</button>
      <div className="container">
        {IssueStore.issues &&
          IssueStore.issues.data.map((board: any) => (
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
    </div>
  );
});
