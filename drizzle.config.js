/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url:"postgresql://ai-mock-interview_owner:YwujliV68Igc@ep-lively-heart-a5fko3ln.us-east-2.aws.neon.tech/ai-mock-interview?sslmode=require",
    }
};
