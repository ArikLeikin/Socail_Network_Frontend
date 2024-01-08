"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path = require("path");
const clientKey = process.cwd() + "/client-key.pem";
const clientCert = process.cwd() + "/client-cert.pem";
(0, app_1.default)().then((app) => {
    if (process.env.NODE_ENV !== "production") {
        console.log("development");
        http_1.default.createServer(app).listen(process.env.PORT);
    }
    const options = {
        key: fs_1.default.readFileSync(clientKey),
        cert: fs_1.default.readFileSync(clientCert),
    };
    https_1.default.createServer(options, app).listen(process.env.HTTPS_PORT);
});
//# sourceMappingURL=server.js.map