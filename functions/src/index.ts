/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import functions = require("firebase-functions");
import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");

admin.initializeApp();

export const initializeNewUser = functions.auth.user().onCreate((user) => {
  logger.info("New user created", user);

  admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    name: user.displayName,
    photoURL: user.photoURL,
  });
});
