import { type Express } from 'express';
import { Passport } from 'passport';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { type AppContext } from './app-context';
import { env } from './env';

export const applyPassportToExpressApp = (expressApp: Express, appContext: AppContext): void => {
  const passport = new Passport();

  passport.use(
    new JWTStrategy(
      {
        secretOrKey: env.JWT_SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      (jwtPayload: string, done) => {
        appContext.prisma.user
          .findUnique({
            where: { id: jwtPayload },
          })
          .then((user) => {
            if (!user) {
              done(null, false);
              return;
            }
            done(null, user);
          })
          .catch((error) => {
            done(error, false);
          });
      },
    ),
  );

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      next();
      return;
    }
    passport.authenticate('jwt', { session: false }, (...args: any[]) => {
      req.user = args[1] || undefined;
      next();
    })(req, res, next);
  });
};
