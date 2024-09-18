import CryptoJS from "crypto-js";

function base64URL(string: any) {
  return string
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getVerifier() {
  var rand = new Uint8Array(32);
  crypto.getRandomValues(rand);
  var code_verifier = base64URL(CryptoJS.lib.WordArray.create(rand));
  return code_verifier;
}

function generateCodeChallenge(code_verifier: any) {
  return base64URL(CryptoJS.SHA256(code_verifier));
}

const verifier = getVerifier();
const challenge = generateCodeChallenge(verifier);

export default {
  verifier: verifier,
  challenge: challenge,
};
