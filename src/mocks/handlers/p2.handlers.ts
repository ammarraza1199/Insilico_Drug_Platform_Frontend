import { http, HttpResponse, delay } from 'msw';

export const p2Handlers = [
  http.post('/api/p2/generate-data', async () => {
    await delay(500);
    return HttpResponse.json({
      experimentId: 'p2-exp-' + Math.random().toString(36).substr(2, 9),
      status: 'queued',
      jobId: 'job-' + Math.random().toString(36).substr(2, 9),
      estimatedDuration: 45,
    });
  }),

  http.get('/api/p2/results/:id', async ({ params }) => {
    await delay(1000);
    return HttpResponse.json({
      experimentId: params.id,
      status: 'complete',
      generatedSamples: 500,
      features: 20531,
      modalities: ['rna_seq'],
      generationTimeSeconds: 42,
      qualityMetrics: {
        meanExpressionSimilarity: 0.94,
        variancePreservation: 0.91,
        correlationStructure: 0.88,
        pcaVarianceExplained: [0.34, 0.18, 0.09],
      },
      downloadFiles: [
        { name: 'synthetic_rnaseq_matrix.csv', size: 14900000, url: '/api/p2/download/1' },
        { name: 'sample_metadata.csv', size: 46000, url: '/api/p2/download/2' },
        { name: 'generation_config.json', size: 2100, url: '/api/p2/download/3' },
      ],
    });
  }),
];
