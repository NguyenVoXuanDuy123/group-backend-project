# Details

Date : 2024-08-14 05:35:12

Directory c:\\Serious Project\\chc\\chc-backend\\identity-service\\group-backend-project\\src

Total : 61 files,  2233 codes, 450 comments, 493 blanks, all 3176 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/configs/database.config.ts](/src/configs/database.config.ts) | TypeScript | 29 | 0 | 6 | 35 |
| [src/configs/passport.config.ts](/src/configs/passport.config.ts) | TypeScript | 35 | 0 | 5 | 40 |
| [src/constant/EnvVars.ts](/src/constant/EnvVars.ts) | TypeScript | 25 | 5 | 2 | 32 |
| [src/constant/HttpStatusCodes.ts](/src/constant/HttpStatusCodes.ts) | TypeScript | 64 | 259 | 64 | 387 |
| [src/constant/dir.ts](/src/constant/dir.ts) | TypeScript | 2 | 0 | 2 | 4 |
| [src/controllers/auth.controller.ts](/src/controllers/auth.controller.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/controllers/group.controller.ts](/src/controllers/group.controller.ts) | TypeScript | 77 | 0 | 9 | 86 |
| [src/controllers/post.controller.ts](/src/controllers/post.controller.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/controllers/user.controller.ts](/src/controllers/user.controller.ts) | TypeScript | 138 | 0 | 24 | 162 |
| [src/error/AlreadyExistError.ts](/src/error/AlreadyExistError.ts) | TypeScript | 12 | 3 | 5 | 20 |
| [src/error/ApiError.ts](/src/error/ApiError.ts) | TypeScript | 8 | 3 | 3 | 14 |
| [src/error/ApiErrorCodes.ts](/src/error/ApiErrorCodes.ts) | TypeScript | 103 | 5 | 27 | 135 |
| [src/error/IsNotNumberError.ts](/src/error/IsNotNumberError.ts) | TypeScript | 12 | 3 | 3 | 18 |
| [src/error/LengthError.ts](/src/error/LengthError.ts) | TypeScript | 32 | 3 | 4 | 39 |
| [src/error/NotEmptyError.ts](/src/error/NotEmptyError.ts) | TypeScript | 12 | 15 | 7 | 34 |
| [src/error/NotFoundError.ts](/src/error/NotFoundError.ts) | TypeScript | 12 | 3 | 4 | 19 |
| [src/error/NotInEnumError.ts](/src/error/NotInEnumError.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [src/error/NotNullError.ts](/src/error/NotNullError.ts) | TypeScript | 12 | 3 | 4 | 19 |
| [src/error/RouteError.ts](/src/error/RouteError.ts) | TypeScript | 9 | 4 | 5 | 18 |
| [src/helpers/camelCaseifyWithDateConversion.ts](/src/helpers/camelCaseifyWithDateConversion.ts) | TypeScript | 53 | 17 | 12 | 82 |
| [src/helpers/handlers.ts](/src/helpers/handlers.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/helpers/removeNullValue.ts](/src/helpers/removeNullValue.ts) | TypeScript | 16 | 9 | 6 | 31 |
| [src/helpers/sanitation.ts](/src/helpers/sanitation.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [src/helpers/validation.ts](/src/helpers/validation.ts) | TypeScript | 68 | 43 | 18 | 129 |
| [src/index.ts](/src/index.ts) | TypeScript | 6 | 2 | 3 | 11 |
| [src/middlewares/auth.middleware.ts](/src/middlewares/auth.middleware.ts) | TypeScript | 48 | 1 | 9 | 58 |
| [src/middlewares/group.middleware.ts](/src/middlewares/group.middleware.ts) | TypeScript | 52 | 0 | 4 | 56 |
| [src/middlewares/post.middleware.ts](/src/middlewares/post.middleware.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/middlewares/user.middleware.ts](/src/middlewares/user.middleware.ts) | TypeScript | 67 | 1 | 6 | 74 |
| [src/middlewares/util.middleware.ts](/src/middlewares/util.middleware.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/pre-start.ts](/src/pre-start.ts) | TypeScript | 0 | 8 | 3 | 11 |
| [src/repositories/friendRequest.repository.ts](/src/repositories/friendRequest.repository.ts) | TypeScript | 63 | 0 | 7 | 70 |
| [src/repositories/group.repository.ts](/src/repositories/group.repository.ts) | TypeScript | 47 | 0 | 8 | 55 |
| [src/repositories/groupJoinRequest.repository.ts](/src/repositories/groupJoinRequest.repository.ts) | TypeScript | 79 | 0 | 5 | 84 |
| [src/repositories/user.repository.ts](/src/repositories/user.repository.ts) | TypeScript | 101 | 8 | 19 | 128 |
| [src/routes/auth.routes.ts](/src/routes/auth.routes.ts) | TypeScript | 28 | 0 | 7 | 35 |
| [src/routes/group.routes.ts](/src/routes/group.routes.ts) | TypeScript | 52 | 0 | 10 | 62 |
| [src/routes/index.routes.ts](/src/routes/index.routes.ts) | TypeScript | 11 | 0 | 4 | 15 |
| [src/routes/post.routes.ts](/src/routes/post.routes.ts) | TypeScript | 3 | 0 | 3 | 6 |
| [src/routes/types/express/index.d.ts](/src/routes/types/express/index.d.ts) | TypeScript | 6 | 1 | 5 | 12 |
| [src/routes/types/express/misc.ts](/src/routes/types/express/misc.ts) | TypeScript | 7 | 1 | 5 | 13 |
| [src/routes/types/types.ts](/src/routes/types/types.ts) | TypeScript | 9 | 1 | 5 | 15 |
| [src/routes/user.routes.ts](/src/routes/user.routes.ts) | TypeScript | 79 | 1 | 16 | 96 |
| [src/schema/friendRequest.schema.ts](/src/schema/friendRequest.schema.ts) | TypeScript | 36 | 4 | 6 | 46 |
| [src/schema/group.schema.ts](/src/schema/group.schema.ts) | TypeScript | 48 | 5 | 7 | 60 |
| [src/schema/groupJoinRequest.schema.ts](/src/schema/groupJoinRequest.schema.ts) | TypeScript | 36 | 3 | 5 | 44 |
| [src/schema/post.schema.ts](/src/schema/post.schema.ts) | TypeScript | 53 | 3 | 7 | 63 |
| [src/schema/user.schema.ts](/src/schema/user.schema.ts) | TypeScript | 65 | 6 | 8 | 79 |
| [src/server.ts](/src/server.ts) | TypeScript | 52 | 12 | 20 | 84 |
| [src/services/auth.service.ts](/src/services/auth.service.ts) | TypeScript | 55 | 0 | 10 | 65 |
| [src/services/friendRequest.service.ts](/src/services/friendRequest.service.ts) | TypeScript | 83 | 8 | 15 | 106 |
| [src/services/group.service.ts](/src/services/group.service.ts) | TypeScript | 88 | 3 | 16 | 107 |
| [src/services/groupJoinRequest.service.ts](/src/services/groupJoinRequest.service.ts) | TypeScript | 86 | 5 | 14 | 105 |
| [src/services/user.service.ts](/src/services/user.service.ts) | TypeScript | 126 | 0 | 19 | 145 |
| [src/tests/ApiTest.http](/src/tests/ApiTest.http) | HTTP | 6 | 1 | 1 | 8 |
| [src/types/api.types.ts](/src/types/api.types.ts) | TypeScript | 12 | 0 | 3 | 15 |
| [src/types/auth.types.ts](/src/types/auth.types.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/types/group.types.ts](/src/types/group.types.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/types/post.types.ts](/src/types/post.types.ts) | TypeScript | 0 | 0 | 1 | 1 |
| [src/types/user.types.ts](/src/types/user.types.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [src/validations/util.validation.ts](/src/validations/util.validation.ts) | TypeScript | 0 | 0 | 1 | 1 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)