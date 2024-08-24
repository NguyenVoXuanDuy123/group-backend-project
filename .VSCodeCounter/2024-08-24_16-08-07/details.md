# Details

Date : 2024-08-24 16:08:07

Directory c:\\Serious Project\\Full Stack Development\\social-media\\group-backend-project\\src

Total : 74 files,  4814 codes, 688 comments, 860 blanks, all 6362 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/configs/database.config.ts](/src/configs/database.config.ts) | TypeScript | 27 | 0 | 6 | 33 |
| [src/configs/multer.config.ts](/src/configs/multer.config.ts) | TypeScript | 34 | 1 | 6 | 41 |
| [src/configs/passport.config.ts](/src/configs/passport.config.ts) | TypeScript | 36 | 0 | 5 | 41 |
| [src/constant/EnvVars.ts](/src/constant/EnvVars.ts) | TypeScript | 11 | 4 | 2 | 17 |
| [src/constant/HttpStatusCodes.ts](/src/constant/HttpStatusCodes.ts) | TypeScript | 64 | 259 | 64 | 387 |
| [src/constant/dir.ts](/src/constant/dir.ts) | TypeScript | 2 | 0 | 2 | 4 |
| [src/controllers/auth.controller.ts](/src/controllers/auth.controller.ts) | TypeScript | 53 | 0 | 8 | 61 |
| [src/controllers/comment.controller.ts](/src/controllers/comment.controller.ts) | TypeScript | 76 | 3 | 8 | 87 |
| [src/controllers/group.controller.ts](/src/controllers/group.controller.ts) | TypeScript | 135 | 9 | 18 | 162 |
| [src/controllers/post.controller.ts](/src/controllers/post.controller.ts) | TypeScript | 129 | 0 | 16 | 145 |
| [src/controllers/user.controller.ts](/src/controllers/user.controller.ts) | TypeScript | 186 | 3 | 29 | 218 |
| [src/enums/group.enum.ts](/src/enums/group.enum.ts) | TypeScript | 25 | 1 | 5 | 31 |
| [src/enums/post.enum.ts](/src/enums/post.enum.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [src/enums/user.enum.ts](/src/enums/user.enum.ts) | TypeScript | 21 | 2 | 4 | 27 |
| [src/error/ApiError.ts](/src/error/ApiError.ts) | TypeScript | 12 | 3 | 3 | 18 |
| [src/error/ApiErrorCodes.ts](/src/error/ApiErrorCodes.ts) | TypeScript | 331 | 23 | 73 | 427 |
| [src/error/NotEmptyError.ts](/src/error/NotEmptyError.ts) | TypeScript | 13 | 4 | 5 | 22 |
| [src/error/NotNullError.ts](/src/error/NotNullError.ts) | TypeScript | 15 | 3 | 4 | 22 |
| [src/error/RouteError.ts](/src/error/RouteError.ts) | TypeScript | 15 | 4 | 5 | 24 |
| [src/helpers/camelCaseifyWithDateConversion.ts](/src/helpers/camelCaseifyWithDateConversion.ts) | TypeScript | 53 | 19 | 13 | 85 |
| [src/helpers/handlers.ts](/src/helpers/handlers.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/helpers/removeNullValue.ts](/src/helpers/removeNullValue.ts) | TypeScript | 16 | 9 | 6 | 31 |
| [src/helpers/sanitation.ts](/src/helpers/sanitation.ts) | TypeScript | 17 | 5 | 3 | 25 |
| [src/helpers/validation.ts](/src/helpers/validation.ts) | TypeScript | 40 | 13 | 10 | 63 |
| [src/index.ts](/src/index.ts) | TypeScript | 5 | 2 | 4 | 11 |
| [src/middlewares/auth.middleware.ts](/src/middlewares/auth.middleware.ts) | TypeScript | 51 | 1 | 11 | 63 |
| [src/middlewares/group.middleware.ts](/src/middlewares/group.middleware.ts) | TypeScript | 65 | 0 | 7 | 72 |
| [src/middlewares/post.middleware.ts](/src/middlewares/post.middleware.ts) | TypeScript | 72 | 3 | 12 | 87 |
| [src/middlewares/user.middleware.ts](/src/middlewares/user.middleware.ts) | TypeScript | 64 | 1 | 6 | 71 |
| [src/middlewares/util.middleware.ts](/src/middlewares/util.middleware.ts) | TypeScript | 27 | 29 | 5 | 61 |
| [src/repositories/comment.repository.ts](/src/repositories/comment.repository.ts) | TypeScript | 87 | 1 | 11 | 99 |
| [src/repositories/friendRequest.repository.ts](/src/repositories/friendRequest.repository.ts) | TypeScript | 84 | 0 | 8 | 92 |
| [src/repositories/group.repository.ts](/src/repositories/group.repository.ts) | TypeScript | 68 | 1 | 8 | 77 |
| [src/repositories/groupJoinRequest.repository.ts](/src/repositories/groupJoinRequest.repository.ts) | TypeScript | 86 | 0 | 7 | 93 |
| [src/repositories/post.repository.ts](/src/repositories/post.repository.ts) | TypeScript | 248 | 6 | 17 | 271 |
| [src/repositories/reaction.repository.ts](/src/repositories/reaction.repository.ts) | TypeScript | 126 | 16 | 11 | 153 |
| [src/repositories/user.repository.ts](/src/repositories/user.repository.ts) | TypeScript | 90 | 0 | 14 | 104 |
| [src/routes/auth.routes.ts](/src/routes/auth.routes.ts) | TypeScript | 23 | 0 | 7 | 30 |
| [src/routes/comment.routes.ts](/src/routes/comment.routes.ts) | TypeScript | 27 | 1 | 10 | 38 |
| [src/routes/group.routes.ts](/src/routes/group.routes.ts) | TypeScript | 52 | 6 | 16 | 74 |
| [src/routes/index.routes.ts](/src/routes/index.routes.ts) | TypeScript | 22 | 2 | 6 | 30 |
| [src/routes/post.routes.ts](/src/routes/post.routes.ts) | TypeScript | 45 | 0 | 13 | 58 |
| [src/routes/upload.routes.ts](/src/routes/upload.routes.ts) | TypeScript | 27 | 0 | 4 | 31 |
| [src/routes/user.routes.ts](/src/routes/user.routes.ts) | TypeScript | 65 | 6 | 15 | 86 |
| [src/schema/comment.schema.ts](/src/schema/comment.schema.ts) | TypeScript | 44 | 3 | 6 | 53 |
| [src/schema/friendRequest.schema.ts](/src/schema/friendRequest.schema.ts) | TypeScript | 33 | 4 | 6 | 43 |
| [src/schema/group.schema.ts](/src/schema/group.schema.ts) | TypeScript | 40 | 3 | 5 | 48 |
| [src/schema/groupJoinRequest.schema.ts](/src/schema/groupJoinRequest.schema.ts) | TypeScript | 31 | 3 | 5 | 39 |
| [src/schema/post.schema.ts](/src/schema/post.schema.ts) | TypeScript | 56 | 3 | 6 | 65 |
| [src/schema/reaction.schema.ts](/src/schema/reaction.schema.ts) | TypeScript | 36 | 3 | 5 | 44 |
| [src/schema/user.schema.ts](/src/schema/user.schema.ts) | TypeScript | 59 | 4 | 6 | 69 |
| [src/server.ts](/src/server.ts) | TypeScript | 78 | 12 | 17 | 107 |
| [src/services/auth.service.ts](/src/services/auth.service.ts) | TypeScript | 61 | 0 | 10 | 71 |
| [src/services/comment.service.ts](/src/services/comment.service.ts) | TypeScript | 193 | 32 | 27 | 252 |
| [src/services/friendRequest.service.ts](/src/services/friendRequest.service.ts) | TypeScript | 87 | 8 | 18 | 113 |
| [src/services/group.service.ts](/src/services/group.service.ts) | TypeScript | 246 | 24 | 43 | 313 |
| [src/services/groupJoinRequest.service.ts](/src/services/groupJoinRequest.service.ts) | TypeScript | 108 | 6 | 19 | 133 |
| [src/services/post.service.ts](/src/services/post.service.ts) | TypeScript | 299 | 62 | 47 | 408 |
| [src/services/reaction.service.ts](/src/services/reaction.service.ts) | TypeScript | 35 | 0 | 5 | 40 |
| [src/services/user.service.ts](/src/services/user.service.ts) | TypeScript | 245 | 12 | 43 | 300 |
| [src/types/api.types.ts](/src/types/api.types.ts) | TypeScript | 13 | 0 | 3 | 16 |
| [src/types/auth.types.ts](/src/types/auth.types.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/types/comment.types.ts](/src/types/comment.types.ts) | TypeScript | 22 | 3 | 5 | 30 |
| [src/types/group.types.ts](/src/types/group.types.ts) | TypeScript | 47 | 9 | 8 | 64 |
| [src/types/post.types.ts](/src/types/post.types.ts) | TypeScript | 31 | 3 | 6 | 40 |
| [src/types/user.types.ts](/src/types/user.types.ts) | TypeScript | 45 | 13 | 9 | 67 |
| [src/types/util.types.ts](/src/types/util.types.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/zmock-data/fake-data.ts](/src/zmock-data/fake-data.ts) | TypeScript | 9 | 12 | 7 | 28 |
| [src/zmock-data/helper.ts](/src/zmock-data/helper.ts) | TypeScript | 14 | 1 | 4 | 19 |
| [src/zmock-data/mockComments.ts](/src/zmock-data/mockComments.ts) | TypeScript | 54 | 6 | 12 | 72 |
| [src/zmock-data/mockGroups.ts](/src/zmock-data/mockGroups.ts) | TypeScript | 39 | 4 | 6 | 49 |
| [src/zmock-data/mockPosts.ts](/src/zmock-data/mockPosts.ts) | TypeScript | 53 | 8 | 9 | 70 |
| [src/zmock-data/mockReactions.ts](/src/zmock-data/mockReactions.ts) | TypeScript | 96 | 7 | 17 | 120 |
| [src/zmock-data/mockUsers.ts](/src/zmock-data/mockUsers.ts) | TypeScript | 55 | 3 | 11 | 69 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)