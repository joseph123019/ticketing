import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import signupController from '@controllers/signup';
import { validateRequest } from '@jemtickets/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must atleast 8 characters max 20 characters'),
  ],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    signupController.signup(req, res, next);
  }
);

export { router as signUpRouter };
