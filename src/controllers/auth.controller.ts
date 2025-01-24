import { NextFunction, Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { ParamsDictionary } from "express-serve-static-core";
import { UserDocument, UserModel } from "../models/user.model";
import {
  RefreshResponse,
  RefreshTokenBody,
  Tokens,
  UserCredentials,
} from "../types/auth.types";
import { ObjectId } from "mongoose";
import { User, UserPayload } from "../types/user.types";

export const register: RequestHandler<
  ParamsDictionary,
  User | unknown,
  UserPayload
> = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      pictureId: req.body.pictureId,
    });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const generateTokens = (userId: string): Tokens | null => {
  if (!process.env.TOKEN_SECRET) {
    return null;
  }

  // generate token
  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES as SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES as SignOptions["expiresIn"] }
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("wrong username or password");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).send("wrong username or password");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }

    // generate token
    const tokens = generateTokens(user._id.toString());

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    user.refreshTokens?.push(tokens.refreshToken);
    await user.save();

    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const verifyRefreshToken = async (refreshToken: string | undefined) => {
  if (!refreshToken) {
    throw new Error("Invalid Refresh Token");
  }
  if (!process.env.TOKEN_SECRET) {
    throw new Error("Server Error");
  }

  let user: UserDocument | null = null;

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET
    ) as Payload;
    user = await UserModel.findById(payload._id);

    if (!user) {
      return null;
    }

    if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
      user.refreshTokens = [];
      await user.save();
      return null;
    }

    // update user refresh tokens array to be the same as before except the current refresh token
    user.refreshTokens = user.refreshTokens?.filter(
      (token) => token !== refreshToken
    );
  } catch (err) {
    return null;
  }

  return user;
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("Invalid refresh token");
      return;
    }
    await user.save();
    res.status(200).send("Logged out successfully");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const refresh: RequestHandler<
  ParamsDictionary,
  RefreshResponse | string,
  RefreshTokenBody
> = async (req, res) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("Invalid refresh token");
      return;
    }

    const tokens = generateTokens(user._id);

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

type Payload = {
  _id: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("authorization");

  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET) as Payload;
    req.params.userId = payload._id;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};
