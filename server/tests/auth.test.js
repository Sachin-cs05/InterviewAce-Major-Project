import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { connectTestDb, clearTestDb, disconnectTestDb, getCsrfPair, extractCookie } from './testHelper.js';
import { env } from '../src/config/env.js';

describe('InterviewAce Phase 2 — Authentication API Test Suite', () => {
  before(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  after(async () => {
    await clearTestDb();
    await disconnectTestDb();
  });

  // CSRF token retrieval
  it('1. GET /api/auth/csrf should issue a fresh CSRF token and cookie', async () => {
    const res = await request(app).get('/api/auth/csrf');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.csrfToken);

    const csrfCookie = extractCookie(res, 'interviewace_csrf');
    assert.ok(csrfCookie);
    assert.ok(csrfCookie.startsWith('interviewace_csrf='));
  });

  // Registration tests
  it('2. POST /api/auth/signup should register a new candidate and set HttpOnly cookie', async () => {
    const csrf = getCsrfPair();
    const payload = {
      name: 'Alice Developer',
      email: 'alice@example.com',
      password: 'SecurePassword123',
      targetRole: 'Frontend Developer',
    };

    const res = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send(payload);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.name, 'Alice Developer');
    assert.equal(res.body.data.user.email, 'alice@example.com');
    assert.equal(res.body.data.user.targetRole, 'Frontend Developer');
    assert.equal(res.body.data.user.passwordHash, undefined); // Excluded!

    // Verify auth cookie is present and HttpOnly
    const cookies = res.headers['set-cookie'];
    assert.ok(cookies);
    const authCookieHeader = cookies.find((c) => c.startsWith(`${env.AUTH_COOKIE_NAME}=`));
    assert.ok(authCookieHeader);
    assert.ok(authCookieHeader.includes('HttpOnly'));

    // Verify user stored in DB with hashed password
    const dbUser = await User.findOne({ email: 'alice@example.com' }).select('+passwordHash');
    assert.ok(dbUser);
    assert.notEqual(dbUser.passwordHash, 'SecurePassword123');
    assert.ok(dbUser.passwordHash.startsWith('$2')); // bcrypt prefix
  });

  it('3. POST /api/auth/signup should reject duplicate email addresses with HTTP 409', async () => {
    const csrf = getCsrfPair();
    const payload = {
      name: 'Bob Candidate',
      email: 'bob@example.com',
      password: 'Password12345',
    };

    // First registration
    await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send(payload);

    // Second registration with same email
    const duplicateRes = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send(payload);

    assert.equal(duplicateRes.status, 409);
    assert.equal(duplicateRes.body.success, false);
    assert.ok(duplicateRes.body.message.includes('already exists'));
  });

  it('4. POST /api/auth/signup should reject passwords shorter than 8 chars or exceeding 72 bytes', async () => {
    const csrf = getCsrfPair();

    // Short password (<8 chars)
    const shortRes = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Charlie',
        email: 'charlie@example.com',
        password: '123',
      });
    assert.equal(shortRes.status, 400);
    assert.equal(shortRes.body.success, false);

    // Long password (>72 bytes)
    const longRes = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Charlie',
        email: 'charlie2@example.com',
        password: 'A'.repeat(80),
      });
    assert.equal(longRes.status, 400);
    assert.equal(longRes.body.success, false);
  });

  // Login tests
  it('5. POST /api/auth/login should authenticate valid credentials and issue cookie', async () => {
    const csrf = getCsrfPair();

    // Create user
    await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Diana Prince',
        email: 'diana@example.com',
        password: 'ValidPassword123',
      });

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        email: 'diana@example.com',
        password: 'ValidPassword123',
      });

    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.body.success, true);
    assert.equal(loginRes.body.data.user.email, 'diana@example.com');
    assert.equal(loginRes.body.data.user.passwordHash, undefined);

    const authCookie = extractCookie(loginRes, env.AUTH_COOKIE_NAME);
    assert.ok(authCookie);
  });

  it('6. POST /api/auth/login should reject incorrect password or nonexistent email with generic 401', async () => {
    const csrf = getCsrfPair();

    // Nonexistent user
    const noUserRes = await request(app)
      .post('/api/auth/login')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        email: 'ghost@example.com',
        password: 'Password123',
      });
    assert.equal(noUserRes.status, 401);
    assert.equal(noUserRes.body.message, 'Invalid email or password.');

    // Existing user, wrong password
    await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Eva',
        email: 'eva@example.com',
        password: 'CorrectPassword123',
      });

    const wrongPassRes = await request(app)
      .post('/api/auth/login')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        email: 'eva@example.com',
        password: 'WrongPassword999',
      });
    assert.equal(wrongPassRes.status, 401);
    assert.equal(wrongPassRes.body.message, 'Invalid email or password.');
  });

  // Current user (GET /api/auth/me) & Logout
  it('7. GET /api/auth/me should return current user when authenticated, and 401 when not', async () => {
    const csrf = getCsrfPair();

    // Unauthenticated request
    const unauthRes = await request(app).get('/api/auth/me');
    assert.equal(unauthRes.status, 401);

    // Authenticated request
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Frank Miller',
        email: 'frank@example.com',
        password: 'Password12345',
      });

    const authCookie = extractCookie(signupRes, env.AUTH_COOKIE_NAME);

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', authCookie);

    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.success, true);
    assert.equal(meRes.body.data.user.email, 'frank@example.com');
  });

  it('8. POST /api/auth/logout should clear cookie and increment tokenVersion', async () => {
    const csrf = getCsrfPair();

    const signupRes = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Grace Hopper',
        email: 'grace@example.com',
        password: 'Password12345',
      });

    const authCookie = extractCookie(signupRes, env.AUTH_COOKIE_NAME);

    // Logout
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header);

    assert.equal(logoutRes.status, 200);
    assert.equal(logoutRes.body.success, true);

    // Check that subsequent request with old cookie fails (revoked tokenVersion)
    const subsequentMe = await request(app)
      .get('/api/auth/me')
      .set('Cookie', authCookie);

    assert.equal(subsequentMe.status, 401);
  });

  it('9. State-changing requests should reject missing or invalid CSRF tokens', async () => {
    // Missing CSRF token
    const missingCsrfRes = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'No CSRF',
        email: 'nocsrf@example.com',
        password: 'Password12345',
      });

    assert.equal(missingCsrfRes.status, 403);
    assert.ok(missingCsrfRes.body.message.includes('CSRF verification failed'));
  });
});
