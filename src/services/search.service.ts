import { SearchType } from "@src/enums/search.enums";
import groupRepository from "@src/repositories/group.repository";
import userRepository from "@src/repositories/user.repository";
import userService from "@src/services/user.service";
import { SearchQueryType } from "@src/types/search.types";

class searchService {
  public async search(
    searchQuery: SearchQueryType,
    // id of the user who is searching
    senderId: string
  ) {
    const { q, afterId, limit, searchBy } = searchQuery;

    // If searchType is not provided or is User, search for users
    if (!searchBy || searchBy === SearchType.User) {
      const sender = await userRepository.getUserById(senderId, { friends: 1 });
      const senderFriends = sender?.friends || [];
      const users = await userRepository.searchUsers(q, afterId, Number(limit));
      return Promise.all(
        users.map(async (user) => {
          const { friends, ...rest } = user;
          const mutualFriendCount = await userService.countMutualFriends(
            senderFriends,
            friends
          );
          return {
            ...rest,
            mutualFriendCount,
          };
        })
      );
    }

    if (searchBy === SearchType.Group) {
      return groupRepository.searchGroups(q, afterId, Number(limit));
    }
  }
}
export default new searchService();
