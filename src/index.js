
import { NativeModules } from 'react-native';
import { generateSecureRandom } from 'react-native-securerandom';
import { Utf8ArrayToStr } from './utils';

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
  return generateSecureRandom(length);
};

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
 * @param  {Uint8Array} nonce    Nonce originally provided to sendAttestationRequest
 * @param  {Object} response Response from sendAttestationRequest
 * @return {Promise | Error}
 */
export function verifyAttestationResponse(nonce, response) {
  const nonceString = Utf8ArrayToStr(nonce);
  if (nonceString === response.nonce && response.ctsProfileMatch && response.basicIntegrity) {
    return Promise.resolve();
  }
  else {
    throw new Error("Verification failed");
  }
}

/**
 * Wrapper for sendAttestationRequest and verifyAttestationResponse
 * @method sendAndVerifyAttestation
 * @param  {Uint8Array} nonce  Randomly generated nonce
 * @param  {String} apiKey API key from Google APIs
 * @return {Promise | Error}
 */
export function sendAndVerifyAttestation(nonce, apiKey) {
  return sendAttestationRequest(nonce, apiKey)
    .then(function(originalNonce, response) {
      return verifyAttestationResponse(originalNonce, response);
    })
    .catch(function(e) {
      return e;
    });
};

export default RNGoogleSafetyNet;
