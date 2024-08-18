# Diff Details

Date : 2024-08-17 20:47:07

Directory c:\\Serious Project\\Full Stack Development\\social-media\\group-backend-project\\src

Total : 44 files,  566 codes, 48 comments, 80 blanks, all 694 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/configs/multer.config.ts](/src/configs/multer.config.ts) | TypeScript | 34 | 1 | 6 | 41 |
| [src/controllers/auth.controller.ts](/src/controllers/auth.controller.ts) | TypeScript | -1 | 0 | -1 | -2 |
| [src/controllers/comment.controller.ts](/src/controllers/comment.controller.ts) | TypeScript | 62 | 0 | 6 | 68 |
| [src/controllers/group.controller.ts](/src/controllers/group.controller.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/controllers/post.controller.ts](/src/controllers/post.controller.ts) | TypeScript | 15 | 12 | 2 | 29 |
| [src/controllers/user.controller.ts](/src/controllers/user.controller.ts) | TypeScript | 26 | 0 | 2 | 28 |
| [src/error/AlreadyExistError.ts](/src/error/AlreadyExistError.ts) | TypeScript | -12 | -3 | -5 | -20 |
| [src/error/ApiError.ts](/src/error/ApiError.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/error/ApiErrorCodes.ts](/src/error/ApiErrorCodes.ts) | TypeScript | 146 | 5 | 25 | 176 |
| [src/error/InvalidIdError.ts](/src/error/InvalidIdError.ts) | TypeScript | 16 | 4 | 4 | 24 |
| [src/error/IsNotNumberError.ts](/src/error/IsNotNumberError.ts) | TypeScript | -12 | -3 | -3 | -18 |
| [src/error/LengthError.ts](/src/error/LengthError.ts) | TypeScript | -32 | -3 | -4 | -39 |
| [src/error/NotEmptyError.ts](/src/error/NotEmptyError.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/error/NotFoundError.ts](/src/error/NotFoundError.ts) | TypeScript | -12 | -3 | -4 | -19 |
| [src/error/NotNullError.ts](/src/error/NotNullError.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/error/RouteError.ts](/src/error/RouteError.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [src/helpers/camelCaseifyWithDateConversion.ts](/src/helpers/camelCaseifyWithDateConversion.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/helpers/validation.ts](/src/helpers/validation.ts) | TypeScript | -37 | 0 | -4 | -41 |
| [src/middlewares/auth.middleware.ts](/src/middlewares/auth.middleware.ts) | TypeScript | -3 | 0 | 1 | -2 |
| [src/middlewares/post.middleware.ts](/src/middlewares/post.middleware.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/middlewares/util.middleware.ts](/src/middlewares/util.middleware.ts) | TypeScript | -4 | 17 | 1 | 14 |
| [src/repositories/comment.repository.ts](/src/repositories/comment.repository.ts) | TypeScript | 39 | 0 | 7 | 46 |
| [src/repositories/group.repository.ts](/src/repositories/group.repository.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/repositories/groupJoinRequest.repository.ts](/src/repositories/groupJoinRequest.repository.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/repositories/post.repository.ts](/src/repositories/post.repository.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/repositories/reaction.repository.ts](/src/repositories/reaction.repository.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/repositories/user.repository.ts](/src/repositories/user.repository.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/routes/comment.routes.ts](/src/routes/comment.routes.ts) | TypeScript | 20 | -17 | 1 | 4 |
| [src/routes/index.routes.ts](/src/routes/index.routes.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/routes/post.routes.ts](/src/routes/post.routes.ts) | TypeScript | 6 | -12 | -2 | -8 |
| [src/routes/upload.routes.ts](/src/routes/upload.routes.ts) | TypeScript | 26 | 0 | 4 | 30 |
| [src/routes/user.routes.ts](/src/routes/user.routes.ts) | TypeScript | 10 | 0 | 3 | 13 |
| [src/schema/post.schema.ts](/src/schema/post.schema.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [src/schema/user.schema.ts](/src/schema/user.schema.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [src/server.ts](/src/server.ts) | TypeScript | 2 | 3 | -2 | 3 |
| [src/services/auth.service.ts](/src/services/auth.service.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [src/services/comment.service.ts](/src/services/comment.service.ts) | TypeScript | 176 | 23 | 19 | 218 |
| [src/services/friendRequest.service.ts](/src/services/friendRequest.service.ts) | TypeScript | -6 | 0 | 1 | -5 |
| [src/services/group.service.ts](/src/services/group.service.ts) | TypeScript | 13 | 5 | 4 | 22 |
| [src/services/groupJoinRequest.service.ts](/src/services/groupJoinRequest.service.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/services/post.service.ts](/src/services/post.service.ts) | TypeScript | 29 | 12 | 8 | 49 |
| [src/services/user.service.ts](/src/services/user.service.ts) | TypeScript | -4 | 4 | 2 | 2 |
| [src/types/comment.types.ts](/src/types/comment.types.ts) | TypeScript | 22 | 3 | 4 | 29 |
| [src/types/user.types.ts](/src/types/user.types.ts) | TypeScript | -1 | 0 | 0 | -1 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details