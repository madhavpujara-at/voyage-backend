/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (at least 8 characters, must include uppercase, lowercase, number, and special character).
 *           example: "Password123!"
 *         name:
 *           type: string
 *           description: User's full name.
 *           example: "John Doe"
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (at least 8 characters, must include uppercase, lowercase, number, and special character).
 *           example: "Password123!"
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User's unique identifier.
 *         name:
 *           type: string
 *           description: User's full name.
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *         role:
 *           type: string
 *           enum: [TECH_LEAD]
 *           description: User's role.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last user update.
 *     LoginUserOutput:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User's unique identifier.
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address.
 *         role:
 *           type: string
 *           enum: [TEAM_MEMBER, TECH_LEAD, ADMIN]
 *           description: User's role.
 *     LoginSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT access token for the authenticated user.
 *             user:
 *               $ref: '#/components/schemas/LoginUserOutput'
 *     KudoCardResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the kudo card.
 *         message:
 *           type: string
 *           description: The message content of the kudo card.
 *         recipientName:
 *           type: string
 *           description: Name of the person receiving the kudo.
 *         giverId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who gave the kudo.
 *         giverEmail:
 *           type: string
 *           format: email
 *           description: Email of the user who gave the kudo.
 *         giverName:
 *           type: string
 *           description: Name of the user who gave the kudo.
 *         teamId:
 *           type: string
 *           format: uuid
 *           description: ID of the team associated with the kudo.
 *         teamName:
 *           type: string
 *           description: Name of the team associated with the kudo.
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: ID of the category for this kudo.
 *         categoryName:
 *           type: string
 *           description: Name of the category for this kudo.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the kudo card was created.
 *     CreateKudoCardInput:
 *       type: object
 *       required:
 *         - recipientName
 *         - teamId
 *         - categoryId
 *         - message
 *       properties:
 *         recipientName:
 *           type: string
 *           description: Name of the person receiving the kudo.
 *         teamId:
 *           type: string
 *           format: uuid
 *           description: ID of the team associated with the kudo.
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: ID of the category for this kudo.
 *         message:
 *           type: string
 *           description: The message content of the kudo card.
 *     BaseErrorResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *       properties:
 *         status:
 *           type: string
 *           enum: [error]
 *           description: Indicates that an error occurred.
 *           example: error
 *         message:
 *           type: string
 *           description: A human-readable error message.
 *           example: "Resource not found"
 *         stack:
 *           type: string
 *           description: The error stack trace (usually present in development environments only).
 *     UpdateUserRoleInput:
 *       type: object
 *       required:
 *         - newRole
 *       properties:
 *         newRole:
 *           type: string
 *           enum: [TECH_LEAD]
 *           description: The new role to assign to the user.
 *           example: TECH_LEAD
 *     ValidationErrorDetail:
 *       type: object
 *       properties:
 *         validation:
 *           type: string
 *           description: The type of validation that failed (e.g., regex, required).
 *           example: "regex"
 *         code:
 *           type: string
 *           description: Zod error code (e.g., invalid_type, too_small, invalid_string).
 *           example: "invalid_string"
 *         path:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - type: integer
 *           description: The path to the field that failed validation.
 *           example: ["password"]
 *         message:
 *           type: string
 *           description: Detailed error message for this specific validation issue.
 *           example: "Password must include uppercase, lowercase, number, and special character"
 *     ValidationErrorResponse:
 *       type: object
 *       required:
 *         - status
 *         - message
 *         - errors
 *       properties:
 *         status:
 *           type: string
 *           enum: [error]
 *           example: error
 *         message:
 *           type: string
 *           description: A summary message for validation failure.
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationErrorDetail'
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
