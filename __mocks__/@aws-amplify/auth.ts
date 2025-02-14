import { jest } from "@jest/globals";

export const signOut = jest.fn();
export const signUp = jest.fn();
export const signIn = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    nextStep: {
      signInStep: "DONE",
    },
  });
});
export const confirmSignUp = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    isSignedIn: true,
    nextStep: {
      signUpStep: "COMPLETE_AUTO_SIGN_IN",
    },
  });
});
export const autoSignIn = jest.fn();
export const resetPassword = jest.fn();
export const confirmResetPassword = jest.fn();
