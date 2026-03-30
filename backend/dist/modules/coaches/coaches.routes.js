"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coachesController = __importStar(require("./coaches.controller"));
const auth_1 = require("../../middleware/auth");
const rbac_1 = require("../../middleware/rbac");
const validate_1 = require("../../middleware/validate");
const branchScope_1 = require("../../middleware/branchScope");
const coaches_schema_1 = require("./coaches.schema");
const router = (0, express_1.Router)();
// Apply auth and branch scoping to all routes here
router.use(auth_1.authenticate);
router.use((0, rbac_1.authorize)(['SUPER_ADMIN', 'STAFF', 'coaches:full']));
router.use(branchScope_1.branchScope);
router.get('/', coachesController.getAllCoaches);
router.get('/:id', coachesController.getCoachById);
router.post('/', (0, validate_1.validate)(coaches_schema_1.createCoachSchema), coachesController.createCoach);
router.put('/:id', (0, validate_1.validate)(coaches_schema_1.updateCoachSchema), coachesController.updateCoach);
router.delete('/:id', coachesController.deleteCoach);
router.post('/:id/assign-students', (0, validate_1.validate)(coaches_schema_1.assignStudentsSchema), coachesController.assignStudents);
router.delete('/:id/unassign-student/:studentId', coachesController.unassignStudent);
exports.default = router;
