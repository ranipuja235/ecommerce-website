"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promo_controller_1 = require("../controllers/promo.controller");
const router = express_1.default.Router();
router.post('/validate', promo_controller_1.validatePromo);
exports.default = router;
//# sourceMappingURL=promo.routes.js.map