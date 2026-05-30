import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID:     ENV.GOOGLE_CLIENT_ID,
            clientSecret: ENV.GOOGLE_CLIENT_SECRET,
            callbackURL:  ENV.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                // 1. Already linked via Google OAuth
                const oauthUser = await User.findOne({ provider: "google", providerId: profile.id });
                if (oauthUser) return done(null, { _id: oauthUser._id });

                // 2. Email already exists (registered normally) — link Google to it
                let user = await User.findOne({ email });
                if (user) {
                    if (!user.providerId) {
                        user.provider        = "google";
                        user.providerId      = profile.id;
                        user.isEmailVerified = true;
                        if (!user.profilePicture && profile.photos?.[0]?.value) {
                            user.profilePicture = profile.photos[0].value;
                        }
                        await user.save();
                    }
                    return done(null, { _id: user._id });
                }

                // 3. New user — create account
                const displayName = profile.displayName || "";
                const parts       = displayName.split(" ");
                const fname       = parts[0] || "Google";
                const lname       = parts.slice(1).join(" ") || "User";

                const newUser = await User.create({
                    fname,
                    lname,
                    email,
                    password:        null,
                    provider:        "google",
                    providerId:      profile.id,
                    profilePicture:  profile.photos?.[0]?.value || null,
                    isEmailVerified: true,
                });

                return done(null, { _id: newUser._id });

            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
