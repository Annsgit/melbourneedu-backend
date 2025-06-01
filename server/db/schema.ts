import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

// Badge Types (used elsewhere)
export const BADGE_TYPES = [
  "SchoolExplorer",
  "ReviewMaster",
  "EventAttendee",
  "QuizChampion",
  "SuburbNavigator",
  "ComparisonGuru",
] as const;
export type BadgeType = (typeof BADGE_TYPES)[number];

// Exploration Badges Table
export const explorationBadges = pgTable("exploration_badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  badgeType: text("badge_type").notNull(), // From BADGE_TYPES
  level: integer("level").notNull().default(1), // 1, 2, 3, etc.
  requirements: jsonb("requirements")
    .$type<{
      challengesCompleted?: number;
      schoolsViewed?: number;
      reviewsWritten?: number;
      eventsAttended?: number;
      quizzesPassed?: number;
      suburbsExplored?: number;
      comparisonsPerformed?: number;
      minimumPoints?: number;
    }>()
    .notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
