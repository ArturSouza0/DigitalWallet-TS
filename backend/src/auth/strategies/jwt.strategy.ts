import { Injectable } from "@nestjs/common";
import { UserPayload } from "../models/UserPayload";
import { UserFromJwt } from "../models/UserFromJwt";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor() {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
}

async validate(payload: UserPayload): Promise<UserFromJwt> {
    return {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      };
    }
  }