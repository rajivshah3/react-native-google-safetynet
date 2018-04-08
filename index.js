
import { NativeModules } from 'react-native';
import { generateSecureRandom } from 'react-native-securerandom';

const { RNGoogleSafetyNet } = NativeModules;


export const isPlayServicesAvailable = (promise) => {
  return RNGoogleSafetyNet.isPlayServicesAvailable()
  .then((result) => promise.resolve(result))
  .catch((error) => promise.reject(error));
}

/**
 * Generate the nonce using react-native-securerandom
 * @param  {int} length
 * @param  {Promise} promise
 * @param  {Promise}
 */
export const generateNonce = (length, promise) => {
  return generateSecureRandom(length).then((randomBytes) => promise.resolve(randomBytes));
}

/**
 * Send the attestation request
 * @param  {Uint8Array} nonce   Randomly generated nonce
 * @param  {String} apiKey  API key from Google APIs
 * @param  {Promise} promise
 * @return {Promise}
 */
export const sendAttestationRequest = (nonce, apiKey, promise) => {
  return RNGoogleSafetyNet.sendAttestationRequest(nonce, apiKey)
  .then((response) => promise.resolve(response))
  .catch((error) => promise.reject(error));
}




export default RNGoogleSafetyNet;
