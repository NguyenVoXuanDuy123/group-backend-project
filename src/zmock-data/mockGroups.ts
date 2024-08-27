import { faker } from "@faker-js/faker";
import { SEED } from "@src/constant/dir";
import { GroupStatus, GroupVisibilityLevel } from "@src/enums/group.enum";
import GroupModel from "@src/schema/group.schema";
import UserModel from "@src/schema/user.schema";
import { randomDate } from "@src/zmock-data/helper";

export const mockGroups = async (groupCount: number) => {
  console.log(`start creating ${groupCount} groups`);
  const groups = [];
  faker.seed(SEED);
  const users = await UserModel.find();
  for (let i = 0; i < groupCount; i++) {
    const memberCount = faker.number.int({ min: 30, max: 50 });

    // pick random members
    const members = faker.helpers.arrayElements(users, memberCount);

    // pick the first member as the admin
    const admin = members[0];
    const date = randomDate(admin.created_at);
    const groupMembers = members.map((member) => member._id);

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
      await UserModel.updateOne(
        { _id: member._id },
        { $addToSet: { groups: group._id } }
      );
    }
    groups.push(group);
  }
  for (const group of groups) {
    await group.save();
  }

  return groups;
  console.log(`created ${groupCount} groups`);
  //   return await GroupModel.insertMany(groups);
};
