
package com.rajivshah.safetynet;

import androidx.annotation.NonNull;
import android.app.Activity;
import android.util.Log;
import android.util.Base64;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;

//import com.google.android.gms.common.api.ApiException;
//import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.safetynet.SafetyNet;
import com.google.android.gms.safetynet.SafetyNetApi;
import com.google.android.gms.safetynet.SafetyNetApi.*;
import com.google.android.gms.safetynet.HarmfulAppsData;
//import com.google.android.gms.safetynet.SafetyNetClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnCompleteListener;
//import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.tasks.Task;

import java.io.IOException;
import java.util.List;
import java.nio.charset.StandardCharsets;
import java.lang.IllegalArgumentException;
import java.lang.Error;

public class RNGoogleSafetyNetModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private final ReactApplicationContext baseContext;
  private final Activity activity;

  public RNGoogleSafetyNetModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.baseContext = getReactApplicationContext();
    this.activity = getCurrentActivity();
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
  public void isPlayServicesAvailable(final Promise promise){
    ConnectionResult result = new ConnectionResult(GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(baseContext));
    if (result.isSuccess()){
      promise.resolve(true);
    }
    else {
      promise.reject(result.getErrorMessage());
    }
  }

  /**
   * Send a request to the SafetyNet Attestation API
   * See https://developer.android.com/training/safetynet/attestation.html#compat-check-request
   * @param nonceString
   * @param apiKey
   * @param promise
   */
  @ReactMethod
  public void sendAttestationRequest(String nonceString, String apiKey, final Promise promise){
    byte[] nonce;
    Activity activity;
    nonce = stringToBytes(nonceString);
    activity = getCurrentActivity();
    SafetyNet.getClient(baseContext).attest(nonce, apiKey)
    .addOnSuccessListener(activity,
    new OnSuccessListener<SafetyNetApi.AttestationResponse>() {
      @Override
      public void onSuccess(SafetyNetApi.AttestationResponse response) {
        String result = response.getJwsResult();
        promise.resolve(result);
      }
    })
    .addOnFailureListener(activity, new OnFailureListener() {
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
  public void isVerificationEnabled(final Promise promise){
    SafetyNet.getClient(baseContext)
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
  public void requestVerification(final Promise promise){
    SafetyNet.getClient(baseContext)
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
  public void getHarmfulApps(final Promise promise){
    SafetyNet.getClient(baseContext)
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
                        WritableMap app = new WritableNativeMap();
                        app.putString("apkPackageName", harmfulApp.apkPackageName);
                        app.putString("apkSha256", harmfulApp.apkSha256.toString());
                        app.putInt("apkCategory", harmfulApp.apkCategory);
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

  private byte[] stringToBytes(String string) {
    byte[] bytes;
    bytes = null;
    try {
      bytes = Base64.decode(string, Base64.DEFAULT);
    } catch(IllegalArgumentException e) {
      e.printStackTrace();
    }
    return bytes;
  }

  private String bytesToString(byte[] bytes) {
    String string;
    string = new String(bytes, StandardCharsets.UTF_8);
    return string;
  }

}
