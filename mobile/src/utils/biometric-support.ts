import ReactNativeBiometrics from "react-native-biometrics";

export const isBiometricSupported = async () => {
  const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable();
  
  // return available && biometryType === ReactNativeBiometrics.TouchID ? true : false;
};
