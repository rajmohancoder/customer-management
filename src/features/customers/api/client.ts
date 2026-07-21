import { createApiClient } from '@rajmohancoder/api-client';

export const apiClient = createApiClient({
  baseUrl: '/api/v1',
  scopes: ['api://customer-service/.default'],
});
