import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            jwtFromRequest: (req) => {
                return req.headers['refreshtoken'] as string;
            },
            secretOrKey: process.env.JWT_SECRET_REFRESH,
        });
    }

    validate(payload) {
        return {
            phoneNumber: payload.sub,
        };
    }
}
