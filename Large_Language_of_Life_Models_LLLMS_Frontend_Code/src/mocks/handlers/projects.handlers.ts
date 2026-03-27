import { http, HttpResponse, delay } from 'msw';

export const projectHandlers = [
  http.get('/api/projects', async () => {
    await delay(300);
    return HttpResponse.json([
      { id: 'proj-1', name: 'Aging Study 2024', description: 'Primary study on DNA methylation', createdAt: new Date().toISOString() },
      { id: 'proj-2', name: 'Synthetic Lung Data', description: 'Generating baseline RNA-seq', createdAt: new Date().toISOString() },
    ]);
  }),

  http.get('/api/experiments', async () => {
    await delay(400);
    return HttpResponse.json([
      { id: 'exp-1', name: 'Baseline Age Prediction', system: 'p1', projectId: 'proj-1', status: 'complete', createdAt: new Date().toISOString() },
      { id: 'exp-2', name: 'Synthetic Liver Pilot', system: 'p2', projectId: 'proj-2', status: 'running', progress: 45, createdAt: new Date().toISOString() },
    ]);
  }),
];
