import {
  observable,
  makeAutoObservable,
  action,
  runInAction,
  toJS,
} from "mobx";

import { Services } from "./services";

type TIssues = {
  user: string;
  repo: string;
  data: [];
};

export class IssueStoreInstance {
  issues: TIssues = { user: "", repo: "", data: [] };

  service;
  constructor() {
    makeAutoObservable(this, { issues: observable, getIssue: action });
    this.service = new Services();
  }

  getIssue = async (value: string) => {
    this.issues = { user: "", repo: "", data: [] };

    try {
      const [uri, user, repo] = this.service.processSearchUrl(value);
      const processedUrl: string = uri;
      const data = await this.service.get(processedUrl);
      runInAction(() => {
        this.issues = this.filterIssues(data, user, repo);
        // console.log(toJS(this.issues));
      });
    } catch (e) {}
  };

  filterIssues = (data: TIssues, user: string, repo: string) => {
    const result: any = [
      { id: 1, title: "OPEN", items: data },
      { id: 2, title: "IN PROGRESS", items: [] },
      {
        id: 3,
        title: "DONE",
        items: [],
      },
    ];

    const prevUser = localStorage.getItem(repo)
      ? console.log("Тут треба робити сортування")
      : localStorage.setItem(JSON.stringify(repo), JSON.stringify(result));
    // console.log("prevUser", prevUser);
    // prevUser.map((item: any) => {
    //   if (item.repo === repo) {
    //     return item;
    //   }

    //   return { ...item };
    // });

    return { user, repo, data: result };
  };
}

export const IssueStore = new IssueStoreInstance();
