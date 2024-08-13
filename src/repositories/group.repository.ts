import GroupModel, { IGroup } from "@src/schema/group.schema";

class GroupRepository {
  async createGroup(group: IGroup) {
    return await GroupModel.create(group);
  }

  async updateGroupById(_id: string, payload: Partial<IGroup>) {
    return await GroupModel.findByIdAndUpdate(_id, payload, { new: true });
  }

  async getGroupById(_id: string) {
    return await GroupModel.findById(_id, { __v: 0 }).lean();
  }

  async getGroupMembers(_id: string) {
    return await GroupModel.aggregate([
      { $match: { _id: _id } },
      { $unwind: "$members" },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      { $unwind: "$memberDetails" },
      {
        $project: {
          _id: "$memberDetails._id",
          first_name: "$memberDetails.first_name",
          last_name: "$memberDetails.last_name",
          avatar: "$memberDetails.avatar",
          username: "$memberDetails.username",
        },
      },
    ]);
  }
}

export default new GroupRepository();
