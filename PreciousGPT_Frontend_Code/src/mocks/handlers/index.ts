import { authHandlers } from './auth.handlers';
import { p1Handlers } from './p1.handlers';
import { p2Handlers } from './p2.handlers';
import { p3Handlers } from './p3.handlers';
import { projectHandlers } from './projects.handlers';

export const handlers = [
  ...authHandlers,
  ...p1Handlers,
  ...p2Handlers,
  ...p3Handlers,
  ...projectHandlers,
];
