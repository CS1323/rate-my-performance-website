import bcrypt from "bcryptjs";

/**
 * Hashes an IP address using bcrypt.
 * This ensures anonymity while preventing repeated voting from the same IP.
 * @param {string} ip - The user's IP address.
 * @returns {Promise<string>} - The hashed IP.
 */
export const hashIp = async (ip) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(ip, salt);
  return hashed;
}
