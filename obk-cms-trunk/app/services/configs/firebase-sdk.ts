// This one for Fierbase admin SDK
export const configs = {
  type: process.env.FIREBASE_ADMIN_SDK_TYPE,
  project_id: process.env.FIREBASE_ADMIN_SDK_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  ),
  client_email: process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_SDK_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_SDK_AUTH_URI,
  token_uri: process.env.FIREBASE_ADMIN_SDK_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_SDK_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_SDK_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_ADMIN_SDK_UNIVERAL_DOMAIN,
}

// This one for Firebase SDK
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_SDK_API_KEY,
  authDomain: process.env.FIREBASE_SDK_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_SDK_PROJECT_ID,
  storageBucket: process.env.FIREBASE_SDK_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SDK_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_SDK_APP_ID,
  measurementId: process.env.FIREBASE_SDK_MEASUREMENT_ID,
}
