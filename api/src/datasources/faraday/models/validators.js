/**
 * JSON Schema validators
 */

module.exports = {
  SHORT_STRING: { type: "string", minLength: 1, maxLength: 16 },
  MEDIUM_STRING: { type: "string", minLength: 1, maxLength: 64 },
  LONG_STRING: { type: "string", minLength: 1, maxLength: 255 },
  ID: { type: "integer", minimum: 1 }
};
