import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

export const configureGoogleAuth = () => {

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/users/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const { id, emails, name, photos } = profile;
      const email = emails[0].value;
      
      // Check if user exists by Google ID
      let user = await User.findOne({ googleId: id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists by email (for linking accounts)
      user = await User.findOne({ email });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = id;
        user.avatar = photos[0]?.value;
        await user.save();
        return done(null, user);
      }
      
      // Create new user with Google account
      const newUser = await User.create({
        name: name.givenName + ' ' + name.familyName,
        email,
        googleId: id,
        avatar: photos[0]?.value
      });
      
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passport;
