const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Pakistan' }
    },
    profileImage: {
        type: String
    },
    specialization: {
        type: String,
        trim: true
    },
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const { UserMemory } = require('./inMemoryStore');
const MongooseUser = mongoose.model('User', userSchema);

const UserProxy = new Proxy(MongooseUser, {
    get(target, prop) {
        if (mongoose.connection.readyState !== 1) {
            return UserMemory[prop];
        }
        return target[prop];
    },
    construct(target, args) {
        if (mongoose.connection.readyState !== 1) {
            return new UserMemory(...args);
        }
        return new target(...args);
    }
});

module.exports = UserProxy;