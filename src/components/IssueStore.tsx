import {
  observable,
  makeAutoObservable,
  action,
  runInAction,
  toJS,
} from "mobx";

import {
  Services,
  getLocalStorage,
  updateLocalStorage,
  sortByLocalStorage,
  filterIssues,
} from "./services";

type TIssues = {
  user: string;
  repo: string;
  data: any[];
};

export class IssueStoreInstance {
  issues: TIssues = { user: "", repo: "", data: [] };

  service;
  constructor() {
    makeAutoObservable(this);
    this.service = new Services();
  }

  getIssue = async (value: string) => {
    this.issues = { user: "", repo: "", data: [] };

    try {
      const [uri, user, repo] = this.service.processSearchUrl(value);
      const processedUrl: string = uri;
      const data = await this.service.get(processedUrl);
      // console.log(data);
      // const filteredData = data.pop();
      // const sortedData = [{ data: filteredData, user, repo }];
      // console.log("sortedData", sortedData);

      runInAction(() => {
        this.issues = filterIssues(data, user, repo);
        // console.log(toJS(this.issues));
      });
    } catch (e) {}
  };

  // filterIssues = (data: TIssues, user: string, repo: string) => {
  //   const result: any = [
  //     { id: 1, title: "OPEN", items: data },
  //     { id: 2, title: "IN PROGRESS", items: [] },
  //     {
  //       id: 3,
  //       title: "DONE",
  //       items: [],
  //     },
  //   ];

  //   return { user, repo, data: result };

  //   // console.log(getLocalStorage(user), getLocalStorage(repo));
  //   // if (getLocalStorage(user) && getLocalStorage(repo)) {
  //   //   // console.log("Тут треба робити сортування");
  //   //   // this.sortByLocalStorage(user, repo, data);
  //   //   // const listOfIds;
  //   //   sortByLocalStorage(user, repo, data);
  //   //   return { user, repo, data: result };
  //   // } else {
  //   //   updateLocalStorage(user, [{ repo, data: result }]);
  //   //   return { user, repo, data: result };
  //   // }
  // };
}

export const IssueStore = new IssueStoreInstance();
