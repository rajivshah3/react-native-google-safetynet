
import { NativeModules } from 'react-native';
import { generateSecureRandom } from 'react-native-securerandom';

const { RNGoogleSafetyNet } = NativeModules;


export const isPlayServicesAvailable = () => {
  return RNGoogleSafetyNet.isPlayServicesAvailable();
}

/**
 * Generate the nonce using react-native-securerandom
 * @param  {int} length
 * @param  {Promise} promise
 * @param  {Uint8Array}
 */
export const generateNonce = (length) => {
  return generateSecureRandom(length);
}

/**
 * Send the attestation request
 * @param  {Uint8Array} nonce   Randomly generated nonce
 * @param  {String} apiKey  API key from Google APIs
 * @return {Promise}
 */
export const sendAttestationRequest = (nonce, apiKey) => {
  return RNGoogleSafetyNet.sendAttestationRequest(nonce, apiKey);
}




export default RNGoogleSafetyNet;
