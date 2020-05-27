
# SafetyNet for React Native

[![GitHub version](https://badge.fury.io/gh/rajivshah3%2Freact-native-google-safetynet.svg)](https://badge.fury.io/gh/rajivshah3%2Freact-native-google-safetynet) [![Maintainability](https://api.codeclimate.com/v1/badges/dfa536260a3131540826/maintainability)](https://codeclimate.com/github/rajivshah3/react-native-google-safetynet/maintainability)
[![Build Status](https://app.bitrise.io/app/6a320b4cec355721/status.svg?token=CsqSRP-i2_BC8a2ne-7-pw&branch=develop)](https://app.bitrise.io/app/6a320b4cec355721)


## About SafetyNet
Google provides an API to verify device integrity and detect harmful apps. See the [SafetyNet documentation](https://developer.android.com/training/safetynet/index.html) for more information.

## Getting started

`$ npm install react-native-google-safetynet --save`

or

`$ yarn add react-native-google-safetynet`

### Mostly automatic installation

`$ react-native link react-native-google-safetynet`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.rajivshah.safetynet.RNGoogleSafetyNetPackage;` to the imports at the top of the file
  - Add `new RNGoogleSafetyNetPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-google-safetynet'
  	project(':react-native-google-safetynet').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-google-safetynet/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-google-safetynet')
  	```


## Usage

See the full documentation [here](https://rajivshah3.github.io/react-native-google-safetynet/)

```javascript
import RNGoogleSafetyNet from 'react-native-google-safetynet';

// TODO: What to do with the module?
```
