/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  downloadAndSaveAvatarsAsJson,
  downloadAndSaveImagesAsJson,
} from "@src/zmock-data/helper";
import { mockComments } from "@src/zmock-data/mockComments";
import { mockGroups } from "@src/zmock-data/mockGroups";
import { mockPosts } from "@src/zmock-data/mockPosts";
import { mockReactions } from "@src/zmock-data/mockReactions";
import { mockUsers } from "@src/zmock-data/mockUsers";

const mockData = async () => {
  // await downloadAndSaveImagesAsJson(100);
  // await downloadAndSaveAvatarsAsJson(100);
  //create 100 users
  await mockUsers(100);
  //create 50 groups, each group has 30-50 members
  await mockGroups(50);

  //loop each user, create 20-40 posts (home post or group post) for each user
  await mockPosts(20, 40);

  //loop each user, comment to their (50%) friends' posts, group posts, or public posts
  await mockComments();

  //loop each user, react to their (80%) friends' posts, group posts, or public posts
  await mockReactions();

  return;
};

// mockData();
