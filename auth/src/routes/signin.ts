import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@jemtickets/common';
import signinController from '@controllers/signin';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password is empty'),
  ],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    signinController.signin(req, res, next);
  }
);

export { router as signInRouter };
