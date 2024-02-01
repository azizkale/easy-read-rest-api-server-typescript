"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hatimcontrollers_1 = __importDefault(require("./hatimcontrollers"));
const body_parser_1 = __importDefault(require("body-parser"));
const checkTokenExpiration_1 = __importDefault(require("../../functions/checkTokenExpiration"));
const role_check_1 = __importDefault(require("../../functions/role_check"));
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.post('/hatim/create', role_check_1.default, hatimcontrollers_1.default.createHatim);
router.get('/hatim/retrieve', checkTokenExpiration_1.default, hatimcontrollers_1.default.retrieveHatim);
router.get('/hatim/retrievesinglecuz', checkTokenExpiration_1.default, hatimcontrollers_1.default.getSingleCuz);
router.delete('/hatim/delete', checkTokenExpiration_1.default, hatimcontrollers_1.default.deleteHatim);
router.patch('/hatim/update', checkTokenExpiration_1.default, hatimcontrollers_1.default.updateHatim);
router.get('/hatim/getReaderName', checkTokenExpiration_1.default, hatimcontrollers_1.default.getReaderName);
router.get('/hatim/getAnotherReadersName', checkTokenExpiration_1.default, hatimcontrollers_1.default.getNameOfAnotherUsers);
exports.default = router;
