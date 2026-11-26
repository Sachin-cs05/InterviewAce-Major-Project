import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { setMockConnectionStatus } from '../src/config/db.js';

describe('InterviewAce Backend Foundation — Health & Architecture Tests', () => {
  beforeEach(() => {
    // Reset mock database status before each test
    setMockConnectionStatus(null);
  });

  afterEach(() => {
    setMockConnectionStatus(null);
  });

  // 1. Liveness endpoint test
  it('1. GET /api/health/live should return HTTP 200 with live status independently of database', async () => {
    setMockConnectionStatus('disconnected'); // Even if DB is disconnected, liveness should pass

    const res = await request(app).get('/api/health/live');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'InterviewAce API is live');
    assert.equal(res.body.data.service, 'InterviewAce Backend');
    assert.equal(res.body.data.status, 'live');
    assert.equal(typeof res.body.data.uptime, 'number');
    assert.ok(!isNaN(Date.parse(res.body.data.timestamp)));
  });

  // 2. Health endpoint test with connected database
  it('2. GET /api/health should return HTTP 200 when database is connected', async () => {
    setMockConnectionStatus('connected');

    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.message, 'InterviewAce API is healthy');
    assert.equal(res.body.data.status, 'healthy');
    assert.equal(res.body.data.database, 'connected');
    assert.equal(typeof res.body.data.uptime, 'number');
    assert.ok(!isNaN(Date.parse(res.body.data.timestamp)));
  });

  // 3. Health endpoint test with unavailable database
  it('3. GET /api/health should return HTTP 503 when database is unavailable/disconnected', async () => {
    setMockConnectionStatus('disconnected');

    const res = await request(app).get('/api/health');

    assert.equal(res.status, 503);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes('database is not connected'));
    assert.equal(res.body.data.status, 'unhealthy');
    assert.equal(res.body.data.database, 'disconnected');
  });

  // 4. Unknown route handling
  it('4. Unknown API routes should return HTTP 404 with structured JSON response', async () => {
    const res = await request(app).get('/api/non-existent-route-for-testing');

    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes('API route not found: GET /api/non-existent-route-for-testing'));
    assert.ok(Array.isArray(res.body.errors));
  });

  // 5. Invalid JSON request handling
  it('5. Invalid JSON request payload should return HTTP 400 error response', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{"badJson": true, malformed}');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, 'Invalid JSON payload in request body');
    assert.ok(Array.isArray(res.body.errors));
    assert.equal(res.body.errors[0].code, 'INVALID_JSON_BODY');
  });

  // 6. API response structure consistency
  it('6. API response structure should be consistent across success and error responses', async () => {
    setMockConnectionStatus('connected');

    // Test success response
    const successRes = await request(app).get('/api/health');
    assert.ok('success' in successRes.body);
    assert.ok('message' in successRes.body);
    assert.ok('data' in successRes.body);
    assert.equal(successRes.body.success, true);

    // Test error response
    const errorRes = await request(app).get('/api/non-existent');
    assert.ok('success' in errorRes.body);
    assert.ok('message' in errorRes.body);
    assert.ok('errors' in errorRes.body);
    assert.equal(errorRes.body.success, false);
    assert.ok(Array.isArray(errorRes.body.errors));
  });

  // 7. CORS origin handling
  it('7. CORS configuration should authorize configured frontend origin and block unauthorized origins', async () => {
    // Authorized origin (http://localhost:5173)
    const allowedRes = await request(app)
      .get('/api/health/live')
      .set('Origin', 'http://localhost:5173');

    assert.equal(allowedRes.status, 200);
    assert.equal(allowedRes.headers['access-control-allow-origin'], 'http://localhost:5173');

    // Unauthorized origin
    const disallowedRes = await request(app)
      .get('/api/health/live')
      .set('Origin', 'http://malicious-untrusted-domain.com');

    assert.equal(disallowedRes.status, 403);
    assert.equal(disallowedRes.body.success, false);
    assert.ok(disallowedRes.body.message.includes('CORS policy violation'));
  });

  // 8. Security headers verification
  it('8. Helmet security headers should be attached and X-Powered-By disabled', async () => {
    const res = await request(app).get('/api/health/live');

    assert.equal(res.headers['x-powered-by'], undefined);
    assert.ok(res.headers['x-dns-prefetch-control']);
    assert.ok(res.headers['x-frame-options']);
    assert.ok(res.headers['x-content-type-options']);
  });
});
