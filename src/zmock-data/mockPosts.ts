/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from "@faker-js/faker";
import { PostVisibilityLevel } from "@src/enums/post.enum";
import GroupModel from "@src/schema/group.schema";
import PostModel from "@src/schema/post.schema";
import UserModel from "@src/schema/user.schema";
import fs from "fs";
import { maxDate, randomDate } from "@src/zmock-data/helper";
import { MOCK_IMAGE_DIR, SEED } from "@src/constant/dir";
import newsfeedRepository from "@src/repositories/newsfeed.repository";

export const mockPosts = async (minPost: number, maxPost: number) => {
  console.log("start mockPosts");

  faker.seed(SEED + 3);
  const posts = [];
  const users = await UserModel.find();
  const data = fs.readFileSync(MOCK_IMAGE_DIR, "utf-8");
  const jsonObject = JSON.parse(data);
  const mockImages: Array<string> = jsonObject?.images;
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

      //for ensuring the post is visible to the group
      if (visibilityLevel === PostVisibilityLevel.GROUP && !group) {
        console.error("check the method mockPosts, group is null");
      }

      // Randomly choose the date of the post
      // The date of the post should be after the user's createdAt date
      // and after the group's createdAt date if the post is in a group

      const groupObject = await GroupModel.findById(group);
      const date = randomDate(maxDate(user.createdAt, groupObject?.createdAt));

      const imageNumber = faker.number.int({ min: 0, max: 5 });

      const images = faker.helpers.arrayElements(mockImages, imageNumber);

      const postId = faker.database.mongodbObjectId();

      if (visibilityLevel === PostVisibilityLevel.GROUP && groupObject) {
        await newsfeedRepository.pushNewsfeed(
          groupObject.members,
          postId,
          user._id,
          date,
          groupObject._id
        );
      } else {
        await newsfeedRepository.pushNewsfeed(
          user.friends,
          postId,
          user._id,
          date
        );
      }

      posts.push(
        new PostModel({
          _id: postId,
          content: faker.lorem.paragraph(),
          author: user._id,
          images: images,
          visibilityLevel: visibilityLevel, // 'group' if posted in a group
          group: group,
          createdAt: date,
          updatedAt: date,
        })
      );
    }
  }

  for (const post of posts) {
    await post.save();
  }
  console.log("end mockPosts");
  //   return await PostModel.insertMany(posts);
};
