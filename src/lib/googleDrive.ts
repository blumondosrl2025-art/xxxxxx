import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Workspace Drive scope which was approved by the user
provider.addScope('https://www.googleapis.com/auth/drive');

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token in memory.
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Google Drive API Helpers
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
}

/**
 * List shop backups and image assets in Google Drive
 */
export const listDriveFiles = async (token: string, searchWord?: string): Promise<DriveFile[]> => {
  try {
    // We search for our custom JSON schema files or general images
    let query = "(mimeType = 'application/json' and name contains 'shop_schema') or mimeType startswith 'image/'";
    if (searchWord) {
      query = `(${query}) and name contains '${searchWord}'`;
    }
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,modifiedTime,size,thumbnailLink)&orderBy=modifiedTime desc`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      const errDetail = await res.text();
      throw new Error(`Google Drive list failed: ${res.statusText} (${errDetail})`);
    }
    
    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error('listDriveFiles error:', error);
    throw error;
  }
};

/**
 * Upload storefront schema backup to Google Drive
 */
export const uploadBackupToDrive = async (token: string, schema: any, fileName: string): Promise<DriveFile> => {
  try {
    const boundary = 'foo_bar_baz_boundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType: 'application/json',
      description: 'AI 一句话开店 网页设计 JSON 备份',
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(schema, null, 2)
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      media.body +
      closeDelimiter;

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const errDetail = await res.text();
      throw new Error(`Google Drive upload failed: ${res.statusText} (${errDetail})`);
    }

    return await res.json();
  } catch (error) {
    console.error('uploadBackupToDrive error:', error);
    throw error;
  }
};

/**
 * Download schema JSON file content
 */
export const downloadBackupFromDrive = async (token: string, fileId: string): Promise<any> => {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error(`Google Drive download media failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('downloadBackupFromDrive error:', error);
    throw error;
  }
};

/**
 * Sync / select an image from Google Drive.
 * Note: Direct image files from Google Drive need to be read or referenced. 
 * If they are not public, we can fetch their base64 representation or use webContentLink.
 */
export const getDriveFileMetadata = async (token: string, fileId: string): Promise<any> => {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webContentLink,thumbnailLink,mimeType`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error(`Google Drive get metadata failed: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('getDriveFileMetadata error:', error);
    throw error;
  }
};
