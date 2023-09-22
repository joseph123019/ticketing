import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestError } from '@jemtickets/common';
import { User } from '@models/user';

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    next(new RequestError('Email is in use'));
  } else {
    const user = User.build({
      email,
      password,
    });

    await user.save();

    // Gemerate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store in session
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
};

export default {
  signup,
};
