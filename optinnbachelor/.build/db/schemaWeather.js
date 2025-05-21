"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherData = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.weatherData = (0, pg_core_1.pgTable)("weather_data", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    temperature: (0, pg_core_1.integer)("temperature"),
    windSpeed: (0, pg_core_1.integer)("windSpeed").notNull(),
    condition: (0, pg_core_1.text)("condition"),
    priority: (0, pg_core_1.text)("priority")
});
