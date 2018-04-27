/* eslint-disable import/no-unresolved */
import { NativeModules } from 'react-native';
/* eslint-enable import/no-unresolved */
import { generateSecureRandom } from 'react-native-securerandom';
import { Utf8ArrayToStr } from './src/utils';

const { RNGoogleSafetyNet } = NativeModules;

/**
 * Checks if Google Play Services is available and up to date
 * @method isPlayServicesAvailable
 * @return {Promise}
 */
export function isPlayServicesAvailable() {
  return RNGoogleSafetyNet.isPlayServicesAvailable();
}

/**
 * Generate the nonce using react-native-securerandom
 * @method generateNonce
 * @param  {int} length
 * @return  {Promise}
 */
export function generateNonce(length) {
  return generateSecureRandom(length).then(nonce => {
    const nonceString = nonce.toString();
    return nonceString;
  });
}

/**
 * Send the attestation request
 * @method sendAttestationRequest
 * @param  {Uint8Array} nonce   Randomly generated nonce
 * @param  {String} apiKey  API key from Google APIs
 * @return {Promise}
 */
export function sendAttestationRequest(nonce, apiKey) {
  return RNGoogleSafetyNet.sendAttestationRequest(nonce, apiKey);
}

/**
 * Verify the attestation response
 * Checks if the original nonce matches the nonce in the response, ctsProfileMatch is true, and basicIntegrity is true
 * If any of those conditions are not met, an error is thrown
 * @method verifyAttestationResponse
 * @param  {Uint8Array} originalNonce    Nonce originally provided to sendAttestationRequest
 * @param  {Object} response Response from sendAttestationRequest
 * @param {String} response.nonce Nonce in response sendAttestationRequest
 * @param {bool} response.ctsProfileMatch Device matches a device that has passed Android Compatibility Testing
 * @param {bool} response.basicIntegrity Device has not been tampered with
 * @return {Promise}
 * @throws {Error}
 */
export function verifyAttestationResponse(originalNonce, response) {
  const nonceString = Utf8ArrayToStr(originalNonce);
  if (nonceString === response.nonce && response.ctsProfileMatch && response.basicIntegrity) {
    return Promise.resolve();
  }
  throw new Error('Verification failed');
}

/**
 * Wrapper for sendAttestationRequest and verifyAttestationResponse
 * @method sendAndVerifyAttestation
 * @param  {Uint8Array} nonce  Randomly generated nonce
 * @param  {String} apiKey API key from Google APIs
 * @return {Promise}
 * @throws {Error}
 */
export function sendAndVerifyAttestation(nonce, apiKey) {
  return sendAttestationRequest(nonce, apiKey)
    .then(response => verifyAttestationResponse(nonce, response))
    .catch(e => e);
}

export default RNGoogleSafetyNet;
