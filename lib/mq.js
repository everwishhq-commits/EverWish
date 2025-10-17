import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL);

export const sendQueue = new Queue("everwish-send", { connection });

export const worker = new Worker(
  "everwish-send",
  async (job) => {
    const { card, recipients } = job.data;
    console.log(`🔹 Enviando ${recipients.length} tarjetas de ${card.slug}`);
    // aquí iría el envío por SendGrid / Twilio
  },
  { connection }
);
