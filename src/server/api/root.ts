import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import cron from 'node-cron';
import { cronJob } from "../cron";
import { transactionRouter } from "./routers/transactions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  transaction : transactionRouter
});


// *0/30 * * * * *  - every 30 seconds
// eslint-disable-next-line @typescript-eslint/no-misused-promises
cron.schedule('*/30 * * * * *',async()=> { 
 await  cronJob();
})

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
