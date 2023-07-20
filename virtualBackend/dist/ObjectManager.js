"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectManager = void 0;
class ObjectManager {
    static instance = new ObjectManager();
    static getInstance() {
        return this.instance;
    }
    objectTable;
    constructor() {
        this.objectTable = new Map();
    }
    registerObjectIfNotExists(name, object) {
        if (this.objectTable.has(name))
            return;
        this.registerObject(name, object);
    }
    registerObject(name, object) {
        this.objectTable.set(name, object);
    }
    getObject(name) {
        return this.objectTable.get(name);
    }
}
exports.ObjectManager = ObjectManager;
