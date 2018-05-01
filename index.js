/* eslint-disable import/no-unresolved */
import { NativeModules } from 'react-native';
/* eslint-enable import/no-unresolved */
import { generateSecureRandom } from 'react-native-securerandom';

const { RNGoogleSafetyNet } = NativeModules;
const base64js = require('base64-js');
const jws = require('jws');

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
  return generateSecureRandom(length).then((nonce) => {
    const nonceString = base64js.fromByteArray(nonce);
    return nonceString;
  });
}

/**
 * Send the attestation request
 * @method sendAttestationRequest
 * @param  {String} nonce   Randomly generated nonce
 * @param  {String} apiKey  API key from Google APIs
 * @return {Promise}
 */
export function sendAttestationRequest(nonce, apiKey) {
  return RNGoogleSafetyNet.sendAttestationRequest(nonce, apiKey).then((result) => {
    const decodedResult = jws.decode(result);
    return decodedResult;
  });
}

/**
 * Verify the attestation response
 * Checks if the original nonce matches the nonce in the response, ctsProfileMatch is true, and basicIntegrity is true
 * If any of those conditions are not met, an error is thrown
 * @method verifyAttestationResponse
 * @param  {String} originalNonce    Nonce originally provided to sendAttestationRequest
 * @param  {Object} response Response from sendAttestationRequest
 * @param {String} response.nonce Nonce in response from sendAttestationRequest
 * @param {bool} response.ctsProfileMatch Device matches a device that has passed Android Compatibility Testing
 * @param {bool} response.basicIntegrity Device has not been tampered with
 * @return {Promise}
 */
export function verifyAttestationResponse(originalNonce, response) {
  const decodedResponse = JSON.parse(response.payload);
  if (originalNonce === decodedResponse.nonce && decodedResponse.ctsProfileMatch && decodedResponse.basicIntegrity) {
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
}

/**
 * Wrapper for sendAttestationRequest and verifyAttestationResponse
 * @method sendAndVerifyAttestation
 * @param  {String} nonce  Randomly generated nonce
 * @param  {String} apiKey API key from Google APIs
 * @return {Promise}
 */
export function sendAndVerifyAttestation(nonce, apiKey) {
  return sendAttestationRequest(nonce, apiKey)
    .then((response) => verifyAttestationResponse(nonce, response))
    .catch((e) => e);
}

export default RNGoogleSafetyNet;
