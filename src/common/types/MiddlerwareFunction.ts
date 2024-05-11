import type { NextFunction } from 'express'

export type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void | Promise<void>