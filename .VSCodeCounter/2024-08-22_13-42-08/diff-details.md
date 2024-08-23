# Diff Details

Date : 2024-08-22 13:42:08

Directory c:\\Serious Project\\Full Stack Development\\social-media\\group-backend-project\\src

Total : 47 files,  661 codes, 33 comments, 117 blanks, all 811 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/configs/database.config.ts](/src/configs/database.config.ts) | TypeScript | -2 | 0 | 0 | -2 |
| [src/configs/passport.config.ts](/src/configs/passport.config.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [src/controllers/comment.controller.ts](/src/controllers/comment.controller.ts) | TypeScript | 1 | 3 | 1 | 5 |
| [src/controllers/group.controller.ts](/src/controllers/group.controller.ts) | TypeScript | 13 | 1 | 1 | 15 |
| [src/controllers/post.controller.ts](/src/controllers/post.controller.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [src/controllers/user.controller.ts](/src/controllers/user.controller.ts) | TypeScript | 21 | -1 | 3 | 23 |
| [src/enums/user.enum.ts](/src/enums/user.enum.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/error/ApiErrorCodes.ts](/src/error/ApiErrorCodes.ts) | TypeScript | 51 | 2 | 14 | 67 |
| [src/error/InvalidIdError.ts](/src/error/InvalidIdError.ts) | TypeScript | -16 | -4 | -4 | -24 |
| [src/error/NotEmptyError.ts](/src/error/NotEmptyError.ts) | TypeScript | 0 | -11 | -2 | -13 |
| [src/helpers/sanitation.ts](/src/helpers/sanitation.ts) | TypeScript | 17 | 4 | 2 | 23 |
| [src/helpers/validation.ts](/src/helpers/validation.ts) | TypeScript | 6 | -30 | -5 | -29 |
| [src/middlewares/auth.middleware.ts](/src/middlewares/auth.middleware.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/middlewares/group.middleware.ts](/src/middlewares/group.middleware.ts) | TypeScript | 18 | 0 | 2 | 20 |
| [src/middlewares/post.middleware.ts](/src/middlewares/post.middleware.ts) | TypeScript | 17 | 0 | 3 | 20 |
| [src/middlewares/user.middleware.ts](/src/middlewares/user.middleware.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/repositories/friendRequest.repository.ts](/src/repositories/friendRequest.repository.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/repositories/group.repository.ts](/src/repositories/group.repository.ts) | TypeScript | -8 | 0 | -1 | -9 |
| [src/repositories/groupJoinRequest.repository.ts](/src/repositories/groupJoinRequest.repository.ts) | TypeScript | 5 | 0 | 0 | 5 |
| [src/repositories/post.repository.ts](/src/repositories/post.repository.ts) | TypeScript | -8 | 2 | -1 | -7 |
| [src/repositories/reaction.repository.ts](/src/repositories/reaction.repository.ts) | TypeScript | 6 | 2 | 0 | 8 |
| [src/repositories/user.repository.ts](/src/repositories/user.repository.ts) | TypeScript | 34 | -5 | 1 | 30 |
| [src/routes/group.routes.ts](/src/routes/group.routes.ts) | TypeScript | 9 | 1 | 3 | 13 |
| [src/routes/post.routes.ts](/src/routes/post.routes.ts) | TypeScript | 5 | 0 | 0 | 5 |
| [src/routes/upload.routes.ts](/src/routes/upload.routes.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/routes/user.routes.ts](/src/routes/user.routes.ts) | TypeScript | 5 | -1 | 1 | 5 |
| [src/schema/friendRequest.schema.ts](/src/schema/friendRequest.schema.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [src/server.ts](/src/server.ts) | TypeScript | 19 | 2 | 1 | 22 |
| [src/services/auth.service.ts](/src/services/auth.service.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/services/comment.service.ts](/src/services/comment.service.ts) | TypeScript | 0 | 4 | 1 | 5 |
| [src/services/friendRequest.service.ts](/src/services/friendRequest.service.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/services/group.service.ts](/src/services/group.service.ts) | TypeScript | 38 | 1 | 12 | 51 |
| [src/services/groupJoinRequest.service.ts](/src/services/groupJoinRequest.service.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [src/services/post.service.ts](/src/services/post.service.ts) | TypeScript | 16 | 16 | 2 | 34 |
| [src/services/user.service.ts](/src/services/user.service.ts) | TypeScript | 47 | 6 | 10 | 63 |
| [src/types/api.types.ts](/src/types/api.types.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/types/group.types.ts](/src/types/group.types.ts) | TypeScript | 4 | 1 | 1 | 6 |
| [src/types/post.types.ts](/src/types/post.types.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [src/types/user.types.ts](/src/types/user.types.ts) | TypeScript | 3 | 1 | 1 | 5 |
| [src/types/util.types.ts](/src/types/util.types.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/zmock-data/fake-data.ts](/src/zmock-data/fake-data.ts) | TypeScript | 14 | 7 | 7 | 28 |
| [src/zmock-data/helper.ts](/src/zmock-data/helper.ts) | TypeScript | 14 | 1 | 4 | 19 |
| [src/zmock-data/mockComments.ts](/src/zmock-data/mockComments.ts) | TypeScript | 54 | 6 | 12 | 72 |
| [src/zmock-data/mockGroups.ts](/src/zmock-data/mockGroups.ts) | TypeScript | 39 | 4 | 6 | 49 |
| [src/zmock-data/mockPosts.ts](/src/zmock-data/mockPosts.ts) | TypeScript | 53 | 8 | 9 | 70 |
| [src/zmock-data/mockReactions.ts](/src/zmock-data/mockReactions.ts) | TypeScript | 96 | 7 | 17 | 120 |
| [src/zmock-data/mockUsers.ts](/src/zmock-data/mockUsers.ts) | TypeScript | 42 | 6 | 8 | 56 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details