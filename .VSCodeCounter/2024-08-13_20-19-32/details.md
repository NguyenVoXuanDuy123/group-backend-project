# Details

Date : 2024-08-13 20:19:32

Directory c:\\Serious Project\\chc\\chc-backend\\identity-service\\src

Total : 51 files,  1510 codes, 434 comments, 382 blanks, all 2326 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [src/common/EnvVars.ts](/src/common/EnvVars.ts) | TypeScript | 25 | 5 | 2 | 32 |
| [src/common/HttpStatusCodes.ts](/src/common/HttpStatusCodes.ts) | TypeScript | 64 | 259 | 64 | 387 |
| [src/configs/passport.config.ts](/src/configs/passport.config.ts) | TypeScript | 35 | 0 | 5 | 40 |
| [src/controllers/auth.controller.ts](/src/controllers/auth.controller.ts) | TypeScript | 21 | 0 | 6 | 27 |
| [src/controllers/user.controller.ts](/src/controllers/user.controller.ts) | TypeScript | 76 | 0 | 12 | 88 |
| [src/error/AlreadyExistError.ts](/src/error/AlreadyExistError.ts) | TypeScript | 12 | 3 | 5 | 20 |
| [src/error/ApiError.ts](/src/error/ApiError.ts) | TypeScript | 8 | 3 | 3 | 14 |
| [src/error/ApiErrorCodes.ts](/src/error/ApiErrorCodes.ts) | TypeScript | 70 | 5 | 19 | 94 |
| [src/error/IsNotNumberError.ts](/src/error/IsNotNumberError.ts) | TypeScript | 12 | 3 | 3 | 18 |
| [src/error/LengthError.ts](/src/error/LengthError.ts) | TypeScript | 32 | 3 | 4 | 39 |
| [src/error/NotEmptyError.ts](/src/error/NotEmptyError.ts) | TypeScript | 12 | 15 | 7 | 34 |
| [src/error/NotFoundError.ts](/src/error/NotFoundError.ts) | TypeScript | 12 | 3 | 4 | 19 |
| [src/error/NotInEnumError.ts](/src/error/NotInEnumError.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [src/error/NotNullError.ts](/src/error/NotNullError.ts) | TypeScript | 12 | 3 | 4 | 19 |
| [src/error/RouteError.ts](/src/error/RouteError.ts) | TypeScript | 9 | 4 | 5 | 18 |
| [src/helpers/camelCaseifyWithDateConversion.ts](/src/helpers/camelCaseifyWithDateConversion.ts) | TypeScript | 39 | 12 | 7 | 58 |
| [src/helpers/removeNullValue.ts](/src/helpers/removeNullValue.ts) | TypeScript | 16 | 9 | 6 | 31 |
| [src/helpers/sanitation.ts](/src/helpers/sanitation.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [src/helpers/validation.ts](/src/helpers/validation.ts) | TypeScript | 59 | 43 | 18 | 120 |
| [src/index.ts](/src/index.ts) | TypeScript | 6 | 2 | 3 | 11 |
| [src/middlewares/auth.middleware.ts](/src/middlewares/auth.middleware.ts) | TypeScript | 48 | 1 | 9 | 58 |
| [src/middlewares/user.middleware.ts](/src/middlewares/user.middleware.ts) | TypeScript | 56 | 1 | 5 | 62 |
| [src/middlewares/util.middleware.ts](/src/middlewares/util.middleware.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/models/Comment.ts](/src/models/Comment.ts) | TypeScript | 29 | 0 | 5 | 34 |
| [src/models/Group.ts](/src/models/Group.ts) | TypeScript | 51 | 0 | 5 | 56 |
| [src/models/Notification.ts](/src/models/Notification.ts) | TypeScript | 44 | 0 | 5 | 49 |
| [src/models/Post.ts](/src/models/Post.ts) | TypeScript | 50 | 0 | 5 | 55 |
| [src/models/Reaction.ts](/src/models/Reaction.ts) | TypeScript | 34 | 0 | 5 | 39 |
| [src/models/friendRequest.schema.ts](/src/models/friendRequest.schema.ts) | TypeScript | 36 | 4 | 6 | 46 |
| [src/models/user.schema.ts](/src/models/user.schema.ts) | TypeScript | 65 | 6 | 8 | 79 |
| [src/pre-start.ts](/src/pre-start.ts) | TypeScript | 0 | 8 | 3 | 11 |
| [src/repositories/friendRequest.repository.ts](/src/repositories/friendRequest.repository.ts) | TypeScript | 25 | 0 | 6 | 31 |
| [src/repositories/user.repository.ts](/src/repositories/user.repository.ts) | TypeScript | 71 | 8 | 18 | 97 |
| [src/routes/auth.routes.ts](/src/routes/auth.routes.ts) | TypeScript | 28 | 0 | 7 | 35 |
| [src/routes/index.routes.ts](/src/routes/index.routes.ts) | TypeScript | 7 | 0 | 5 | 12 |
| [src/routes/types/express/index.d.ts](/src/routes/types/express/index.d.ts) | TypeScript | 6 | 1 | 5 | 12 |
| [src/routes/types/express/misc.ts](/src/routes/types/express/misc.ts) | TypeScript | 7 | 1 | 5 | 13 |
| [src/routes/types/types.ts](/src/routes/types/types.ts) | TypeScript | 9 | 1 | 5 | 15 |
| [src/routes/users.routes.ts](/src/routes/users.routes.ts) | TypeScript | 42 | 1 | 9 | 52 |
| [src/server.ts](/src/server.ts) | TypeScript | 50 | 12 | 21 | 83 |
| [src/services/auth.service.ts](/src/services/auth.service.ts) | TypeScript | 55 | 0 | 10 | 65 |
| [src/services/database.service.ts](/src/services/database.service.ts) | TypeScript | 29 | 1 | 6 | 36 |
| [src/services/friendRequest.service.ts](/src/services/friendRequest.service.ts) | TypeScript | 72 | 6 | 13 | 91 |
| [src/services/user.service.ts](/src/services/user.service.ts) | TypeScript | 81 | 0 | 12 | 93 |
| [src/tests/ApiTest.http](/src/tests/ApiTest.http) | HTTP | 6 | 1 | 1 | 8 |
| [src/types/api.types.ts](/src/types/api.types.ts) | TypeScript | 11 | 0 | 4 | 15 |
| [src/types/auth.types.ts](/src/types/auth.types.ts) | TypeScript | 11 | 0 | 2 | 13 |
| [src/types/user.types.ts](/src/types/user.types.ts) | TypeScript | 24 | 0 | 6 | 30 |
| [src/util/handlers.ts](/src/util/handlers.ts) | TypeScript | 10 | 0 | 2 | 12 |
| [src/util/misc.ts](/src/util/misc.ts) | TypeScript | 10 | 9 | 4 | 23 |
| [src/validations/util.validation.ts](/src/validations/util.validation.ts) | TypeScript | 0 | 0 | 1 | 1 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)