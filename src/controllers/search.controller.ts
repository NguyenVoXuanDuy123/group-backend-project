import searchService from "@src/services/search.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { SearchQueryType } from "@src/types/search.types";
import { UserSessionType } from "@src/types/user.types";

class searchController {
  public search = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const results = await searchService.search(
      req.query as SearchQueryType,
      _id
    );
    res.status(200).json({
      message: "Search successfully",
      result: results,
    });
  };
}

export default new searchController();
