export type BlogPost = {
  title: string;
  date: string;
  slug: string;
  readingTime: string;
};

export type BlogConfig = {
  title: string;
  date: string;
  filePath: string;
};

export type NextjsParams = {
  params: {
    slug: string;
  };
};
