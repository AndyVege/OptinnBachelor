"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeatherAlerts = generateWeatherAlerts;
// lib/generateWeatherAlerts.ts
var weatherAlertsConfig_1 = require("./weatherAlertsConfig");
function generateWeatherAlerts(item) {
    var _a, _b, _c;
    var alerts = [];
    // Bruk fallback dersom feltet er null
    var cond = (_b = (_a = item.condition) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    var wind = item.windSpeed;
    var temp = (_c = item.temperature) !== null && _c !== void 0 ? _c : 0;
    for (var _i = 0, WEATHER_ALERTS_CONFIG_1 = weatherAlertsConfig_1.WEATHER_ALERTS_CONFIG; _i < WEATHER_ALERTS_CONFIG_1.length; _i++) {
        var cfg = WEATHER_ALERTS_CONFIG_1[_i];
        if (!cond.includes(cfg.keyword))
            continue;
        // Calculate wind-based level
        var level = void 0;
        if (wind >= cfg.thresholds.high)
            level = "high";
        else if (wind >= cfg.thresholds.medium)
            level = "medium";
        else
            level = "low";
        // For skogbrann: vurder også temperatur
        if ("temperature" in cfg.thresholds) {
            var th = cfg.thresholds.temperature;
            var lvlT = temp >= th.high ? "high" : temp >= th.medium ? "medium" : "low";
            // Bruk det høyeste nivået
            if ((lvlT === "high" && level !== "high") ||
                (lvlT === "medium" && level === "low")) {
                level = lvlT;
            }
        }
        var idx = level === "high" ? 3 : level === "medium" ? 2 : 1;
        alerts.push({
            title: "".concat(cfg.name, " \u2013 niv\u00E5 ").concat(idx),
            description: cfg.descriptions[level],
            priority: level,
            category: "Vær",
        });
    }
    return alerts;
}
