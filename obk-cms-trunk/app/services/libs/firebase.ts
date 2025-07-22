import admin from 'firebase-admin'
import { configs, firebaseConfig } from '../configs/firebase-sdk'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const initialConfig = {
  credential: admin.credential.cert({
    projectId: configs.project_id,
    clientEmail: configs.client_email,
    privateKey: configs.private_key,
  }),
}
// This is for Firebase admin
export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(initialConfig)

// This is for Firebase SDK
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
