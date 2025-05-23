"use strict";
// scripts/testing.ts
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config({ path: ".env.local" });
// --- SLIK VELGER DU TEST‐DATA — endre her: ---
var testData = {
    // Velg én av: "flom", "skred" eller "skogbrann"
    condition: "skogbrann",
    // Sett vindhastighet (km/t):
    windSpeed: 80,
    // Sett temperatur (°C):
    // (kun relevant for skogbrann, men må alltid oppgis)
    temperature: 35,
};
// ------------------------------------------------
var postgres_js_1 = require("drizzle-orm/postgres-js");
var postgres_1 = require("postgres");
var schemaWeather_js_1 = require("../db/schemaWeather.js");
var generateWeatherAlerts_js_1 = require("../lib/generateWeatherAlerts.js");
var url = process.env.DATABASE_URL;
if (!url)
    throw new Error("DATABASE_URL er ikke satt i .env.local");
console.log("🧪 Kobler til DB:", url);
console.log("🌦 Tester med data:", testData);
var client = (0, postgres_1.default)(url);
var db = (0, postgres_js_1.drizzle)(client);
function seedAndRun() {
    return __awaiter(this, void 0, void 0, function () {
        var fakeRow, alerts, _i, alerts_1, a, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 5]);
                    // 1) Seed i databasen
                    return [4 /*yield*/, db.insert(schemaWeather_js_1.weatherData).values(testData)];
                case 1:
                    // 1) Seed i databasen
                    _a.sent();
                    console.log("✅ Inserted:", testData);
                    fakeRow = __assign({ id: 0 }, testData);
                    alerts = (0, generateWeatherAlerts_js_1.generateWeatherAlerts)(fakeRow);
                    // 3) Vis resultatet
                    if (alerts.length === 0) {
                        console.log("ℹ️ Ingen varsler generert for denne kombinasjonen.");
                    }
                    else {
                        console.log("⚠️ Genererte varsler:");
                        for (_i = 0, alerts_1 = alerts; _i < alerts_1.length; _i++) {
                            a = alerts_1[_i];
                            console.log(" \u2022 ".concat(a.title, " [").concat(a.priority, "]: ").concat(a.description));
                        }
                    }
                    return [3 /*break*/, 5];
                case 2:
                    err_1 = _a.sent();
                    console.error("❌ SEED/TEST ERROR:", err_1);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, client.end()];
                case 4:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
seedAndRun();
