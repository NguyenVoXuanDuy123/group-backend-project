import { SearchType } from "@src/enums/search.enums";

export type SearchQueryType = {
  q: string;
  searchBy: SearchType;
  afterId?: string;
  limit?: number;
};
