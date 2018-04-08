
# react-native-google-safetynet

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
```javascript
import RNGoogleSafetyNet from 'react-native-google-safetynet';

// TODO: What to do with the module?
```
