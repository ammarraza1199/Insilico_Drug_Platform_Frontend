import { http, HttpResponse, delay } from 'msw';

export const p3Handlers = [
  http.post('/api/p3/drug-screen', async () => {
    await delay(500);
    return HttpResponse.json({
      experimentId: 'p3-exp-' + Math.random().toString(36).substr(2, 9),
      status: 'queued',
      jobId: 'job-' + Math.random().toString(36).substr(2, 9),
    });
  }),

  http.get('/api/p3/results/:id', async ({ params }) => {
    await delay(1000);
    return HttpResponse.json({
      experimentId: params.id,
      status: 'complete',
      compoundsScreened: 50000,
      topCandidates: [
        {
          rank: 1,
          compoundId: 'CPD-0001',
          compoundName: 'Rapamycin Analog',
          smiles: 'CC1CCCC...',
          efficacyScore: 0.94,
          selectivityScore: 0.87,
          toxicityFlag: null,
          mechanismOfAction: 'mTOR inhibitor',
          predictedGeneChanges: { 'MTOR': -2.3, 'S6K1': -1.8, '4EBP1': -1.5 },
        },
        {
          rank: 2,
          compoundId: 'CPD-0002',
          compoundName: 'Metformin Variant',
          smiles: 'CN(C)C(=N)N=C(N)N',
          efficacyScore: 0.88,
          selectivityScore: 0.82,
          toxicityFlag: 'Low GI distress',
          mechanismOfAction: 'AMPK activator',
          predictedGeneChanges: { 'PRKAA1': 1.9, 'MTOR': -1.2 },
        },
      ],
      enrichedPathways: [
        { pathway: 'mTOR signaling', pValue: 0.0001, enrichmentScore: 3.4, geneCount: 24 },
        { pathway: 'AMPK signaling', pValue: 0.0012, enrichmentScore: 2.8, geneCount: 18 },
      ],
      geneExpressionMatrix: {},
    });
  }),
];
