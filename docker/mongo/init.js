// MongoDB initialization script
// This script runs when the database is first created

db = db.getSiblingDB('file-storage');

// Create collections with validation
db.createCollection('files', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['owner', 'filename', 'originalName', 'mimeType', 'size', 'path'],
            properties: {
                owner: { bsonType: 'string' },
                filename: { bsonType: 'string' },
                originalName: { bsonType: 'string' },
                mimeType: { bsonType: 'string' },
                size: { bsonType: 'number' },
                path: { bsonType: 'string' },
                folderId: { bsonType: ['objectId', 'null'] },
                deletedAt: { bsonType: ['date', 'null'] }
            }
        }
    }
});

db.createCollection('folders', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['owner', 'name', 'path'],
            properties: {
                owner: { bsonType: 'string' },
                name: { bsonType: 'string' },
                path: { bsonType: 'string' },
                parentId: { bsonType: ['objectId', 'null'] },
                deletedAt: { bsonType: ['date', 'null'] }
            }
        }
    }
});

db.createCollection('shares', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['fileId', 'token'],
            properties: {
                fileId: { bsonType: 'objectId' },
                token: { bsonType: 'string' },
                expiresAt: { bsonType: ['date', 'null'] },
                isRevoked: { bsonType: 'bool' },
                downloadCount: { bsonType: 'number' }
            }
        }
    }
});

db.createCollection('apikeys');

// Create indexes for files collection
db.files.createIndex({ owner: 1, folderId: 1 });
db.files.createIndex({ shareToken: 1 });
db.files.createIndex({ deletedAt: 1 });

// Create indexes for folders collection
db.folders.createIndex({ owner: 1, parentId: 1 });
db.folders.createIndex({ deletedAt: 1 });
db.folders.createIndex({ owner: 1, name: 1, parentId: 1 }, { unique: true });

// Create indexes for shares collection
db.shares.createIndex({ token: 1 }, { unique: true });
db.shares.createIndex({ fileId: 1 });
db.shares.createIndex({ expiresAt: 1 });
db.shares.createIndex({ isRevoked: 1 });

print('Database initialized successfully!');
