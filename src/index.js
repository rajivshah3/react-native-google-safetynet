
import { NativeModules } from 'react-native';
import { generateSecureRandom } from 'react-native-securerandom';
import { Utf8ArrayToStr } from './utils';

const { RNGoogleSafetyNet } = NativeModules;

/**
 * Checks if Google Play Services is available and up to date
 * @return {Promise}
 */
export const isPlayServicesAvailable = () => {
  return RNGoogleSafetyNet.isPlayServicesAvailable();
};

/**
 * Generate the nonce using react-native-securerandom
 * @param  {int} length
 * @return  {Promise}
 */
export const generateNonce = (length) => {
  return generateSecureRandom(length);
};

/**
 * Send the attestation request
 * @param  {Uint8Array} nonce   Randomly generated nonce
 * @param  {String} apiKey  API key from Google APIs
 * @return {Promise}
 */
export const sendAttestationRequest = (nonce, apiKey) => {
  return RNGoogleSafetyNet.sendAttestationRequest(nonce, apiKey);
};

/**
 * Verify the attestation response
 * Checks if the original nonce matches the nonce in the response, ctsProfileMatch is true, and basicIntegrity is true
 * If any of those conditions are not met, an error is thrown
 * @param  {Uint8Array} nonce    Nonce originally provided to sendAttestationRequest
 * @param  {Object} response Response from sendAttestationRequest
 * @return {Promise | Error}
 */
export const verifyAttestationResponse = (nonce, response) => {
  const nonceString = Utf8ArrayToStr(nonce);
  if (nonceString === response.nonce && response.ctsProfileMatch && response.basicIntegrity) {
    return Promise.resolve();
  }
  else {
    throw new Error("Verification failed");
  }
};

/**
 * Wrapper for sendAttestationRequest and verifyAttestationResponse
 * @param  {Uint8Array} nonce  Randomly generated nonce
 * @param  {String} apiKey API key from Google APIs
 * @return {Promise | Error}
 */
export const sendAndVerifyAttestation = (nonce, apiKey) => {
  return sendAttestationRequest(nonce, apiKey)
    .then((originalNonce, response) => {
      return verifyAttestationResponse(originalNonce, response);
    }
    .catch((e) => {
      return e;
    });
};

export default RNGoogleSafetyNet;
