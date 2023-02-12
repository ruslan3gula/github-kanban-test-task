export class Services {
  processSearchUrl = (urlString: string) => {
    const processedSearchUrl = urlString.split("/");
    const user = processedSearchUrl[3];
    const repo = processedSearchUrl[4];

    const uri = `https://api.github.com/repos/${user}/${repo}/issues`;
    // console.log(uri);
    return [uri, user, repo];
  };

  get = async (value: string) => {
    const data = await fetch(value);
    return data.json();
  };
}

export const updateLocalStorage = (repo: any, newValue: any) => {
  localStorage.setItem(JSON.stringify(repo), JSON.stringify(newValue));
};
export const getLocalStorage = (value: any) => {
  return localStorage.getItem(JSON.stringify(value));
};

export const checkRepoInLocalStorage = (user: any, repo: any): boolean => {
  let userAsObject = null;
  if (getLocalStorage(user) !== null) {
    userAsObject = JSON.parse(getLocalStorage(user)!);
  }
  if (userAsObject.hasOwnProperty(repo)) return true;
  return false;
};

export const sortByLocalStorage = (user: any, repo: any, data: any) => {
  const { data: pattern } = JSON.parse(getLocalStorage(user)!).find(
    (item: any) => item.repo == repo
  );

  function extractIds(pattern: any, array: number) {
    return pattern[array].items.map((item: any) => {
      return item.id;
    });
  }

  const openIds = extractIds(pattern, 0);
  const inProgressIds = extractIds(pattern, 1);
  const doneId = extractIds(pattern, 2);

  return [openIds, inProgressIds, doneId];
  // const sortedDone = data.data.map((obj: any) => {
  //   if (pattern.includes(obj.id)) {
  //     return obj;
  //   }
  //   console.log("null");
  //   return null;
  // });

  // console.log("sortedDone", sortedDone);
};

type TIssues = {
  user: string;
  repo: string;
  data: [];
};

export const filterIssues = (data: any, user: string, repo: string) => {
  // const filteredData = data.pop();
  console.log("filteredData", data);

  const [openIds, inProgressIds, doneId] = sortByLocalStorage(user, repo, data);

  function filterBySlice(arr: [], data: any) {
    let result: [][] = [];
    data.map((item: any, index: number) => {
      // console.log(item.id);
      const feedback = arr.some((i) => item.id === i);
      if (feedback) {
        const removedItems: [] = data.slice(index, index + 1);

        //@ts-ignore
        result.push(removedItems[0]!);
      }
      // console.log("null");
      return null;
    });
    return result;
  }

  const inProgressIssues = filterBySlice(inProgressIds, data);
  const doneIssues = filterBySlice(doneId, data);
  // console.log(doneId, data);
  // console.log("inProgressIssues", inProgressIssues);
  // console.log("doneIssues", doneIssues);

  const result: any = [
    { id: 1, title: "OPEN", items: data },
    { id: 2, title: "IN PROGRESS", items: inProgressIssues },
    {
      id: 3,
      title: "DONE",
      items: doneIssues,
    },
  ];

  // console.log(result);

  return { user, repo, data: result };
};
