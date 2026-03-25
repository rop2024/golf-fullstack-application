import cron from 'node-cron';
import { runMonthlyDraw } from '../jobs/monthlyDraw.job.js';
import { cleanupOldData } from '../jobs/cleanup.job.js';
import { generateStats } from '../jobs/stats.job.js';
import { sendDailyDigest } from '../jobs/dailyDigest.job.js';

class CronService {
  constructor() {
    this.jobs = [];
  }

  // Initialize all cron jobs
  initialize() {
    console.log('🕐 Initializing cron jobs...');

    // Monthly draw - Run at 00:00 on the 1st of every month
    this.addJob(
      'monthly-draw',
      '0 0 1 * *',
      async () => {
        console.log('📅 Running monthly draw job...');
        try {
          await runMonthlyDraw();
          console.log('✅ Monthly draw completed successfully');
        } catch (error) {
          console.error('❌ Monthly draw failed:', error);
        }
      }
    );

    // Weekly cleanup - Run at 02:00 every Sunday
    this.addJob(
      'weekly-cleanup',
      '0 2 * * 0',
      async () => {
        console.log('🧹 Running weekly cleanup job...');
        try {
          await cleanupOldData();
          console.log('✅ Cleanup completed successfully');
        } catch (error) {
          console.error('❌ Cleanup failed:', error);
        }
      }
    );

    // Daily stats generation - Run at 01:00 every day
    this.addJob(
      'daily-stats',
      '0 1 * * *',
      async () => {
        console.log('📊 Running daily stats job...');
        try {
          await generateStats();
          console.log('✅ Stats generation completed');
        } catch (error) {
          console.error('❌ Stats generation failed:', error);
        }
      }
    );

    // Daily digest emails - Run at 09:00 every day
    this.addJob(
      'daily-digest',
      '0 9 * * *',
      async () => {
        console.log('📧 Running daily digest job...');
        try {
          await sendDailyDigest();
          console.log('✅ Daily digest sent');
        } catch (error) {
          console.error('❌ Daily digest failed:', error);
        }
      }
    );

    // Check expiring subscriptions - Run at 00:00 every day
    this.addJob(
      'check-subscriptions',
      '0 0 * * *',
      async () => {
        console.log('🔍 Checking expiring subscriptions...');
        try {
          await checkExpiringSubscriptions();
          console.log('✅ Subscription check completed');
        } catch (error) {
          console.error('❌ Subscription check failed:', error);
        }
      }
    );

    console.log(`✅ ${this.jobs.length} cron jobs initialized`);
  }

  // Add a new job
  addJob(name, schedule, callback) {
    const job = cron.schedule(schedule, callback, {
      scheduled: true,
      timezone: "UTC"
    });
    
    this.jobs.push({ name, job, schedule });
    console.log(`  📌 Added job: ${name} (${schedule})`);
  }

  // Get all jobs
  getJobs() {
    return this.jobs.map(job => ({
      name: job.name,
      schedule: job.schedule,
      running: job.job.getStatus()
    }));
  }

  // Stop a specific job
  stopJob(name) {
    const job = this.jobs.find(j => j.name === name);
    if (job) {
      job.job.stop();
      console.log(`🛑 Stopped job: ${name}`);
      return true;
    }
    return false;
  }

  // Start a specific job
  startJob(name) {
    const job = this.jobs.find(j => j.name === name);
    if (job) {
      job.job.start();
      console.log(`▶️ Started job: ${name}`);
      return true;
    }
    return false;
  }

  // Stop all jobs
  stopAllJobs() {
    this.jobs.forEach(job => {
      job.job.stop();
    });
    console.log('🛑 All cron jobs stopped');
  }

  // Start all jobs
  startAllJobs() {
    this.jobs.forEach(job => {
      job.job.start();
    });
    console.log('▶️ All cron jobs started');
  }
}

export default new CronService();