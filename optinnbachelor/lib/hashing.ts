import crypto from 'crypto'


export function hashPassword(password: string, salt: string = crypto.randomBytes(16).toString("hex")) {
  const hashed = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hashed, salt };
}
export function verifyPassword(password: string, salt: string, hashedPassword: string) {
  const { hashed } = hashPassword(password, salt);
  return hashed === hashedPassword;
}
