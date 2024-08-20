/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import UserModel, { IUser } from "@src/schema/user.schema";
import { faker } from "@faker-js/faker";
import authService from "@src/services/auth.service";
import { UserRole, UserStatus } from "@src/enums/user.enum";
import GroupModel from "@src/schema/group.schema";
import { GroupStatus, GroupVisibilityLevel } from "@src/enums/group.enum";
import { Types } from "mongoose";
import PostModel from "@src/schema/post.schema";
import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import CommentModel from "@src/schema/comment.schema";
import ReactionModel from "@src/schema/reaction.schema";
import { group } from "console";
import reactionRepository from "@src/repositories/reaction.repository";

const randomDate = (startDate: Date) => {
  const endDate = new Date("2024-08-21");

  const randomDate = faker.date.between({ from: startDate, to: endDate });
  return randomDate;
};

const maxDate = (date1: Date, date2: Date | null | undefined): Date => {
  if (!date2) return date1;
  return new Date(Math.max(date1.getTime(), date2.getTime()));
};

//sanitize username
const sanitizeUsername = (username: string): string => {
  return username.replace(/[^a-zA-Z0-9]/g, "");
};
const mockUsers = async (count: number) => {
  const users = [];
  const isMale = faker.datatype.boolean();

  for (let i = 0; i < count; i++) {
    const date = randomDate(new Date("2023-01-01"));
    users.push(
      new UserModel({
        username: sanitizeUsername(faker.internet.userName()),
        first_name: faker.person.firstName(isMale ? "male" : "female"),
        last_name: faker.person.lastName(isMale ? "male" : "female"),
        password: await authService.hashPassword("123456"),
        bio: faker.lorem.sentence(),
        avatar: faker.image.avatar(),
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        created_at: date,
        updated_at: date,
      })
    );
  }

  //Mock friendships between users
  for (const user of users) {
    // Randomly pick a number of friends for each user
    const friendNumber = faker.number.int({ min: 20, max: 50 });

    // pick random friends but not the user itself
    const friends = faker.helpers.arrayElements<any>(
      users.filter((u: { _id: any }) => u._id !== user._id),
      friendNumber
    );

    // Add the friends to the user's friends list
    user.friends = friends.map((friend) => friend._id);
    for (const friend of friends) {
      //If the friend is not already in the user's friends list, add the user to the friend's friends list
      if (!friend.friends.includes(user._id)) {
        friend.friends.push(user._id);
      }
    }
  }

  return users;
  //return await UserModel.insertMany(users);
};

const mockGroups = (users: any, count: number) => {
  const groups = [];
  for (let i = 0; i < count; i++) {
    const memberCount = faker.number.int({ min: 30, max: 50 });

    // pick random members
    const members = faker.helpers.arrayElements<any>(users, memberCount);

    // pick the first member as the admin
    const admin = members[0];
    const date = randomDate(admin.created_at);
    const groupMembers = members.map((member: any) => member._id);

    const group = new GroupModel({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      created_at: date,
      updated_at: date,
      admin: admin._id,
      members: groupMembers,
      //Group status is approved to avoid the need for site-admin approval
      status: GroupStatus.APPROVED,
      visibility_level: faker.helpers.arrayElement(
        Object.values(GroupVisibilityLevel)
      ),
    });
    for (const member of members) {
      member.groups = [...(member.groups || []), group._id];
      //   await member.save();
    }
    groups.push(group);
  }

  return groups;
  //   return await GroupModel.insertMany(groups);
};

const mockPosts = async (users: any[]) => {
  const posts = [];

  for (const user of users) {
    // Randomly pick a number of posts to create
    const postCount = faker.number.int({ min: 10, max: 25 });

    for (let i = 0; i < postCount; i++) {
      let group = null;
      let visibilityLevel = PostVisibilityLevel.PUBLIC;

      if (faker.datatype.boolean() && user.groups.length > 0) {
        // 50% chance to post in a group if the user is a member of any group

        group = faker.helpers.arrayElement<any>(user.groups);
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
              ? [...Array(imageNumber)].map(() => faker.image.url())
              : [],
          visibility_level: visibilityLevel, // 'group' if posted in a group
          group: group,
          created_at: date,
          updated_at: date,
        })
      );
    }
  }
  return posts;
  //   return await PostModel.insertMany(posts);
};

// console.log(posts);
// console.log(users);

const mockComments = (users: any[], posts: any[]) => {
  const comments = [];

  for (const user of users) {
    // Randomly pick a number of comments to create
    const commentCount = faker.number.int({ min: 10, max: 80 });

    for (let i = 0; i < commentCount; i++) {
      let postToCommentOn = null;

      // Choose one of the three cases
      const randomCase = faker.number.int({ min: 1, max: 3 });

      switch (randomCase) {
        case 1: {
          // Case 1: Pick a random group of the user, pick random posts in that group, and comment on those posts.
          if (user.groups && user.groups.length > 0) {
            const group = faker.helpers.arrayElement<any>(user.groups);
            const groupPosts = posts.filter(
              (post) => post.group && post.group.equals(group._id)
            );
            if (groupPosts.length > 0) {
              postToCommentOn = faker.helpers.arrayElement(groupPosts);
            }
          }
          break;
        }

        case 2: {
          // Case 2: Pick a random friend of the user, pick random posts of that friend, and comment on that post.
          if (user.friends && user.friends.length > 0) {
            const friend = faker.helpers.arrayElement<any>(user.friends);
            const friendPosts = posts.filter((post) =>
              post.author.equals(friend._id)
            );
            if (friendPosts.length > 0) {
              postToCommentOn = faker.helpers.arrayElement(friendPosts);
            }
          }
          break;
        }

        case 3: {
          // Case 3: Pick a random public post and comment on it.
          const publicPosts = posts.filter(
            (post) => post.visibility_level === PostVisibilityLevel.PUBLIC
          );
          if (publicPosts.length > 0) {
            postToCommentOn = faker.helpers.arrayElement(publicPosts);
          }
          break;
        }

        default:
          break;
      }

      // Randomly choose the date of the comment
      // The date of the comment should be after the post's created_at date
      if (postToCommentOn) {
        const date = randomDate(postToCommentOn.created_at);
        comments.push(
          new CommentModel({
            content: faker.lorem.sentence(),
            author: user._id,
            post: postToCommentOn._id,
            created_at: date,
            updated_at: date,
          })
        );
      }
    }
  }

  return comments;
  // return await CommentModel.insertMany(comments);
};

// console.log(comments);

const mockReactions = async () => {
  const reactions = [];
  const users = await UserModel.find();
  const posts = await PostModel.find();
  const comments = await CommentModel.find();
  for (const user of users) {
    // Randomly pick a number of reactions to create
    const reactionCount = faker.number.int({ min: 700, max: 1000 });

    for (let i = 0; i < reactionCount; i++) {
      let targetType: ReactionTargetType = ReactionTargetType.POST;
      let targetId = null;

      // Choose one of the three cases
      const randomCase = faker.number.int({ min: 1, max: 3 });

      switch (randomCase) {
        case 1: {
          // Case 1: React to a random post or comment in a group the user belongs to
          if (user.groups && user.groups.length > 0) {
            const group = faker.helpers.arrayElement<any>(user.groups);
            const groupPosts = posts.filter(
              (post) => post.group && post.group.equals(group._id)
            );
            const groupComments = comments.filter((comment) =>
              groupPosts.some((post) => post._id.equals(comment.post))
            );

            if (faker.datatype.boolean() && groupPosts.length > 0) {
              targetType = ReactionTargetType.POST;
              targetId = faker.helpers.arrayElement(groupPosts)._id;
            } else if (groupComments.length > 0) {
              targetType = ReactionTargetType.COMMENT;
              targetId = faker.helpers.arrayElement(groupComments)._id;
            }
          }
          break;
        }

        case 2: {
          // Case 2: React to a random post or comment of a friend
          if (user.friends && user.friends.length > 0) {
            const friend = faker.helpers.arrayElement<any>(user.friends);
            const friendPosts = posts.filter((post) =>
              post.author.equals(friend._id)
            );
            const friendComments = comments.filter((comment) =>
              friendPosts.some((post) => post._id.equals(comment.post))
            );

            if (faker.datatype.boolean() && friendPosts.length > 0) {
              targetType = ReactionTargetType.POST;
              targetId = faker.helpers.arrayElement(friendPosts)._id;
            } else if (friendComments.length > 0) {
              targetType = ReactionTargetType.COMMENT;
              targetId = faker.helpers.arrayElement(friendComments)._id;
            }
          }
          break;
        }

        case 3: {
          // Case 3: React to a random public post or comment
          const publicPosts = posts.filter(
            (post) => post.visibility_level === PostVisibilityLevel.PUBLIC
          );
          const publicComments = comments.filter((comment) =>
            publicPosts.some((post) => post._id.equals(comment.post))
          );

          if (faker.datatype.boolean() && publicPosts.length > 0) {
            targetType = ReactionTargetType.POST;
            targetId = faker.helpers.arrayElement(publicPosts)._id;
          } else if (publicComments.length > 0) {
            targetType = ReactionTargetType.COMMENT;
            targetId = faker.helpers.arrayElement(publicComments)._id;
          }
          break;
        }

        default:
          break;
      }
      const date = randomDate(new Date("2023-01-01"));

      // Check if the user has already reacted to the target
      const reaction = await ReactionModel.findOne({
        target: targetId,
        user: user._id,
        target_type: targetType,
      });

      if (reaction) {
        // If the user has already reacted to the target, skip this iteration
        continue;
      }

      if (targetId) {
        reactions.push(
          new ReactionModel({
            user: user._id,
            target_type: targetType,
            target: targetId,
            type: faker.helpers.arrayElement(Object.values(ReactionType)),
            created_at: date,
            updated_at: date,
          }).save()
        );
      }
    }
  }

  return reactions;
  // return await ReactionModel.insertMany(reactions);
};

const mockData = async () => {
  // const users = await mockUsers(100);
  // await UserModel.insertMany(users);
  // const groups = mockGroups(users, 30);
  // for (const group of groups) {
  //   await UserModel.updateMany(
  //     { _id: { $in: group.members } },
  //     { $push: { groups: group._id } }
  //   );
  // }
  // await GroupModel.insertMany(groups);
  // const posts = await mockPosts(users);

  // await PostModel.insertMany(posts);
  // const comments = mockComments(users, posts);
  // await CommentModel.insertMany(comments);
  console.log("starting reactions");
  const reactions = await mockReactions();
  console.log("Data generated successfully");
  return;
};

// mockData();
