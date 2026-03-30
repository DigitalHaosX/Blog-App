/**
 * Site owner UID — set VITE_OWNER_UID in your .env file to the Firebase UID
 * of the account that should be able to delete any article.
 *
 * To find your UID: sign in, open browser devtools → Application → Firebase Auth
 * or copy it from the Firebase Console → Authentication → Users.
 */
export const OWNER_UID: string = import.meta.env.VITE_OWNER_UID ?? "";

/** Returns true if the given uid is allowed to delete the article. */
export function canDelete(uid: string | undefined, authorId: string): boolean {
  if (!uid) return false;
  return uid === authorId || (OWNER_UID.length > 0 && uid === OWNER_UID);
}
