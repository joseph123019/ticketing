import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestError } from '@jemtickets/common';
import { User } from '@models/user';
import { PasswordManager } from '@services/password-manager';

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });

  if (!!findUser) {
    const valid = await PasswordManager.compare(findUser.password, password);
    if (valid) {
      // Gemerate JWT
      const userJwt = jwt.sign(
        {
          id: findUser.id,
          email: findUser.email,
        },
        process.env.JWT_KEY!
      );

      // store in session
      req.session = {
        jwt: userJwt,
      };

      return res.status(200).send(findUser);
    }
  }

  next(new RequestError('Password do not match'));
};

export default {
  signin,
};
