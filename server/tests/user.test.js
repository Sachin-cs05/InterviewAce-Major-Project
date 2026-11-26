import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDb, clearTestDb, disconnectTestDb, getCsrfPair, extractCookie } from './testHelper.js';
import { env } from '../src/config/env.js';

describe('InterviewAce Phase 2 — User Profile & Preferences Test Suite', () => {
  let authCookie = null;
  let csrf = null;

  before(async () => {
    await connectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
    csrf = getCsrfPair();

    // Register a baseline candidate for user tests
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        name: 'Harry Potter',
        email: 'harry@example.com',
        password: 'GryffindorPassword123',
        targetRole: 'Full Stack MERN',
      });

    authCookie = extractCookie(signupRes, env.AUTH_COOKIE_NAME);
  });

  after(async () => {
    await clearTestDb();
    await disconnectTestDb();
  });

  // Profile endpoints
  it('1. GET /api/users/me should return authenticated profile and reject unauthenticated requests', async () => {
    // Unauthenticated
    const unauthRes = await request(app).get('/api/users/me');
    assert.equal(unauthRes.status, 401);

    // Authenticated
    const res = await request(app)
      .get('/api/users/me')
      .set('Cookie', authCookie);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.name, 'Harry Potter');
    assert.equal(res.body.data.user.email, 'harry@example.com');
    assert.equal(res.body.data.user.targetRole, 'Full Stack MERN');
  });

  it('2. PATCH /api/users/me should update profile fields and reject protected fields', async () => {
    const updatePayload = {
      name: 'Harry James Potter',
      targetRole: 'Senior SDE-1',
      experience: '1-3 Years',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      education: 'Hogwarts B.Tech CS',
    };

    const res = await request(app)
      .patch('/api/users/me')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send(updatePayload);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.name, 'Harry James Potter');
    assert.equal(res.body.data.user.targetRole, 'Senior SDE-1');
    assert.equal(res.body.data.user.experience, '1-3 Years');
    assert.deepEqual(res.body.data.user.skills, ['React', 'Node.js', 'MongoDB', 'Express']);
    assert.equal(res.body.data.user.education, 'Hogwarts B.Tech CS');

    // Attempting to update unsupported/protected fields (e.g., email or passwordHash) should be rejected
    const invalidRes = await request(app)
      .patch('/api/users/me')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send({ email: 'newemail@example.com' });

    assert.equal(invalidRes.status, 400);
    assert.equal(invalidRes.body.success, false);
  });

  // Preferences endpoint
  it('3. PATCH /api/users/me/preferences should update interview preferences', async () => {
    const prefsPayload = {
      voiceEnabled: false,
      defaultInterviewType: 'Behavioral',
      defaultDifficulty: 'Hard',
      defaultQuestionCount: 10,
    };

    const res = await request(app)
      .patch('/api/users/me/preferences')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send(prefsPayload);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.preferences.voiceEnabled, false);
    assert.equal(res.body.data.user.preferences.defaultInterviewType, 'Behavioral');
    assert.equal(res.body.data.user.preferences.defaultDifficulty, 'Hard');
    assert.equal(res.body.data.user.preferences.defaultQuestionCount, 10);
  });

  it('4. PATCH /api/users/me/preferences should support partial updates and preserve existing preferences', async () => {
    // First update: set difficulty to Easy
    await request(app)
      .patch('/api/users/me/preferences')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send({ defaultDifficulty: 'Easy' });

    // Second partial update: update only voiceEnabled
    const partialRes = await request(app)
      .patch('/api/users/me/preferences')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send({ voiceEnabled: false });

    assert.equal(partialRes.status, 200);
    assert.equal(partialRes.body.data.user.preferences.defaultDifficulty, 'Easy'); // Preserved!
    assert.equal(partialRes.body.data.user.preferences.voiceEnabled, false);
  });

  // Change Password endpoint
  it('5. PATCH /api/users/me/password should change password and revoke existing token', async () => {
    // Successful password change
    const changeRes = await request(app)
      .patch('/api/users/me/password')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send({
        currentPassword: 'GryffindorPassword123',
        newPassword: 'BrandNewSecurePassword456',
      });

    assert.equal(changeRes.status, 200);
    assert.equal(changeRes.body.success, true);

    // Old session token should now be rejected (tokenVersion incremented)
    const oldSessionRes = await request(app)
      .get('/api/users/me')
      .set('Cookie', authCookie);
    assert.equal(oldSessionRes.status, 401);

    // Old password should fail login
    const oldLogin = await request(app)
      .post('/api/auth/login')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        email: 'harry@example.com',
        password: 'GryffindorPassword123',
      });
    assert.equal(oldLogin.status, 401);

    // New password should succeed login
    const newLogin = await request(app)
      .post('/api/auth/login')
      .set('Cookie', csrf.cookie)
      .set('x-csrf-token', csrf.header)
      .send({
        email: 'harry@example.com',
        password: 'BrandNewSecurePassword456',
      });
    assert.equal(newLogin.status, 200);
    assert.equal(newLogin.body.success, true);
  });

  it('6. PATCH /api/users/me/password should reject incorrect current password', async () => {
    const wrongPassRes = await request(app)
      .patch('/api/users/me/password')
      .set('Cookie', `${authCookie}; ${csrf.cookie}`)
      .set('x-csrf-token', csrf.header)
      .send({
        currentPassword: 'WrongPassword!',
        newPassword: 'BrandNewPassword123',
      });

    assert.equal(wrongPassRes.status, 400);
    assert.ok(wrongPassRes.body.message.includes('Current password is incorrect'));
  });
});
