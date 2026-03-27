import { http, HttpResponse, delay } from 'msw';

export const p1Handlers = [
  http.post('/api/p1/predict-age', async () => {
    await delay(500);
    return HttpResponse.json({
      experimentId: 'p1-exp-' + Math.random().toString(36).substr(2, 9),
      status: 'queued',
      jobId: 'job-' + Math.random().toString(36).substr(2, 9),
    });
  }),

  http.get('/api/p1/results/:id', async ({ params }) => {
    await delay(1000);
    return HttpResponse.json({
      experimentId: params.id,
      status: 'complete',
      predictedBiologicalAge: 67.4,
      chronologicalAge: 62,
      ageAccelerationScore: 5.4,
      ageAccelerationClass: 'accelerated',
      shapGenes: [
        { gene: 'ELOVL2', shapValue: 0.84, expressionLevel: 2.3, direction: 'up' },
        { gene: 'FHL2', shapValue: 0.71, expressionLevel: -1.2, direction: 'down' },
        { gene: 'KLF14', shapValue: 0.65, expressionLevel: 1.8, direction: 'up' },
        { gene: 'TRIM59', shapValue: 0.58, expressionLevel: -0.9, direction: 'down' },
        { gene: 'EDARADD', shapValue: 0.52, expressionLevel: 1.4, direction: 'up' },
      ],
      diseaseClassification: {
        alzheimers: 0.23,
        parkinsons: 0.08,
        cardiovascular: 0.41,
        type2diabetes: 0.19,
        cancer: 0.31,
      },
      therapeuticTargets: [
        { gene: 'ELOVL2', score: 0.91, knownDrugTarget: true, actionabilityScore: 8.4, expressionLevel: 2.3 },
        { gene: 'FHL2', score: 0.85, knownDrugTarget: false, actionabilityScore: 7.2, expressionLevel: -1.2 },
      ],
    });
  }),

  http.get('/api/p1/jobs/:jobId/status', async () => {
    await delay(150);
    return HttpResponse.json({
      jobId: 'some-job-id',
      progress: Math.floor(Math.random() * 100),
      stage: 'Inference running...',
      eta: 45,
    });
  }),
];
