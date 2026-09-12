const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class ObjectId {
    constructor(id) {
        this.id = id ? String(id) : uuidv4().replace(/-/g, '').slice(0, 24);
    }
    toString() {
        return this.id;
    }
    toJSON() {
        return this.id;
    }
    equals(other) {
        if (!other) return false;
        return this.toString() === (other.toString ? other.toString() : String(other));
    }
}

// In-memory collections
const collections = {
    users: new Map(),
    predictions: new Map(),
    appointments: new Map()
};

// Seed initial data
const initSeed = () => {
    const adminId = new ObjectId('507f1f77bcf86cd799439011');
    const doc1Id = new ObjectId('507f1f77bcf86cd799439012');
    const doc2Id = new ObjectId('507f1f77bcf86cd799439013');
    const doc3Id = new ObjectId('507f1f77bcf86cd799439014');
    const patientId = new ObjectId('507f1f77bcf86cd799439015');

    const adminHash = bcrypt.hashSync('admin123', 10);
    const doctorHash = bcrypt.hashSync('doctor123', 10);
    const patientHash = bcrypt.hashSync('patient123', 10);

    collections.users.set(adminId.toString(), {
        _id: adminId,
        name: 'System Admin',
        email: 'admin@aiyecare.com',
        password: adminHash,
        role: 'admin',
        phone: '+1 555-0100',
        isActive: true,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date()
    });

    collections.users.set(doc1Id.toString(), {
        _id: doc1Id,
        name: 'Dr. Ahmed Khan',
        email: 'doctor1@aiyecare.com',
        password: doctorHash,
        role: 'doctor',
        phone: '+1 555-0101',
        specialization: 'Ophthalmology',
        isActive: true,
        createdAt: new Date('2025-01-02T00:00:00Z'),
        updatedAt: new Date()
    });

    collections.users.set(doc2Id.toString(), {
        _id: doc2Id,
        name: 'Dr. Sarah Ali',
        email: 'doctor2@aiyecare.com',
        password: doctorHash,
        role: 'doctor',
        phone: '+1 555-0102',
        specialization: 'Retina Specialist',
        isActive: true,
        createdAt: new Date('2025-01-03T00:00:00Z'),
        updatedAt: new Date()
    });

    collections.users.set(doc3Id.toString(), {
        _id: doc3Id,
        name: 'Dr. Muhammad Imran',
        email: 'doctor3@aiyecare.com',
        password: doctorHash,
        role: 'doctor',
        phone: '+1 555-0103',
        specialization: 'Glaucoma Specialist',
        isActive: true,
        createdAt: new Date('2025-01-04T00:00:00Z'),
        updatedAt: new Date()
    });

    collections.users.set(patientId.toString(), {
        _id: patientId,
        name: 'John Doe',
        email: 'patient@aiyecare.com',
        password: patientHash,
        role: 'patient',
        phone: '+1 555-0199',
        isActive: true,
        address: { city: 'New York', country: 'USA' },
        createdAt: new Date('2025-01-05T00:00:00Z'),
        updatedAt: new Date()
    });

    // Sample prediction
    const pred1Id = new ObjectId('507f1f77bcf86cd799439021');
    collections.predictions.set(pred1Id.toString(), {
        _id: pred1Id,
        userId: patientId,
        imageUrl: '/models/test_image.png',
        imageName: 'fundus_scan_sample.png',
        prediction: 'cataract',
        isNormal: false,
        confidence: 0.94,
        binaryResult: { isNormal: false, normalProbability: 0.06, diseaseProbability: 0.94 },
        diseaseResult: {
            disease: 'cataract',
            confidence: 0.94,
            probabilities: { diabetes: 0.02, glaucoma: 0.03, cataract: 0.94, myopia: 0.01 }
        },
        recommendations: [
            { title: 'Cataract Detected', description: 'Consult an ophthalmologist for evaluation', priority: 'medium' },
            { title: 'Cataract Detected', description: 'Consider lens replacement surgery if recommended', priority: 'medium' }
        ],
        status: 'reviewed',
        isAccepted: true,
        doctorReview: {
            doctorId: doc1Id,
            notes: 'Consistent with early nuclear cataract. Clear lens replacement recommended.',
            confirmedDiagnosis: 'cataract',
            treatmentPlan: 'Schedule follow-up appointment in 3 months.',
            reviewedAt: new Date()
        },
        createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2),
        updatedAt: new Date()
    });

    // Sample appointment
    const apt1Id = new ObjectId('507f1f77bcf86cd799439031');
    collections.appointments.set(apt1Id.toString(), {
        _id: apt1Id,
        patientId: patientId,
        doctorId: doc1Id,
        predictionId: pred1Id,
        date: new Date(Date.now() + 3600 * 1000 * 24 * 3),
        time: '10:00 AM',
        duration: 30,
        type: 'consultation',
        reason: 'Follow-up on cataract diagnosis scan',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600 * 1000 * 24),
        updatedAt: new Date()
    });
};

initSeed();

// Matcher helper
function matchFilter(doc, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const [key, val] of Object.entries(filter)) {
        if (key === '$or' && Array.isArray(val)) {
            const orMatched = val.some(sub => matchFilter(doc, sub));
            if (!orMatched) return false;
            continue;
        }

        // Nested keys like 'reviewRequest.sentToDoctorId'
        let docVal;
        if (key.includes('.')) {
            const parts = key.split('.');
            docVal = doc;
            for (const p of parts) {
                if (docVal == null) break;
                docVal = docVal[p];
            }
        } else {
            docVal = doc[key];
        }

        if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof ObjectId) && !(val instanceof Date)) {
            if ('$exists' in val) {
                const exists = docVal !== undefined && docVal !== null;
                if (val.$exists !== exists) return false;
                continue;
            }
            if ('$in' in val && Array.isArray(val.$in)) {
                const matched = val.$in.some(target => {
                    const targetStr = target?.toString ? target.toString() : String(target);
                    const docStr = docVal?.toString ? docVal.toString() : String(docVal);
                    return targetStr === docStr;
                });
                if (!matched) return false;
                continue;
            }
            if ('$gte' in val) {
                if (new Date(docVal) < new Date(val.$gte)) return false;
                continue;
            }
            if ('$lte' in val) {
                if (new Date(docVal) > new Date(val.$lte)) return false;
                continue;
            }
            if ('$ne' in val) {
                const targetStr = val.$ne?.toString ? val.$ne.toString() : String(val.$ne);
                const docStr = docVal?.toString ? docVal.toString() : String(docVal);
                if (targetStr === docStr) return false;
                continue;
            }
        }

        const targetStr = val?.toString ? val.toString() : String(val);
        const docStr = docVal?.toString ? docVal.toString() : String(docVal);
        if (targetStr !== docStr) return false;
    }
    return true;
}

// Wrap plain object with Mongoose-like methods
function wrapDoc(collectionName, rawDoc) {
    if (!rawDoc) return null;
    const doc = { ...rawDoc };

    doc.save = async function() {
        if (!this._id) {
            this._id = new ObjectId();
        }
        this.updatedAt = new Date();
        if (!this.createdAt) this.createdAt = new Date();

        if (collectionName === 'users' && this.password && !this.password.startsWith('$2')) {
            this.password = bcrypt.hashSync(this.password, 10);
        }

        collections[collectionName].set(this._id.toString(), { ...this });
        return wrapDoc(collectionName, this);
    };

    doc.deleteOne = async function() {
        collections[collectionName].delete(this._id.toString());
        return { deletedCount: 1 };
    };

    doc.comparePassword = async function(candidate) {
        if (!this.password) return false;
        return bcrypt.compareSync(candidate, this.password);
    };

    doc.toJSON = function() {
        const copy = { ...this };
        delete copy.password;
        return copy;
    };

    doc.toObject = function() {
        return { ...this };
    };

    doc.populate = async function(field, select) {
        await populateDoc(this, field, select);
        return this;
    };

    return doc;
}

// Populator
async function populateDoc(doc, field, select) {
    if (!doc) return;
    const selectFields = select ? select.split(' ').map(s => s.trim()).filter(Boolean) : null;

    function applySelect(target) {
        if (!target || !selectFields) return target;
        const result = { _id: target._id };
        selectFields.forEach(f => {
            if (f.startsWith('-')) {
                delete result[f.slice(1)];
            } else {
                result[f] = target[f];
            }
        });
        return result;
    }

    if (field === 'userId' && doc.userId) {
        const raw = collections.users.get(doc.userId.toString());
        if (raw) doc.userId = applySelect(wrapDoc('users', raw).toJSON());
    } else if (field === 'patientId' && doc.patientId) {
        const raw = collections.users.get(doc.patientId.toString());
        if (raw) doc.patientId = applySelect(wrapDoc('users', raw).toJSON());
    } else if (field === 'doctorId' && doc.doctorId) {
        const raw = collections.users.get(doc.doctorId.toString());
        if (raw) doc.doctorId = applySelect(wrapDoc('users', raw).toJSON());
    } else if (field === 'predictionId' && doc.predictionId) {
        const raw = collections.predictions.get(doc.predictionId.toString());
        if (raw) doc.predictionId = applySelect(wrapDoc('predictions', raw));
    } else if (field === 'doctorReview.doctorId' && doc.doctorReview?.doctorId) {
        const raw = collections.users.get(doc.doctorReview.doctorId.toString());
        if (raw) doc.doctorReview.doctorId = applySelect(wrapDoc('users', raw).toJSON());
    } else if (field === 'reviewRequest.sentToDoctorId' && doc.reviewRequest?.sentToDoctorId) {
        const raw = collections.users.get(doc.reviewRequest.sentToDoctorId.toString());
        if (raw) doc.reviewRequest.sentToDoctorId = applySelect(wrapDoc('users', raw).toJSON());
    }
}

// Query builder
class QueryBuilder {
    constructor(collectionName, filter = {}) {
        this.collectionName = collectionName;
        this.filter = filter;
        this._populateList = [];
        this._sort = null;
        this._skip = 0;
        this._limit = null;
        this._select = null;
        this._single = false;
    }

    populate(field, select) {
        this._populateList.push({ field, select });
        return this;
    }

    sort(sortObj) {
        this._sort = sortObj;
        return this;
    }

    skip(n) {
        this._skip = Number(n) || 0;
        return this;
    }

    limit(n) {
        this._limit = Number(n) || null;
        return this;
    }

    select(fields) {
        this._select = fields;
        return this;
    }

    async exec() {
        const rawItems = Array.from(collections[this.collectionName].values());
        let results = rawItems.filter(item => matchFilter(item, this.filter));

        if (this._sort) {
            const [sortKey, sortDir] = Object.entries(this._sort)[0] || [];
            if (sortKey) {
                results.sort((a, b) => {
                    const va = a[sortKey];
                    const vb = b[sortKey];
                    if (va < vb) return sortDir === -1 ? 1 : -1;
                    if (va > vb) return sortDir === -1 ? -1 : 1;
                    return 0;
                });
            }
        }

        if (this._skip) {
            results = results.slice(this._skip);
        }

        if (this._limit !== null) {
            results = results.slice(0, this._limit);
        }

        const wrapped = results.map(item => wrapDoc(this.collectionName, item));

        for (const doc of wrapped) {
            for (const pop of this._populateList) {
                await populateDoc(doc, pop.field, pop.select);
            }
            if (this._select) {
                const selectParts = this._select.split(' ');
                selectParts.forEach(sp => {
                    if (sp.startsWith('-')) {
                        delete doc[sp.slice(1)];
                    }
                });
            }
        }

        if (this._single) {
            return wrapped[0] || null;
        }

        return wrapped;
    }

    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }
}

// In-Memory Model factory
function createInMemoryModel(collectionName) {
    function Model(data = {}) {
        const _id = data._id ? new ObjectId(data._id) : new ObjectId();
        const doc = {
            _id,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data
        };
        return wrapDoc(collectionName, doc);
    }

    Model.find = function(filter = {}) {
        return new QueryBuilder(collectionName, filter);
    };

    Model.findOne = function(filter = {}) {
        const q = new QueryBuilder(collectionName, filter);
        q._single = true;
        return q;
    };

    Model.findById = function(id) {
        if (!id) {
            const q = new QueryBuilder(collectionName, { _id: '__non_existent__' });
            q._single = true;
            return q;
        }
        const q = new QueryBuilder(collectionName, { _id: id.toString ? id.toString() : String(id) });
        q._single = true;
        return q;
    };

    Model.countDocuments = async function(filter = {}) {
        const rawItems = Array.from(collections[collectionName].values());
        return rawItems.filter(item => matchFilter(item, filter)).length;
    };

    Model.deleteOne = async function(filter = {}) {
        const item = await Model.findOne(filter);
        if (item) {
            collections[collectionName].delete(item._id.toString());
            return { deletedCount: 1 };
        }
        return { deletedCount: 0 };
    };

    Model.aggregate = async function(pipeline = []) {
        const rawItems = Array.from(collections[collectionName].values());
        let current = [...rawItems];

        for (const stage of pipeline) {
            if (stage.$match) {
                current = current.filter(item => matchFilter(item, stage.$match));
            } else if (stage.$group) {
                const groups = new Map();
                const groupKey = stage.$group._id ? String(stage.$group._id).replace('$', '') : null;
                for (const item of current) {
                    const keyVal = groupKey ? item[groupKey] : null;
                    const existing = groups.get(keyVal) || { _id: keyVal, count: 0, confSum: 0 };
                    existing.count += 1;
                    existing.confSum += Number(item.confidence || 0);
                    groups.set(keyVal, existing);
                }
                current = Array.from(groups.values()).map(g => ({
                    _id: g._id,
                    count: g.count,
                    avgConfidence: g.count > 0 ? g.confSum / g.count : 0
                }));
            }
        }
        return current;
    };

    return Model;
}

module.exports = {
    ObjectId,
    collections,
    UserMemory: createInMemoryModel('users'),
    PredictionMemory: createInMemoryModel('predictions'),
    AppointmentMemory: createInMemoryModel('appointments')
};
