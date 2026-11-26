import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userPreferencesSchema = new mongoose.Schema(
  {
    voiceEnabled: {
      type: Boolean,
      default: true,
    },
    defaultInterviewType: {
      type: String,
      enum: ['Technical', 'HR / General', 'Behavioral', 'Mixed'],
      default: 'Technical',
    },
    defaultDifficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    defaultQuestionCount: {
      type: Number,
      enum: [3, 5, 10],
      default: 5,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never return password hash by default
    },
    targetRole: {
      type: String,
      trim: true,
      default: 'Software Engineer',
      maxlength: [100, 'Target role cannot exceed 100 characters'],
    },
    experience: {
      type: String,
      trim: true,
      default: 'Student / Fresher',
      maxlength: [50, 'Experience cannot exceed 50 characters'],
    },
    skills: {
      type: [String],
      default: [],
      validate: [
        (val) => val.length <= 50,
        'Cannot exceed 50 skills',
      ],
    },
    education: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Education cannot exceed 200 characters'],
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false, // Used for invalidating all issued JWTs upon logout or password change
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.tokenVersion;
        return ret;
      },
    },
  }
);

/**
 * Compares plaintext candidate password against the stored bcrypt hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    throw new Error('Password hash not loaded in user model for comparison');
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Returns a sanitized plain JavaScript object representing the user.
 * @returns {Object}
 */
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id ? this._id.toString() : this.id,
    name: this.name,
    email: this.email,
    targetRole: this.targetRole,
    experience: this.experience,
    skills: this.skills,
    education: this.education,
    preferences: this.preferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 * @param {string} password
 * @returns {Promise<string>}
 */
userSchema.statics.hashPassword = async function (password) {
  const byteLength = Buffer.byteLength(password, 'utf8');
  if (byteLength > 72) {
    throw new Error('Password cannot exceed bcrypt limit of 72 bytes');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  return bcrypt.hash(password, 12);
};

export const User = mongoose.model('User', userSchema);
