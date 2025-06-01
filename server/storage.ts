import { schools, type School, type InsertSchool, users, type User, type InsertUser, 
         suburbs, type Suburb, type InsertSuburb, subscriptions, type Subscription, type InsertSubscription,
         reviews, type Review, type InsertReview, events, type Event, type InsertEvent,
         notificationPreferences, type NotificationPreference, type InsertNotificationPreference,
         pushSubscriptions, type PushSubscription, type InsertPushSubscription,
         explorationChallenges, type ExplorationChallenge, type InsertExplorationChallenge,
         userChallengeProgress, type UserChallengeProgress, type InsertUserChallengeProgress,
         explorationBadges, type ExplorationBadge, type InsertExplorationBadge,
         userBadges, type UserBadge, type InsertUserBadge,
         type ChallengeType, type DifficultyLevel, type BadgeType, type ProgressStatus,
         schoolLanguages, type SchoolLanguage, type InsertSchoolLanguage,
         schoolFacilities, type SchoolFacility, type InsertSchoolFacility,
         enrichmentPrograms, type EnrichmentProgram, type InsertEnrichmentProgram } from "@shared/schema";
import crypto from "crypto";
import { db } from "./db";
import { eq, ilike, or, and, desc, asc, sql, gte, lte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Initialize PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Storage interface
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  // School methods
  getAllSchools(): Promise<School[]>;
  getFeaturedSchools(): Promise<School[]>;
  getSchoolById(id: number): Promise<School | undefined>;
  getSchoolsByType(type: string): Promise<School[]>;
  getSchoolsByEducationLevel(level: string): Promise<School[]>;
  getSchoolsBySuburb(suburb: string): Promise<School[]>;
  searchSchools(query: string): Promise<School[]>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: number, school: Partial<InsertSchool>): Promise<School | undefined>;
  deleteSchool(id: number): Promise<boolean>;
  
  // School Enrichment Data
  getSchoolLanguages(schoolId: number): Promise<SchoolLanguage[]>;
  getSchoolFacilities(schoolId: number): Promise<SchoolFacility[]>;
  getEnrichmentPrograms(schoolId: number): Promise<EnrichmentProgram[]>;
  getFullSchoolProfile(schoolId: number): Promise<{
    school: School;
    languages: SchoolLanguage[];
    facilities: SchoolFacility[];
    programs: EnrichmentProgram[];
  } | undefined>;
  
  // User methods
  getAllUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  updateSubscriptionInfo(userId: number, data: { stripeCustomerId: string, stripeSubscriptionId: string, subscriptionTier: string, subscriptionStatus: string }): Promise<User | undefined>;
  
  // Suburb methods
  getAllSuburbs(): Promise<Suburb[]>;
  getSuburbById(id: number): Promise<Suburb | undefined>;
  getSuburbByName(name: string): Promise<Suburb | undefined>;
  getSuburbsByPostcode(postcode: string): Promise<Suburb[]>;
  searchSuburbs(query: string): Promise<Suburb[]>;
  createSuburb(suburb: InsertSuburb): Promise<Suburb>;
  updateSuburb(id: number, suburb: Partial<InsertSuburb>): Promise<Suburb | undefined>;
  deleteSuburb(id: number): Promise<boolean>;
  
  // Subscription methods
  getAllSubscriptions(): Promise<Subscription[]>;
  getSubscriptionById(id: number): Promise<Subscription | undefined>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;
  getSubscriptionByToken(token: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  confirmSubscription(token: string): Promise<Subscription | undefined>;
  deleteSubscription(id: number): Promise<boolean>;
  unsubscribeByEmail(email: string): Promise<boolean>;
  
  // Review methods
  getReviewsBySchoolId(schoolId: number, userSubscriptionTier?: string): Promise<Review[]>;
  getReviewById(id: number): Promise<Review | undefined>;
  getUserReviews(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  getSchoolAverageRating(schoolId: number): Promise<number | null>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsBySchoolId(schoolId: number, userSubscriptionTier?: string): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Notification Preferences methods
  getUserNotificationPreferences(userId: number): Promise<NotificationPreference[]>;
  getNotificationPreferenceByUserAndSchool(userId: number, schoolId: number): Promise<NotificationPreference | undefined>;
  createNotificationPreference(preference: InsertNotificationPreference): Promise<NotificationPreference>;
  updateNotificationPreference(id: number, preference: Partial<InsertNotificationPreference>): Promise<NotificationPreference | undefined>;
  deleteNotificationPreference(id: number): Promise<boolean>;
  
  // Push Subscription methods
  getUserPushSubscriptions(userId: number): Promise<PushSubscription[]>;
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  deletePushSubscription(id: number): Promise<boolean>;
  deletePushSubscriptionByEndpoint(userId: number, endpoint: string): Promise<boolean>;
  
  // Exploration Challenge methods
  getAllExplorationChallenges(includeInactive?: boolean): Promise<ExplorationChallenge[]>;
  getExplorationChallengeById(id: number): Promise<ExplorationChallenge | undefined>;
  getChallengesByType(type: ChallengeType): Promise<ExplorationChallenge[]>;
  getChallengesByDifficulty(difficulty: DifficultyLevel): Promise<ExplorationChallenge[]>;
  getActiveChallenges(userSubscriptionTier?: string): Promise<ExplorationChallenge[]>;
  createExplorationChallenge(challenge: InsertExplorationChallenge): Promise<ExplorationChallenge>;
  updateExplorationChallenge(id: number, challenge: Partial<InsertExplorationChallenge>): Promise<ExplorationChallenge | undefined>;
  deleteExplorationChallenge(id: number): Promise<boolean>;
  
  // User Challenge Progress methods
  getUserChallengeProgress(userId: number): Promise<UserChallengeProgress[]>;
  getUserChallengeProgressWithDetails(userId: number): Promise<(UserChallengeProgress & { challenge: ExplorationChallenge })[]>;
  getChallengeProgressById(id: number): Promise<UserChallengeProgress | undefined>;
  getChallengeProgressByUserAndChallenge(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined>;
  createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress>;
  updateUserChallengeProgress(id: number, progress: Partial<UserChallengeProgress>): Promise<UserChallengeProgress | undefined>;
  completeChallenge(userId: number, challengeId: number, pointsEarned: number): Promise<UserChallengeProgress | undefined>;
  
  // Badge methods
  getAllBadges(): Promise<ExplorationBadge[]>;
  getBadgeById(id: number): Promise<ExplorationBadge | undefined>;
  getBadgesByType(type: BadgeType): Promise<ExplorationBadge[]>;
  createBadge(badge: InsertExplorationBadge): Promise<ExplorationBadge>;
  updateBadge(id: number, badge: Partial<InsertExplorationBadge>): Promise<ExplorationBadge | undefined>;
  deleteBadge(id: number): Promise<boolean>;
  
  // User Badge methods
  getUserBadges(userId: number): Promise<(UserBadge & { badge: ExplorationBadge })[]>;
  awardBadgeToUser(userId: number, badgeId: number): Promise<UserBadge | undefined>;
  checkAndAwardBadges(userId: number): Promise<UserBadge[]>;
  
  // User Points methods
  getUserPoints(userId: number): Promise<number>;
  addPointsToUser(userId: number, points: number): Promise<number>;
}

// Database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'user_sessions'
    })
  }
  // School methods
  async getAllSchools(): Promise<School[]> {
    return await db.select().from(schools).orderBy(asc(schools.name));
  }

  async getFeaturedSchools(): Promise<School[]> {
    return await db.select().from(schools)
      .where(eq(schools.featured, true))
      .orderBy(asc(schools.name));
  }

  async getSchoolById(id: number): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school || undefined;
  }

  async getSchoolsByType(type: string): Promise<School[]> {
    return await db.select().from(schools)
      .where(eq(schools.type, type))
      .orderBy(asc(schools.name));
  }

  async getSchoolsByEducationLevel(level: string): Promise<School[]> {
    return await db.select().from(schools)
      .where(eq(schools.educationLevel, level))
      .orderBy(asc(schools.name));
  }

  async getSchoolsBySuburb(suburb: string): Promise<School[]> {
    return await db.select().from(schools)
      .where(ilike(schools.suburb, `%${suburb}%`))
      .orderBy(asc(schools.name));
  }

  async searchSchools(query: string): Promise<School[]> {
    return await db.select().from(schools)
      .where(
        or(
          ilike(schools.name, `%${query}%`),
          ilike(schools.suburb, `%${query}%`),
          ilike(schools.postcode, `%${query}%`)
        )
      )
      .orderBy(asc(schools.name));
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const [school] = await db.insert(schools).values([insertSchool]).returning();
    return school;
  }

  async updateSchool(id: number, updatedSchool: Partial<InsertSchool>): Promise<School | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {};
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(updatedSchool)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [school] = await db
      .update(schools)
      .set(updateData)
      .where(eq(schools.id, id))
      .returning();
    
    return school || undefined;
  }

  async deleteSchool(id: number): Promise<boolean> {
    try {
      await db.delete(schools).where(eq(schools.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting school:", error);
      return false;
    }
  }
  
  // School Enrichment Data Methods
  async getSchoolLanguages(schoolId: number): Promise<SchoolLanguage[]> {
    return await db
      .select()
      .from(schoolLanguages)
      .where(eq(schoolLanguages.schoolId, schoolId))
      .orderBy(asc(schoolLanguages.language));
  }
  
  async getSchoolFacilities(schoolId: number): Promise<SchoolFacility[]> {
    return await db
      .select()
      .from(schoolFacilities)
      .where(eq(schoolFacilities.schoolId, schoolId))
      .orderBy(asc(schoolFacilities.name));
  }
  
  async getEnrichmentPrograms(schoolId: number): Promise<EnrichmentProgram[]> {
    return await db
      .select()
      .from(enrichmentPrograms)
      .where(eq(enrichmentPrograms.schoolId, schoolId))
      .orderBy(asc(enrichmentPrograms.name));
  }
  
  async getFullSchoolProfile(schoolId: number): Promise<{
    school: School;
    languages: SchoolLanguage[];
    facilities: SchoolFacility[];
    programs: EnrichmentProgram[];
  } | undefined> {
    const school = await this.getSchoolById(schoolId);
    
    if (!school) {
      return undefined;
    }
    
    // Fetch all related data in parallel for better performance
    const [languages, facilities, programs] = await Promise.all([
      this.getSchoolLanguages(schoolId),
      this.getSchoolFacilities(schoolId),
      this.getEnrichmentPrograms(schoolId)
    ]);
    
    return {
      school,
      languages,
      facilities,
      programs
    };
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByReplId(replId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, replId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userWithTimestamps = {
      ...insertUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const [user] = await db.insert(users).values([userWithTimestamps]).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    
    return user || undefined;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning();
      
    return user || undefined;
  }
  
  async updateSubscriptionInfo(
    userId: number, 
    data: { 
      stripeCustomerId: string, 
      stripeSubscriptionId: string, 
      subscriptionTier: string, 
      subscriptionStatus: string 
    }
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        subscriptionTier: data.subscriptionTier,
        subscriptionStatus: data.subscriptionStatus,
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId))
      .returning();
      
    return user || undefined;
  }
  
  // Suburb methods
  async getAllSuburbs(): Promise<Suburb[]> {
    return await db.select().from(suburbs).orderBy(asc(suburbs.name));
  }

  async getSuburbById(id: number): Promise<Suburb | undefined> {
    const [suburb] = await db.select().from(suburbs).where(eq(suburbs.id, id));
    return suburb || undefined;
  }

  async getSuburbByName(name: string): Promise<Suburb | undefined> {
    const [suburb] = await db.select().from(suburbs).where(eq(suburbs.name, name));
    return suburb || undefined;
  }

  async getSuburbsByPostcode(postcode: string): Promise<Suburb[]> {
    return await db.select().from(suburbs).where(eq(suburbs.postcode, postcode));
  }

  async searchSuburbs(query: string): Promise<Suburb[]> {
    return await db.select().from(suburbs).where(
      or(
        ilike(suburbs.name, `%${query}%`),
        ilike(suburbs.postcode, `%${query}%`)
      )
    ).orderBy(asc(suburbs.name));
  }

  async createSuburb(insertSuburb: InsertSuburb): Promise<Suburb> {
    const [suburb] = await db.insert(suburbs).values([insertSuburb]).returning();
    return suburb;
  }

  async updateSuburb(id: number, updatedSuburb: Partial<InsertSuburb>): Promise<Suburb | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {};
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(updatedSuburb)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [suburb] = await db
      .update(suburbs)
      .set(updateData)
      .where(eq(suburbs.id, id))
      .returning();
    
    return suburb || undefined;
  }

  async deleteSuburb(id: number): Promise<boolean> {
    try {
      await db.delete(suburbs).where(eq(suburbs.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting suburb:", error);
      return false;
    }
  }
  
  // Subscription methods
  async getAllSubscriptions(): Promise<Subscription[]> {
    return await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.email, email));
    return subscription || undefined;
  }

  async getSubscriptionByToken(token: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.confirmationToken, token));
    return subscription || undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    // Generate a confirmation token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Add the token to the subscription data
    const subscriptionWithToken = {
      ...insertSubscription,
      confirmationToken: token,
      isConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const [subscription] = await db.insert(subscriptions).values([subscriptionWithToken]).returning();
    return subscription;
  }

  async updateSubscription(id: number, updatedSubscription: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(updatedSubscription)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [subscription] = await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning();
    
    return subscription || undefined;
  }

  async confirmSubscription(token: string): Promise<Subscription | undefined> {
    // Find the subscription with the token
    const subscription = await this.getSubscriptionByToken(token);
    
    if (!subscription) {
      return undefined;
    }
    
    // Update the subscription to confirmed status
    const [confirmedSubscription] = await db
      .update(subscriptions)
      .set({ 
        isConfirmed: true,
        confirmationToken: null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(subscriptions.id, subscription.id))
      .returning();
    
    return confirmedSubscription || undefined;
  }

  async deleteSubscription(id: number): Promise<boolean> {
    try {
      await db.delete(subscriptions).where(eq(subscriptions.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting subscription:", error);
      return false;
    }
  }

  async unsubscribeByEmail(email: string): Promise<boolean> {
    try {
      await db.delete(subscriptions).where(eq(subscriptions.email, email));
      return true;
    } catch (error) {
      console.error("Error unsubscribing email:", error);
      return false;
    }
  }
  
  // Review methods
  async getReviewsBySchoolId(schoolId: number, userSubscriptionTier?: string): Promise<Review[]> {
    // Create conditions for the query
    let conditions = and(
      eq(reviews.schoolId, schoolId),
      eq(reviews.isPublic, true)
    );
      
    // If user is not premium, filter out premium-only reviews
    if (userSubscriptionTier !== 'premium') {
      conditions = and(
        conditions,
        eq(reviews.isPremiumOnly, false)
      );
    }
    
    // Get reviews sorted by newest first
    return await db.select()
      .from(reviews)
      .where(conditions)
      .orderBy(desc(reviews.createdAt));
  }
  
  async getReviewById(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviewWithTimestamps = {
      ...insertReview,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const [review] = await db.insert(reviews).values([reviewWithTimestamps]).returning();
    return review;
  }
  
  async updateReview(id: number, updatedReview: Partial<InsertReview>): Promise<Review | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(updatedReview)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [review] = await db
      .update(reviews)
      .set(updateData)
      .where(eq(reviews.id, id))
      .returning();
    
    return review || undefined;
  }
  
  async deleteReview(id: number): Promise<boolean> {
    try {
      await db.delete(reviews).where(eq(reviews.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  }
  
  async getSchoolAverageRating(schoolId: number): Promise<number | null> {
    const result = await db.select({
      avgRating: sql`AVG(${reviews.rating})::numeric(10,1)`
    })
    .from(reviews)
    .where(
      and(
        eq(reviews.schoolId, schoolId),
        eq(reviews.isPublic, true)
      )
    );
    
    if (result.length === 0 || result[0].avgRating === null) {
      return null;
    }
    
    return Number(result[0].avgRating);
  }

  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.startDate));
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getEventsBySchoolId(schoolId: number, userSubscriptionTier?: string): Promise<Event[]> {
    // Base query
    let query = db.select().from(events)
      .where(eq(events.schoolId, schoolId))
      .orderBy(desc(events.startDate));

    // If subscription tier is not premium, filter out premium-only events
    if (userSubscriptionTier !== "premium") {
      query = query.where(eq(events.isPremiumOnly, false));
    }

    return await query;
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const now = new Date();
    
    return await db.select()
      .from(events)
      .where(and(
        gte(events.startDate, now),
        eq(events.isPublic, true)
      ))
      .orderBy(asc(events.startDate))
      .limit(limit);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const eventWithTimestamps = {
      ...insertEvent,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [event] = await db.insert(events).values([eventWithTimestamps]).returning();
    return event;
  }

  async updateEvent(id: number, updatedEvent: Partial<InsertEvent>): Promise<Event | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(updatedEvent)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [event] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();
    
    return event || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    try {
      await db.delete(events).where(eq(events.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  }

  // Notification Preferences methods
  async getUserNotificationPreferences(userId: number): Promise<NotificationPreference[]> {
    return await db.select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));
  }

  async getNotificationPreferenceByUserAndSchool(userId: number, schoolId: number): Promise<NotificationPreference | undefined> {
    const [preference] = await db.select()
      .from(notificationPreferences)
      .where(and(
        eq(notificationPreferences.userId, userId),
        eq(notificationPreferences.schoolId, schoolId)
      ));
    
    return preference || undefined;
  }

  async createNotificationPreference(insertPreference: InsertNotificationPreference): Promise<NotificationPreference> {
    const preferenceWithTimestamps = {
      ...insertPreference,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [preference] = await db.insert(notificationPreferences)
      .values([preferenceWithTimestamps])
      .returning();
    
    return preference;
  }

  async updateNotificationPreference(id: number, updatedPreference: Partial<InsertNotificationPreference>): Promise<NotificationPreference | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(updatedPreference)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [preference] = await db
      .update(notificationPreferences)
      .set(updateData)
      .where(eq(notificationPreferences.id, id))
      .returning();
    
    return preference || undefined;
  }

  async deleteNotificationPreference(id: number): Promise<boolean> {
    try {
      await db.delete(notificationPreferences).where(eq(notificationPreferences.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting notification preference:", error);
      return false;
    }
  }

  // Push Subscription methods
  async getUserPushSubscriptions(userId: number): Promise<PushSubscription[]> {
    return await db.select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));
  }

  async createPushSubscription(insertSubscription: InsertPushSubscription): Promise<PushSubscription> {
    const subscriptionWithTimestamp = {
      ...insertSubscription,
      createdAt: new Date()
    };
    
    const [subscription] = await db.insert(pushSubscriptions)
      .values([subscriptionWithTimestamp])
      .returning();
    
    return subscription;
  }

  async deletePushSubscription(id: number): Promise<boolean> {
    try {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting push subscription:", error);
      return false;
    }
  }

  async deletePushSubscriptionByEndpoint(userId: number, endpoint: string): Promise<boolean> {
    try {
      await db.delete(pushSubscriptions)
        .where(and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.endpoint, endpoint)
        ));
      return true;
    } catch (error) {
      console.error("Error deleting push subscription by endpoint:", error);
      return false;
    }
  }
  
  // Exploration Challenge methods
  async getAllExplorationChallenges(includeInactive: boolean = false): Promise<ExplorationChallenge[]> {
    if (includeInactive) {
      return await db.select().from(explorationChallenges).orderBy(asc(explorationChallenges.title));
    } else {
      return await db.select().from(explorationChallenges)
        .where(eq(explorationChallenges.isActive, true))
        .orderBy(asc(explorationChallenges.title));
    }
  }

  async getExplorationChallengeById(id: number): Promise<ExplorationChallenge | undefined> {
    const [challenge] = await db.select().from(explorationChallenges).where(eq(explorationChallenges.id, id));
    return challenge || undefined;
  }

  async getChallengesByType(type: ChallengeType): Promise<ExplorationChallenge[]> {
    return await db.select().from(explorationChallenges)
      .where(and(
        eq(explorationChallenges.challengeType, type),
        eq(explorationChallenges.isActive, true)
      ))
      .orderBy(asc(explorationChallenges.title));
  }

  async getChallengesByDifficulty(difficulty: DifficultyLevel): Promise<ExplorationChallenge[]> {
    return await db.select().from(explorationChallenges)
      .where(and(
        eq(explorationChallenges.difficulty, difficulty),
        eq(explorationChallenges.isActive, true)
      ))
      .orderBy(asc(explorationChallenges.title));
  }

  async getActiveChallenges(userSubscriptionTier: string = 'free'): Promise<ExplorationChallenge[]> {
    if (userSubscriptionTier === 'premium') {
      // Premium users can see all active challenges
      return await db.select().from(explorationChallenges)
        .where(eq(explorationChallenges.isActive, true))
        .orderBy(asc(explorationChallenges.title));
    } else {
      // Free users only see non-premium challenges
      return await db.select().from(explorationChallenges)
        .where(and(
          eq(explorationChallenges.isActive, true),
          eq(explorationChallenges.isPremiumOnly, false)
        ))
        .orderBy(asc(explorationChallenges.title));
    }
  }

  async createExplorationChallenge(challenge: InsertExplorationChallenge): Promise<ExplorationChallenge> {
    const [newChallenge] = await db.insert(explorationChallenges).values(challenge).returning();
    return newChallenge;
  }

  async updateExplorationChallenge(id: number, challenge: Partial<InsertExplorationChallenge>): Promise<ExplorationChallenge | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {};
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(challenge)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [updatedChallenge] = await db
      .update(explorationChallenges)
      .set(updateData)
      .where(eq(explorationChallenges.id, id))
      .returning();
    
    return updatedChallenge || undefined;
  }

  async deleteExplorationChallenge(id: number): Promise<boolean> {
    try {
      await db.delete(explorationChallenges).where(eq(explorationChallenges.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting exploration challenge:", error);
      return false;
    }
  }

  // User Challenge Progress methods
  async getUserChallengeProgress(userId: number): Promise<UserChallengeProgress[]> {
    return await db.select().from(userChallengeProgress)
      .where(eq(userChallengeProgress.userId, userId))
      .orderBy(desc(userChallengeProgress.updatedAt));
  }

  async getUserChallengeProgressWithDetails(userId: number): Promise<(UserChallengeProgress & { challenge: ExplorationChallenge })[]> {
    const progress = await db.select({
      progress: userChallengeProgress,
      challenge: explorationChallenges
    })
    .from(userChallengeProgress)
    .innerJoin(
      explorationChallenges,
      eq(userChallengeProgress.challengeId, explorationChallenges.id)
    )
    .where(eq(userChallengeProgress.userId, userId))
    .orderBy(desc(userChallengeProgress.updatedAt));
    
    return progress.map(item => ({
      ...item.progress,
      challenge: item.challenge
    }));
  }

  async getChallengeProgressById(id: number): Promise<UserChallengeProgress | undefined> {
    const [progress] = await db.select().from(userChallengeProgress).where(eq(userChallengeProgress.id, id));
    return progress || undefined;
  }

  async getChallengeProgressByUserAndChallenge(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    const [progress] = await db.select().from(userChallengeProgress)
      .where(and(
        eq(userChallengeProgress.userId, userId),
        eq(userChallengeProgress.challengeId, challengeId)
      ));
    return progress || undefined;
  }

  async createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const [newProgress] = await db.insert(userChallengeProgress).values(progress).returning();
    return newProgress;
  }

  async updateUserChallengeProgress(id: number, progress: Partial<UserChallengeProgress>): Promise<UserChallengeProgress | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {
      updatedAt: new Date()
    };
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(progress)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [updatedProgress] = await db
      .update(userChallengeProgress)
      .set(updateData)
      .where(eq(userChallengeProgress.id, id))
      .returning();
    
    return updatedProgress || undefined;
  }

  async completeChallenge(userId: number, challengeId: number, pointsEarned: number): Promise<UserChallengeProgress | undefined> {
    const now = new Date();
    
    // First check if this progress entry exists
    const [existingProgress] = await db.select().from(userChallengeProgress)
      .where(and(
        eq(userChallengeProgress.userId, userId),
        eq(userChallengeProgress.challengeId, challengeId)
      ));
    
    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db
        .update(userChallengeProgress)
        .set({
          status: 'Completed',
          progress: 100,
          pointsEarned: pointsEarned,
          completedAt: now,
          updatedAt: now
        })
        .where(eq(userChallengeProgress.id, existingProgress.id))
        .returning();
      
      // Check if badges need to be awarded
      await this.checkAndAwardBadges(userId);
      
      return updatedProgress;
    } else {
      // Create new progress entry
      const [newProgress] = await db
        .insert(userChallengeProgress)
        .values({
          userId,
          challengeId,
          status: 'Completed',
          progress: 100,
          pointsEarned: pointsEarned,
          completedAt: now
        })
        .returning();
      
      // Check if badges need to be awarded
      await this.checkAndAwardBadges(userId);
      
      return newProgress;
    }
  }

  // Badge methods
  async getAllBadges(): Promise<ExplorationBadge[]> {
    return await db.select().from(explorationBadges).orderBy(asc(explorationBadges.name));
  }

  async getBadgeById(id: number): Promise<ExplorationBadge | undefined> {
    const [badge] = await db.select().from(explorationBadges).where(eq(explorationBadges.id, id));
    return badge || undefined;
  }

  async getBadgesByType(type: BadgeType): Promise<ExplorationBadge[]> {
    return await db.select().from(explorationBadges)
      .where(eq(explorationBadges.badgeType, type))
      .orderBy(asc(explorationBadges.level));
  }

  async createBadge(badge: InsertExplorationBadge): Promise<ExplorationBadge> {
    const [newBadge] = await db.insert(explorationBadges).values(badge).returning();
    return newBadge;
  }

  async updateBadge(id: number, badge: Partial<InsertExplorationBadge>): Promise<ExplorationBadge | undefined> {
    // Create a clean update object without undefined values
    const updateData: any = {};
    
    // Only include defined properties in the update
    for (const [key, value] of Object.entries(badge)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const [updatedBadge] = await db
      .update(explorationBadges)
      .set(updateData)
      .where(eq(explorationBadges.id, id))
      .returning();
    
    return updatedBadge || undefined;
  }

  async deleteBadge(id: number): Promise<boolean> {
    try {
      await db.delete(explorationBadges).where(eq(explorationBadges.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting badge:", error);
      return false;
    }
  }

  // User Badge methods
  async getUserBadges(userId: number): Promise<(UserBadge & { badge: ExplorationBadge })[]> {
    const userBadgesResult = await db.select({
      userBadge: userBadges,
      badge: explorationBadges
    })
    .from(userBadges)
    .innerJoin(
      explorationBadges,
      eq(userBadges.badgeId, explorationBadges.id)
    )
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt));
    
    return userBadgesResult.map(item => ({
      ...item.userBadge,
      badge: item.badge
    }));
  }

  async awardBadgeToUser(userId: number, badgeId: number): Promise<UserBadge | undefined> {
    // Check if user already has this badge
    const [existingBadge] = await db.select().from(userBadges)
      .where(and(
        eq(userBadges.userId, userId),
        eq(userBadges.badgeId, badgeId)
      ));
    
    if (existingBadge) {
      return existingBadge; // User already has this badge
    }
    
    // Award the badge
    const [newUserBadge] = await db.insert(userBadges)
      .values({
        userId,
        badgeId
      })
      .returning();
    
    return newUserBadge;
  }

  async checkAndAwardBadges(userId: number): Promise<UserBadge[]> {
    // Get all the user's progress data
    const userProgress = await this.getUserChallengeProgress(userId);
    const completedChallenges = userProgress.filter(p => p.status === 'Completed');
    const totalPoints = completedChallenges.reduce((sum, p) => sum + p.pointsEarned, 0);
    
    // Count various activities
    const challengesCompleted = completedChallenges.length;
    const schoolsViewed = new Set();
    const suburbsExplored = new Set();
    
    // Collect completed steps from all challenges
    completedChallenges.forEach(progress => {
      if (progress.completedSteps.schools) {
        progress.completedSteps.schools.forEach(schoolId => schoolsViewed.add(schoolId));
      }
      if (progress.completedSteps.suburbs) {
        progress.completedSteps.suburbs.forEach(suburb => suburbsExplored.add(suburb));
      }
    });
    
    // Get all badges
    const allBadges = await this.getAllBadges();
    const awardedBadges: UserBadge[] = [];
    
    // Check each badge to see if the user qualifies
    for (const badge of allBadges) {
      // Skip badges user already has
      const [existingBadge] = await db.select().from(userBadges)
        .where(and(
          eq(userBadges.userId, userId),
          eq(userBadges.badgeId, badge.id)
        ));
      
      if (existingBadge) continue;
      
      // Check if user meets badge requirements
      let qualifies = true;
      
      if (badge.requirements.challengesCompleted && challengesCompleted < badge.requirements.challengesCompleted) {
        qualifies = false;
      }
      
      if (badge.requirements.schoolsViewed && schoolsViewed.size < badge.requirements.schoolsViewed) {
        qualifies = false;
      }
      
      if (badge.requirements.suburbsExplored && suburbsExplored.size < badge.requirements.suburbsExplored) {
        qualifies = false;
      }
      
      if (badge.requirements.minimumPoints && totalPoints < badge.requirements.minimumPoints) {
        qualifies = false;
      }
      
      // Award badge if user qualifies
      if (qualifies) {
        const awardedBadge = await this.awardBadgeToUser(userId, badge.id);
        if (awardedBadge) {
          awardedBadges.push(awardedBadge);
        }
      }
    }
    
    return awardedBadges;
  }

  // User Points methods
  async getUserPoints(userId: number): Promise<number> {
    const userProgress = await this.getUserChallengeProgress(userId);
    return userProgress.reduce((sum, p) => sum + p.pointsEarned, 0);
  }

  async addPointsToUser(userId: number, points: number): Promise<number> {
    // There's no specific points table, so we'll track points through challenges
    // Create a special "points awarded" challenge if it doesn't exist
    let pointsChallenge = await db.select().from(explorationChallenges)
      .where(eq(explorationChallenges.title, "Points Awarded"))
      .limit(1);
    
    if (pointsChallenge.length === 0) {
      // Create the points challenge
      [pointsChallenge[0]] = await db.insert(explorationChallenges).values({
        title: "Points Awarded",
        description: "Points awarded for various activities",
        challengeType: "ViewSchools",
        difficulty: "Beginner",
        points: 0,
        requirements: { schoolCount: 0 },
        isActive: true,
        isPremiumOnly: false
      }).returning();
    }
    
    // Now add the points to the user's progress
    await this.completeChallenge(userId, pointsChallenge[0].id, points);
    
    // Return the total points
    return await this.getUserPoints(userId);
  }

  // Initialize with sample data if database is empty
  async initializeSchools() {
    const existingSchools = await this.getAllSchools();
    
    if (existingSchools.length === 0) {
      const sampleSchools: InsertSchool[] = [
        {
          name: "Melbourne Grammar School",
          type: "Private",
          educationLevel: "Combined",
          suburb: "South Yarra",
          postcode: "3141",
          address: "355 St Kilda Rd, Melbourne VIC 3004",
          website: "https://www.mgs.vic.edu.au",
          phone: "(03) 9865 7555",
          email: "info@mgs.vic.edu.au",
          description: "Melbourne Grammar School is one of Australia's leading independent schools, with a tradition of excellence spanning more than 160 years.",
          yearLevels: "Prep-12",
          studentCount: 1800,
          averageClassSize: 18,
          atarAverage: 855, // 85.5
          teacherCount: 180,
          teacherQualifications: "78% with Masters or higher",
          fees: "$35,000 - $38,000",
          facilities: ["Performing Arts Center", "Olympic Swimming Pool", "Multiple Sports Fields", "Science Labs"],
          programs: ["International Baccalaureate", "STEM Excellence", "Music Program", "Leadership Development"],
          latitude: "-37.8340",
          longitude: "144.9737",
          imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
        },
        {
          name: "McKinnon Secondary College",
          type: "Public",
          educationLevel: "Secondary",
          suburb: "McKinnon",
          postcode: "3204",
          address: "McKinnon Rd, McKinnon VIC 3204",
          website: "https://mckinnonsc.vic.edu.au",
          phone: "(03) 8520 9000",
          email: "mckinnon.sc@education.vic.gov.au",
          description: "McKinnon Secondary College is a high-performing public school known for its academic excellence and supportive environment.",
          yearLevels: "7-12",
          studentCount: 2100,
          averageClassSize: 23,
          atarAverage: 832, // 83.2
          teacherCount: 145,
          teacherQualifications: "45% with Masters or higher",
          fees: "Government Funded (Minimal fees)",
          facilities: ["Basketball Courts", "Library", "Computer Labs", "Science Labs"],
          programs: ["Accelerated Learning Program", "Sports Excellence", "Robotics", "Performing Arts"],
          latitude: "-37.9104",
          longitude: "145.0398",
          imageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
        },
        {
          name: "St Catherine's School",
          type: "Catholic",
          educationLevel: "Combined",
          suburb: "Toorak",
          postcode: "3142",
          address: "17 Heyington Pl, Toorak VIC 3142",
          website: "https://www.stcatherines.net.au",
          phone: "(03) 9822 1285",
          email: "info@stcatherines.net.au",
          description: "St Catherine's School is a Catholic day and boarding school for girls, committed to providing an exceptional education in the Catholic tradition.",
          yearLevels: "Prep-12",
          studentCount: 950,
          averageClassSize: 15,
          atarAverage: 901, // 90.1
          teacherCount: 95,
          teacherQualifications: "65% with Masters or higher",
          fees: "$30,000 - $32,000",
          facilities: ["Chapel", "Performing Arts Center", "Aquatic Center", "Tennis Courts"],
          programs: ["Religious Education", "Music Excellence", "Sports Academy", "Community Service"],
          latitude: "-37.8380",
          longitude: "145.0207",
          imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: true,
        },
        {
          name: "Templestowe College",
          type: "Public",
          educationLevel: "Secondary",
          suburb: "Templestowe",
          postcode: "3106",
          address: "7 Cypress Ave, Templestowe VIC 3106",
          website: "https://www.templestowec.vic.edu.au",
          phone: "(03) 9850 6333",
          email: "info@templestowec.vic.edu.au",
          description: "Templestowe College is known for its innovative approach to education, offering personalized learning paths and a wide range of programs.",
          yearLevels: "7-12",
          studentCount: 1100,
          averageClassSize: 22,
          atarAverage: 780, // 78.0
          teacherCount: 85,
          teacherQualifications: "50% with Masters or higher",
          fees: "Government Funded (Minimal fees)",
          facilities: ["Sports Complex", "Technology Hub", "Arts Center", "Science Labs"],
          programs: ["Flexible Learning Program", "Sports Academy", "STEAM Focus", "Entrepreneurship"],
          latitude: "-37.7561",
          longitude: "145.1328",
          imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
        },
        {
          name: "Box Hill High School",
          type: "Public",
          educationLevel: "Secondary",
          suburb: "Box Hill",
          postcode: "3128",
          address: "1180 Whitehorse Rd, Box Hill VIC 3128",
          website: "https://www.boxhillhs.vic.edu.au",
          phone: "(03) 9877 1177",
          email: "box.hill.hs@education.vic.gov.au",
          description: "Box Hill High School is a co-educational secondary school known for its academic excellence and strong focus on science and mathematics.",
          yearLevels: "7-12",
          studentCount: 1200,
          averageClassSize: 24,
          atarAverage: 800, // 80.0
          teacherCount: 90,
          teacherQualifications: "55% with Masters or higher",
          fees: "Government Funded (Minimal fees)",
          facilities: ["Science Labs", "Library", "Sports Grounds", "Computer Labs"],
          programs: ["Select Entry Accelerated Learning", "Sports Program", "Robotics Club", "Performing Arts"],
          latitude: "-37.8196",
          longitude: "145.1201",
          imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          featured: false,
        }
      ];
      
      for (const school of sampleSchools) {
        await this.createSchool(school);
      }
    }
  }
}

// Create and initialize database storage
export const storage = new DatabaseStorage();

// Initialize with sample suburb data
async function initializeSuburbs() {
  try {
    const existingSuburbs = await storage.getAllSuburbs();
    
    if (existingSuburbs.length === 0) {
      console.log("Initializing Melbourne suburbs...");
      // We'll need to add actual suburb data from a data source here
      // For now we'll just add the suburbs from our sample schools to ensure consistency
      
      const schoolSuburbs = [
        {
          name: "South Yarra",
          postcode: "3141",
          region: "Inner City",
          latitude: "-37.8390",
          longitude: "144.9835",
          population: 25300,
        },
        {
          name: "McKinnon",
          postcode: "3204",
          region: "South-Eastern",
          latitude: "-37.9104",
          longitude: "145.0398",
          population: 6200,
        },
        {
          name: "Toorak",
          postcode: "3142",
          region: "Inner City",
          latitude: "-37.8418",
          longitude: "145.0124",
          population: 12900,
        },
        {
          name: "Templestowe",
          postcode: "3106",
          region: "Eastern",
          latitude: "-37.7561",
          longitude: "145.1328",
          population: 16800,
        },
        {
          name: "Box Hill",
          postcode: "3128",
          region: "Eastern",
          latitude: "-37.8196",
          longitude: "145.1201",
          population: 25100,
        }
      ];
      
      for (const suburb of schoolSuburbs) {
        await storage.createSuburb(suburb);
      }
      
      console.log(`Initialized ${schoolSuburbs.length} suburbs from our existing schools.`);
    }
  } catch (err) {
    console.error("Failed to initialize suburbs:", err);
  }
}

// Initialize sample data
Promise.all([
  storage.initializeSchools().catch(err => {
    console.error("Failed to initialize sample schools:", err);
  }),
  initializeSuburbs().catch(err => {
    console.error("Failed to initialize suburbs:", err);
  })
]);
