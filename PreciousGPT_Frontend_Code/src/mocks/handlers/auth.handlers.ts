import { http, HttpResponse, delay } from 'msw';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = await request.json() as any;
    await delay(500);

    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: 'u1',
        name: email.split('@')[0],
        email: email,
        role: 'researcher',
        organization: 'Precious AI Lab',
        createdAt: new Date().toISOString(),
      },
      expiresAt: Date.now() + 3600000,
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const data = await request.json() as any;
    await delay(800);

    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: 'u2',
        name: data.name,
        email: data.email,
        role: data.role || 'researcher',
        organization: 'Precious AI Lab',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/users/me', async () => {
    await delay(300);
    return HttpResponse.json({
      id: 'u1',
      name: 'Researcher One',
      email: 'researcher@wallahgpt.ai',
      role: 'researcher',
      organization: 'Precious AI Lab',
      createdAt: new Date().toISOString(),
    });
  }),

  http.post('/api/auth/logout', async () => {
    return HttpResponse.json({ success: true });
  }),
];
