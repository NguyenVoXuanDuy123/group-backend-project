# Diff Details

Date : 2024-08-17 00:24:58

Directory c:\\Serious Project\\Full Stack Development\\social-media\\group-backend-project\\src

Total : 131 files,  851 codes, 171 comments, 139 blanks, all 1161 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

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
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\configs\database.config.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cconfigs%5Cdatabase.config.ts) | TypeScript | -29 | 0 | -6 | -35 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\configs\passport.config.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cconfigs%5Cpassport.config.ts) | TypeScript | -35 | 0 | -5 | -40 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\constant\EnvVars.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cconstant%5CEnvVars.ts) | TypeScript | -25 | -5 | -2 | -32 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\constant\HttpStatusCodes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cconstant%5CHttpStatusCodes.ts) | TypeScript | -64 | -259 | -64 | -387 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\constant\dir.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cconstant%5Cdir.ts) | TypeScript | -2 | 0 | -2 | -4 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\controllers\auth.controller.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ccontrollers%5Cauth.controller.ts) | TypeScript | -21 | 0 | -6 | -27 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\controllers\group.controller.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ccontrollers%5Cgroup.controller.ts) | TypeScript | -77 | 0 | -9 | -86 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\controllers\post.controller.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ccontrollers%5Cpost.controller.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\controllers\user.controller.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ccontrollers%5Cuser.controller.ts) | TypeScript | -138 | 0 | -24 | -162 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\AlreadyExistError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CAlreadyExistError.ts) | TypeScript | -12 | -3 | -5 | -20 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\ApiError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CApiError.ts) | TypeScript | -8 | -3 | -3 | -14 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\ApiErrorCodes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CApiErrorCodes.ts) | TypeScript | -103 | -5 | -27 | -135 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\IsNotNumberError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CIsNotNumberError.ts) | TypeScript | -12 | -3 | -3 | -18 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\LengthError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CLengthError.ts) | TypeScript | -32 | -3 | -4 | -39 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\NotEmptyError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CNotEmptyError.ts) | TypeScript | -12 | -15 | -7 | -34 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\NotFoundError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CNotFoundError.ts) | TypeScript | -12 | -3 | -4 | -19 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\NotInEnumError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CNotInEnumError.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\NotNullError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CNotNullError.ts) | TypeScript | -12 | -3 | -4 | -19 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\error\RouteError.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cerror%5CRouteError.ts) | TypeScript | -9 | -4 | -5 | -18 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\helpers\camelCaseifyWithDateConversion.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Chelpers%5CcamelCaseifyWithDateConversion.ts) | TypeScript | -53 | -17 | -12 | -82 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\helpers\handlers.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Chelpers%5Chandlers.ts) | TypeScript | -10 | 0 | -2 | -12 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\helpers\removeNullValue.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Chelpers%5CremoveNullValue.ts) | TypeScript | -16 | -9 | -6 | -31 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\helpers\sanitation.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Chelpers%5Csanitation.ts) | TypeScript | 0 | -1 | -1 | -2 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\helpers\validation.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Chelpers%5Cvalidation.ts) | TypeScript | -68 | -43 | -18 | -129 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\index.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cindex.ts) | TypeScript | -6 | -2 | -3 | -11 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\middlewares\auth.middleware.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cmiddlewares%5Cauth.middleware.ts) | TypeScript | -48 | -1 | -9 | -58 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\middlewares\group.middleware.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cmiddlewares%5Cgroup.middleware.ts) | TypeScript | -52 | 0 | -4 | -56 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\middlewares\post.middleware.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cmiddlewares%5Cpost.middleware.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\middlewares\user.middleware.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cmiddlewares%5Cuser.middleware.ts) | TypeScript | -67 | -1 | -6 | -74 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\middlewares\util.middleware.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cmiddlewares%5Cutil.middleware.ts) | TypeScript | -10 | 0 | -2 | -12 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\pre-start.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cpre-start.ts) | TypeScript | 0 | -8 | -3 | -11 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\repositories\friendRequest.repository.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Crepositories%5CfriendRequest.repository.ts) | TypeScript | -63 | 0 | -7 | -70 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\repositories\group.repository.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Crepositories%5Cgroup.repository.ts) | TypeScript | -47 | 0 | -8 | -55 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\repositories\groupJoinRequest.repository.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Crepositories%5CgroupJoinRequest.repository.ts) | TypeScript | -79 | 0 | -5 | -84 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\repositories\user.repository.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Crepositories%5Cuser.repository.ts) | TypeScript | -101 | -8 | -19 | -128 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\auth.routes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Cauth.routes.ts) | TypeScript | -28 | 0 | -7 | -35 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\group.routes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Cgroup.routes.ts) | TypeScript | -52 | 0 | -10 | -62 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\index.routes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Cindex.routes.ts) | TypeScript | -11 | 0 | -4 | -15 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\post.routes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Cpost.routes.ts) | TypeScript | -3 | 0 | -3 | -6 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\types\express\index.d.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Ctypes%5Cexpress%5Cindex.d.ts) | TypeScript | -6 | -1 | -5 | -12 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\types\express\misc.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Ctypes%5Cexpress%5Cmisc.ts) | TypeScript | -7 | -1 | -5 | -13 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\types\types.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Ctypes%5Ctypes.ts) | TypeScript | -9 | -1 | -5 | -15 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\routes\user.routes.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Croutes%5Cuser.routes.ts) | TypeScript | -79 | -1 | -16 | -96 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\schema\friendRequest.schema.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cschema%5CfriendRequest.schema.ts) | TypeScript | -36 | -4 | -6 | -46 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\schema\group.schema.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cschema%5Cgroup.schema.ts) | TypeScript | -48 | -5 | -7 | -60 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\schema\groupJoinRequest.schema.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cschema%5CgroupJoinRequest.schema.ts) | TypeScript | -36 | -3 | -5 | -44 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\schema\post.schema.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cschema%5Cpost.schema.ts) | TypeScript | -53 | -3 | -7 | -63 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\schema\user.schema.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cschema%5Cuser.schema.ts) | TypeScript | -65 | -6 | -8 | -79 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\server.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cserver.ts) | TypeScript | -52 | -12 | -20 | -84 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\services\auth.service.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cservices%5Cauth.service.ts) | TypeScript | -55 | 0 | -10 | -65 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\services\friendRequest.service.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cservices%5CfriendRequest.service.ts) | TypeScript | -83 | -8 | -15 | -106 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\services\group.service.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cservices%5Cgroup.service.ts) | TypeScript | -88 | -3 | -16 | -107 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\services\groupJoinRequest.service.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cservices%5CgroupJoinRequest.service.ts) | TypeScript | -86 | -5 | -14 | -105 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\services\user.service.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cservices%5Cuser.service.ts) | TypeScript | -126 | 0 | -19 | -145 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\tests\ApiTest.http](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ctests%5CApiTest.http) | HTTP | -6 | -1 | -1 | -8 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\types\api.types.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ctypes%5Capi.types.ts) | TypeScript | -12 | 0 | -3 | -15 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\types\auth.types.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ctypes%5Cauth.types.ts) | TypeScript | -11 | 0 | -2 | -13 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\types\group.types.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ctypes%5Cgroup.types.ts) | TypeScript | -21 | 0 | -6 | -27 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\types\post.types.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ctypes%5Cpost.types.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\types\user.types.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Ctypes%5Cuser.types.ts) | TypeScript | -24 | 0 | -6 | -30 |
| [c:\Serious Project\chc\chc-backend\identity-service\group-backend-project\src\validations\util.validation.ts](/c:%5CSerious%20Project%5Cchc%5Cchc-backend%5Cidentity-service%5Cgroup-backend-project%5Csrc%5Cvalidations%5Cutil.validation.ts) | TypeScript | 0 | 0 | -1 | -1 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details