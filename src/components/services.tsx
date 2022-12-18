export class Services {
  processSearchUrl = (urlString: string) => {
    const processedSearchUrl = urlString.split("/");
    const user = processedSearchUrl[3];
    const repo = processedSearchUrl[4];

    const uri = `https://api.github.com/repos/${user}/${repo}/issues`;
    return [uri, user, repo];
  };

  get = async (value: string) => {
    const data = await fetch(value);
    return data.json();
  };
}
