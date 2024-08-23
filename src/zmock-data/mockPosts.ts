import { faker } from "@faker-js/faker";
import { PostVisibilityLevel } from "@src/enums/post.enum";
import GroupModel from "@src/schema/group.schema";
import PostModel from "@src/schema/post.schema";
import UserModel from "@src/schema/user.schema";
import { maxDate, randomDate } from "@src/zmock-data/helper";

export const mockPosts = async (minPost: number, maxPost: number) => {
  const posts = [];
  const users = await UserModel.find();
  for (const user of users) {
    // Randomly pick a number of posts to create
    const postCount = faker.number.int({ min: minPost, max: maxPost });

    for (let i = 0; i < postCount; i++) {
      let group = null;
      let visibilityLevel = PostVisibilityLevel.PUBLIC;

      if (faker.datatype.boolean() && user.groups.length > 0) {
        // 50% chance to post in a group if the user is a member of any group
        group = faker.helpers.arrayElement(user.groups);
        visibilityLevel = PostVisibilityLevel.GROUP;
      } else {
        // Posting on home (wall)
        visibilityLevel = faker.helpers.arrayElement(
          Object.values([
            PostVisibilityLevel.FRIEND,
            PostVisibilityLevel.PUBLIC,
          ])
        );
      }

      const imageNumber = faker.number.int({ min: 0, max: 3 });

      //for ensuring the post is visible to the group
      if (visibilityLevel === PostVisibilityLevel.GROUP && !group) {
        console.error("check the method mockPosts, group is null");
      }

      // Randomly choose the date of the post
      // The date of the post should be after the user's created_at date
      // and after the group's created_at date if the post is in a group

      const groupObject = await GroupModel.findById(group);
      const date = randomDate(
        maxDate(user.created_at, groupObject?.created_at)
      );
      posts.push(
        new PostModel({
          content: faker.lorem.paragraph(),
          author: user._id,
          images:
            imageNumber > 0
              ? [...Array<string>(imageNumber)].map(() => faker.image.url())
              : [],
          visibility_level: visibilityLevel, // 'group' if posted in a group
          group: group,
          created_at: date,
          updated_at: date,
        })
      );
    }
  }

  for (const post of posts) {
    await post.save();
  }
  //   return await PostModel.insertMany(posts);
};
