
package com.rajivshah.safetynet;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WriteableArray;
import com.facebook.react.bridge.WriteableNativeArray;
import com.facebook.react.bridge.WriteableMap;
import com.facebook.react.bridge.WriteableNativeMap;

import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.safetynet.SafetyNet;
import com.google.android.gms.safetynet.SafetyNetApi;
import com.google.android.gms.safetynet.SafetyNetClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class RNGoogleSafetyNetModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNGoogleSafetyNetModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNGoogleSafetyNet";
  }

  /**
  * Checks if Google Play Services is available and up to date
  * See https://developers.google.com/android/reference/com/google/android/gms/common/GoogleApiAvailability
  * @param promise
  */
  @ReactMethod
  public void isPlayServicesAvailable(Promise promise){
    ConnectionResult result = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(context);
    if (result.isSuccess()){
      promise.resolve(result.toString());
    }
    else {
      promise.reject(result.getErrorMessage());
    }
  }

  /**
   * Send a request to the SafetyNet Attestation API
   * See https://developer.android.com/training/safetynet/attestation.html#compat-check-request
   * @param nonce
   * @param apiKey
   * @param promise
   */
  @ReactMethod
  public void sendAttestationRequest(byte[] nonce, String apiKey, Promise promise){
    SafetyNet.getClient(this).attest(nonce, apiKey)
    .addOnSuccessListener(this,
    new OnSuccessListener<SafetyNetApi.AttestationResponse>() {
      @Override
      public void onSuccess(SafetyNetApi.AttestationResponse response) {
        promise.resolve(nonce, response.getJwsResult());
      }
    })
    .addOnFailureListener(this, new OnFailureListener() {
      @Override
      public void onFailure(@NonNull Exception e) {
        promise.reject(e);
      }
    });
  }

  /**
   * Checks if Verify Apps is enabled on the user's device
   * See https://developer.android.com/training/safetynet/verify-apps.html#determine-verification-enabled
   * @param promise
   */
  @ReactMethod
  public void isVerificationEnabled(Promise promise){
    SafetyNet.getClient(this)
    .isVerifyAppsEnabled()
    .addOnCompleteListener(new OnCompleteListener<VerifyAppsUserResponse>() {
        @Override
        public void onComplete(Task<VerifyAppsUserResponse> task) {
            if (task.isSuccessful()) {
                VerifyAppsUserResponse result = task.getResult();
                promise.resolve(result.isVerifyAppsEnabled());
            } else {
                promise.reject("Error");
            }
        }
    });

  }

  /**
   * Asks the user to enable Verify Apps
   * If already enabled, the dialog will not appear
   * See https://developer.android.com/training/safetynet/verify-apps.html#request-verification-enabled
   * @param promise
   */
  @ReactMethod
  public void requestVerification(Promise promise){
    SafetyNet.getClient(this)
    .enableVerifyApps()
    .addOnCompleteListener(new OnCompleteListener<VerifyAppsUserResponse>() {
        @Override
        public void onComplete(Task<VerifyAppsUserResponse> task) {
            if (task.isSuccessful()) {
                VerifyAppsUserResponse result = task.getResult();
                if (result.isVerifyAppsEnabled()) {
                    promise.resolve("Success");
                } else {
                    promise.resolve("Failed");
                }
            } else {
                promise.reject("Error");
            }
        }
    });
  }

  /**
   * Lists harmful apps
   * See https://developer.android.com/training/safetynet/verify-apps.html#listing
   * @param promise
   */
  @ReactMethod
  public void getHarmfulApps(Promise promise){
    SafetyNet.getClient(this)
    .listHarmfulApps()
    .addOnCompleteListener(new OnCompleteListener<HarmfulAppsResponse>() {
        @Override
        public void onComplete(Task<HarmfulAppsResponse> task) {

            if (task.isSuccessful()) {
                HarmfulAppsResponse result = task.getResult();
                List<HarmfulAppsData> appList = result.getHarmfulAppsList();

                if (appList.isEmpty()) {
                    promise.resolve("No harmful apps installed");
                } else {
                    WritableArray appArray = new WritableNativeArray();
                    for (HarmfulAppsData harmfulApp : appList) {
                        WriteableMap app = new WriteableNativeMap();
                        app.putString("apkPackageName", harmfulApp.apkPackageName);
                        app.putString("apkSha256", harmfulApp.apkSha256);
                        app.putString("apkCategory", harmfulApp.apkCategory);
                        appArray.pushMap(app);
                    }
                    promise.resolve(appArray);
                }
            } else {
                promise.reject("Error");
            }
        }
    });
  }

}
