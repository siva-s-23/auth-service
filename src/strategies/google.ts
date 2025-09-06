import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GoogleProfile } from "../types/user";
import { prisma } from "../prisma";

export const upsertGoogleUser = async (profile: GoogleProfile) => {
  if (!profile.id || !profile.emails?.[0]?.value) {
    throw new Error("Google profile must have id and email");
  }

  return prisma.users.upsert({
    where: { google_id: profile.id },
    update: {
      email: profile.emails?.[0]?.value ?? null,
      first_name: profile.name?.givenName ?? null,
      last_name: profile.name?.familyName ?? null,
      picture: profile.photos?.[0]?.value ?? null,
      last_login_at: new Date(),
    },
    create: {
      google_id: profile.id,
      email: profile.emails?.[0]?.value ?? "",
      first_name: profile.name?.givenName ?? null,
      last_name: profile.name?.familyName ?? null,
      picture: profile.photos?.[0]?.value ?? null,
    },
  });
};

export const setupGoogleStrategy = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    throw new Error("Google OAuth credentials are missing in .env");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID!,
        clientSecret: clientSecret!,
        callbackURL: "/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertGoogleUser(profile);
          return done(null, user);
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );
};
