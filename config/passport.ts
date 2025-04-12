import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import logger from "../logger";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!, // Ensure these are loaded correctly
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user;
      try {
        user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            picture: profile.photos?.[0].value,
            loginMethod: "GOOGLE",
            role: "USER",
            credits: 5,
          });
        }
        return done(null, user); // Success, return the user
      } catch (error) {
        logger?.error("Error during Google OAuth: ", error);
        return done(error, undefined); 
      }
    }
  )
);
