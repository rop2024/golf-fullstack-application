import { runMonthlyDraw } from '../jobs/monthlyDraw.job.js';
import { cleanupOldData } from '../jobs/cleanup.job.js';
import { generateStats } from '../jobs/stats.job.js';
import { sendDailyDigest } from '../jobs/dailyDigest.job.js';
import { checkExpiringSubscriptions } from '../jobs/checkSubscriptions.job.js';
import dotenv from 'dotenv';

dotenv.config();

const jobs = {
  'monthly-draw': runMonthlyDraw,
  'cleanup': cleanupOldData,
  'stats': generateStats,
  'digest': sendDailyDigest,
  'subscriptions': checkExpiringSubscriptions
};

async function runJob(jobName) {
  const job = jobs[jobName];
  if (!job) {
    console.error(`❌ Job "${jobName}" not found`);
    console.log('Available jobs:', Object.keys(jobs).join(', '));
    process.exit(1);
  }
  
  console.log(`▶️ Running job: ${jobName}`);
  try {
    const result = await job();
    console.log('✅ Job completed:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Job failed:', error);
    process.exit(1);
  }
}

// Get job name from command line
const jobName = process.argv[2];
if (!jobName) {
  console.log('Please specify a job to run');
  console.log('Usage: npm run job <job-name>');
  console.log('Available jobs:', Object.keys(jobs).join(', '));
  process.exit(1);
}

runJob(jobName);