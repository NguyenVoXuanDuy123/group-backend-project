# Details

Date : 2024-08-17 00:24:58

Directory c:\\Serious Project\\Full Stack Development\\social-media\\group-backend-project\\src

Total : 70 files,  3084 codes, 621 comments, 632 blanks, all 4337 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/configs/database.config.ts](/src/configs/database.config.ts) | TypeScript | 29 | 0 | 6 | 35 |
| [src/configs/passport.config.ts](/src/configs/passport.config.ts) | TypeScript | 36 | 0 | 5 | 41 |
| [src/constant/EnvVars.ts](/src/constant/EnvVars.ts) | TypeScript | 11 | 4 | 2 | 17 |
| [src/constant/HttpStatusCodes.ts](/src/constant/HttpStatusCodes.ts) | TypeScript | 64 | 259 | 64 | 387 |
| [src/constant/dir.ts](/src/constant/dir.ts) | TypeScript | 2 | 0 | 2 | 4 |
| [src/controllers/auth.controller.ts](/src/controllers/auth.controller.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/controllers/group.controller.ts](/src/controllers/group.controller.ts) | TypeScript | 105 | 8 | 15 | 128 |
| [src/controllers/post.controller.ts](/src/controllers/post.controller.ts) | TypeScript | 92 | 0 | 12 | 104 |
| [src/controllers/user.controller.ts](/src/controllers/user.controller.ts) | TypeScript | 126 | 4 | 22 | 152 |
| [src/enums/group.enum.ts](/src/enums/group.enum.ts) | TypeScript | 25 | 1 | 5 | 31 |
| [src/enums/post.enum.ts](/src/enums/post.enum.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [src/enums/user.enum.ts](/src/enums/user.enum.ts) | TypeScript | 15 | 2 | 3 | 20 |
| [src/error/AlreadyExistError.ts](/src/error/AlreadyExistError.ts) | TypeScript | 12 | 3 | 5 | 20 |
| [src/error/ApiError.ts](/src/error/ApiError.ts) | TypeScript | 8 | 3 | 3 | 14 |
| [src/error/ApiErrorCodes.ts](/src/error/ApiErrorCodes.ts) | TypeScript | 124 | 16 | 32 | 172 |
| [src/error/IsNotNumberError.ts](/src/error/IsNotNumberError.ts) | TypeScript | 12 | 3 | 3 | 18 |
| [src/error/LengthError.ts](/src/error/LengthError.ts) | TypeScript | 32 | 3 | 4 | 39 |
| [src/error/NotEmptyError.ts](/src/error/NotEmptyError.ts) | TypeScript | 12 | 15 | 7 | 34 |
| [src/error/NotFoundError.ts](/src/error/NotFoundError.ts) | TypeScript | 12 | 3 | 4 | 19 |
| [src/error/NotNullError.ts](/src/error/NotNullError.ts) | TypeScript | 12 | 3 | 4 | 19 |
| [src/error/RouteError.ts](/src/error/RouteError.ts) | TypeScript | 9 | 4 | 5 | 18 |
| [src/helpers/camelCaseifyWithDateConversion.ts](/src/helpers/camelCaseifyWithDateConversion.ts) | TypeScript | 53 | 19 | 12 | 84 |
| [src/helpers/handlers.ts](/src/helpers/handlers.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/helpers/removeNullValue.ts](/src/helpers/removeNullValue.ts) | TypeScript | 16 | 9 | 6 | 31 |
| [src/helpers/sanitation.ts](/src/helpers/sanitation.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [src/helpers/validation.ts](/src/helpers/validation.ts) | TypeScript | 67 | 43 | 18 | 128 |
| [src/index.ts](/src/index.ts) | TypeScript | 5 | 2 | 4 | 11 |
| [src/middlewares/auth.middleware.ts](/src/middlewares/auth.middleware.ts) | TypeScript | 49 | 1 | 9 | 59 |
| [src/middlewares/group.middleware.ts](/src/middlewares/group.middleware.ts) | TypeScript | 47 | 0 | 5 | 52 |
| [src/middlewares/post.middleware.ts](/src/middlewares/post.middleware.ts) | TypeScript | 45 | 3 | 7 | 55 |
| [src/middlewares/user.middleware.ts](/src/middlewares/user.middleware.ts) | TypeScript | 61 | 1 | 6 | 68 |
| [src/middlewares/util.middleware.ts](/src/middlewares/util.middleware.ts) | TypeScript | 31 | 12 | 4 | 47 |
| [src/repositories/comment.repository.ts](/src/repositories/comment.repository.ts) | TypeScript | 2 | 0 | 2 | 4 |
| [src/repositories/friendRequest.repository.ts](/src/repositories/friendRequest.repository.ts) | TypeScript | 80 | 0 | 8 | 88 |
| [src/repositories/group.repository.ts](/src/repositories/group.repository.ts) | TypeScript | 72 | 1 | 9 | 82 |
| [src/repositories/groupJoinRequest.repository.ts](/src/repositories/groupJoinRequest.repository.ts) | TypeScript | 78 | 0 | 7 | 85 |
| [src/repositories/post.repository.ts](/src/repositories/post.repository.ts) | TypeScript | 44 | 0 | 10 | 54 |
| [src/repositories/reaction.repository.ts](/src/repositories/reaction.repository.ts) | TypeScript | 93 | 9 | 8 | 110 |
| [src/repositories/user.repository.ts](/src/repositories/user.repository.ts) | TypeScript | 95 | 5 | 17 | 117 |
| [src/routes/auth.routes.ts](/src/routes/auth.routes.ts) | TypeScript | 25 | 0 | 7 | 32 |
| [src/routes/comment.routes.ts](/src/routes/comment.routes.ts) | TypeScript | 3 | 18 | 8 | 29 |
| [src/routes/group.routes.ts](/src/routes/group.routes.ts) | TypeScript | 39 | 9 | 13 | 61 |
| [src/routes/index.routes.ts](/src/routes/index.routes.ts) | TypeScript | 18 | 2 | 6 | 26 |
| [src/routes/post.routes.ts](/src/routes/post.routes.ts) | TypeScript | 30 | 16 | 15 | 61 |
| [src/routes/types/express/index.d.ts](/src/routes/types/express/index.d.ts) | TypeScript | 6 | 1 | 5 | 12 |
| [src/routes/types/express/misc.ts](/src/routes/types/express/misc.ts) | TypeScript | 7 | 1 | 5 | 13 |
| [src/routes/types/types.ts](/src/routes/types/types.ts) | TypeScript | 9 | 1 | 5 | 15 |
| [src/routes/user.routes.ts](/src/routes/user.routes.ts) | TypeScript | 46 | 11 | 11 | 68 |
| [src/schema/comment.schema.ts](/src/schema/comment.schema.ts) | TypeScript | 44 | 3 | 6 | 53 |
| [src/schema/friendRequest.schema.ts](/src/schema/friendRequest.schema.ts) | TypeScript | 36 | 4 | 6 | 46 |
| [src/schema/group.schema.ts](/src/schema/group.schema.ts) | TypeScript | 40 | 3 | 5 | 48 |
| [src/schema/groupJoinRequest.schema.ts](/src/schema/groupJoinRequest.schema.ts) | TypeScript | 31 | 3 | 5 | 39 |
| [src/schema/post.schema.ts](/src/schema/post.schema.ts) | TypeScript | 57 | 3 | 6 | 66 |
| [src/schema/reaction.schema.ts](/src/schema/reaction.schema.ts) | TypeScript | 36 | 3 | 5 | 44 |
| [src/schema/user.schema.ts](/src/schema/user.schema.ts) | TypeScript | 58 | 4 | 6 | 68 |
| [src/server.ts](/src/server.ts) | TypeScript | 51 | 12 | 19 | 82 |
| [src/services/auth.service.ts](/src/services/auth.service.ts) | TypeScript | 55 | 0 | 10 | 65 |
| [src/services/comment.service.ts](/src/services/comment.service.ts) | TypeScript | 2 | 0 | 2 | 4 |
| [src/services/friendRequest.service.ts](/src/services/friendRequest.service.ts) | TypeScript | 89 | 8 | 17 | 114 |
| [src/services/group.service.ts](/src/services/group.service.ts) | TypeScript | 145 | 17 | 19 | 181 |
| [src/services/groupJoinRequest.service.ts](/src/services/groupJoinRequest.service.ts) | TypeScript | 89 | 6 | 15 | 110 |
| [src/services/post.service.ts](/src/services/post.service.ts) | TypeScript | 223 | 36 | 33 | 292 |
| [src/services/reaction.service.ts](/src/services/reaction.service.ts) | TypeScript | 35 | 0 | 5 | 40 |
| [src/services/user.service.ts](/src/services/user.service.ts) | TypeScript | 147 | 0 | 24 | 171 |
| [src/types/api.types.ts](/src/types/api.types.ts) | TypeScript | 12 | 0 | 3 | 15 |
| [src/types/auth.types.ts](/src/types/auth.types.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/types/comment.types.ts](/src/types/comment.types.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/types/group.types.ts](/src/types/group.types.ts) | TypeScript | 43 | 8 | 7 | 58 |
| [src/types/post.types.ts](/src/types/post.types.ts) | TypeScript | 32 | 3 | 6 | 41 |
| [src/types/user.types.ts](/src/types/user.types.ts) | TypeScript | 43 | 12 | 8 | 63 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)