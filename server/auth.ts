import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { promisify } from 'util';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import rateLimit from 'express-rate-limit';

const scryptAsync = promisify(scrypt);

// Define rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

interface ReplAuthHeaders {
  'x-replit-user-id': string;
  'x-replit-user-name': string;
  'x-replit-user-roles': string;
}

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}



async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "melbourne-schools-guide-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true, // Helps prevent XSS attacks
      sameSite: "strict", // Helps prevent CSRF attacks
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Helper function for development headers
  function getDevHeader(header: string, fallback: string): string | undefined {
    return (process.env.NODE_ENV !== 'production') ? fallback : undefined;
  }

  // Replit auth middleware - must be after session and passport initialization
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    const isDev = process.env.NODE_ENV !== "production";
    
    const userId = req.headers['x-replit-user-id'] || getDevHeader('x-replit-user-id', 'dev-user-id');
    const username = req.headers['x-replit-user-name'] || getDevHeader('x-replit-user-name', 'dev-user');

    console.log("Auth Headers:", {
      userId,
      username,
      isDev
    });

    if (!userId || !username) {
      console.log("No auth headers and not in dev mode, skipping auth");
      return next();
    }

    try {
      // First try to find by replId
      let user = await storage.getUserByReplId(userId as string);
      
      // If not found by replId, check by username
      if (!user) {
        user = await storage.getUserByUsername(username as string);
      }

      // Only create if user doesn't exist by either identifier
      if (!user) {
        user = await storage.createUser({
          replId: userId as string,
          username: username as string,
          authProvider: 'replit',
          password: null, // Replit users don't need passwords
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        console.log("User logged in:", user);
        next();
      });
    } catch (error) {
      next(error);
    }
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  // Serialize just stores the user ID in the session
  passport.serializeUser((user: Express.User, done) => {
    try {
      done(null, user.id);
    } catch (error) {
      done(error);
    }
  });

  // Deserialize retrieves the full user object using the ID
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error('User not found in database'));
      }
      // Return safe user object without sensitive data
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        createdAt: user.createdAt
      };
      done(null, safeUser);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", authLimiter, async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Also check if email is already registered
      if (req.body.email) {
        const existingEmail = await storage.getUserByEmail(req.body.email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", authLimiter, passport.authenticate("local"), (req, res) => {
    // Update last login timestamp could be added here if needed
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("Authenticated?", req.isAuthenticated());
    console.log("Session:", req.session);
    console.log("User:", req.user);

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const safeUser = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      subscriptionTier: req.user.subscriptionTier
    };
    res.json(safeUser);
  });
}