/**
 * @swagger
 *
 * components:
 *   schemas:
 *     # FIXME: 'allOf' not supported yet
 *     # Pet:
 *     #   allOf:
 *     #     - $ref: '#/components/schemas/NewPet'
 *     #     - type: object
 *     #       required:
 *     #       - id
 *     #       properties:
 *     #         id:
 *     #           type: integer
 *     #           format: int64
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *           type: string
 *         tag:
 *           type: string
 *
 *     NewPet:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         tag:
 *           type: string
 *
 *     Error:
 *       type: object
 *       required:
 *         - code
 *         - message
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *         message:
 *           type: string
 */
