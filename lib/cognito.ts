// Client-side AWS Cognito wrapper (amazon-cognito-identity-js).
// Custom sign-up / confirm / sign-in pages use these. The pool must allow
// email as the sign-in identifier.

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

function pool(): CognitoUserPool {
  const UserPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const ClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  if (!UserPoolId || !ClientId) {
    throw new Error(
      "Cognito is not configured. Set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID.",
    );
  }
  return new CognitoUserPool({ UserPoolId, ClientId });
}

function user(email: string): CognitoUser {
  return new CognitoUser({ Username: email, Pool: pool() });
}

export function signUp(email: string, password: string, name: string): Promise<void> {
  const attrs = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "name", Value: name }),
  ];
  return new Promise((resolve, reject) => {
    pool().signUp(email, password, attrs, [], (err) => (err ? reject(err) : resolve()));
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    user(email).confirmRegistration(code, true, (err) => (err ? reject(err) : resolve()));
  });
}

export function resendCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    user(email).resendConfirmationCode((err) => (err ? reject(err) : resolve()));
  });
}

/** Returns the Cognito ID token (JWT) on success. */
export function signIn(email: string, password: string): Promise<string> {
  const details = new AuthenticationDetails({ Username: email, Password: password });
  const u = user(email);
  return new Promise((resolve, reject) => {
    u.authenticateUser(details, {
      onSuccess: (session) => resolve(session.getIdToken().getJwtToken()),
      onFailure: (err) => reject(err),
      // If the pool forces a new password, surface a clear error.
      newPasswordRequired: () =>
        reject(new Error("A new password is required for this account. Contact support.")),
    });
  });
}

export function signOutLocal(): void {
  pool().getCurrentUser()?.signOut();
}
