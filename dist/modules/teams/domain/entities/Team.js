"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
class Team {
    constructor(id, name, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.validateName(name);
    }
    validateName(name) {
        if (!name || name.trim().length === 0) {
            throw new Error("Team name cannot be empty");
        }
        if (name.length > 100) {
            throw new Error("Team name cannot exceed 100 characters");
        }
    }
    getName() {
        return this.name;
    }
    updateName(name) {
        this.validateName(name);
        this.name = name;
    }
    toObject() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.Team = Team;
//# sourceMappingURL=Team.js.map