// worker.ts
import Queue from 'better-queue';
import { OcrService } from './services/ocr_service';
import ReceiptRepository from './repositories/receipts_repository';
import logging from './utils/logging';

const queue = new Queue(async (job, cb) => {
  const ocrService = new OcrService();
  try {
    await ocrService.validate(job.jobId, job.imageUrl);
    cb(null);
  } catch (err) {
    console.log(err)
    logging.error('worker validation error', err);
    cb(err);
  }
}, {
  concurrent: 3,
  maxRetries: 2,
  afterProcessDelay: 1000
});

// polling part
setInterval(async () => {
  const receipts = await ReceiptRepository.findMany({
    where: {
      status: 'PENDING'
    },
    take: 3,
    orderBy: {
      created_at: 'desc'
    }
  })

  if (receipts) {
    for (const receipt of receipts) {
      if (receipt.status === 'PENDING') {
        await ReceiptRepository.update({
          where: { id: receipt.id },
          data: { status: 'PROCESSING' }
        });

        queue.push({ jobId: receipt.id, imageUrl: receipt.image_url });
      }
    }
  }
}, 3000);
