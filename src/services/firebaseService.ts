import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { ForensicReport } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use explicit database ID if present in config
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

/**
 * Initialize anonymous inspector session automatically if not logged in
 */
export async function initAuthSession(): Promise<User | null> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const anonCred = await signInAnonymously(auth);
          resolve(anonCred.user);
        } catch (err) {
          console.warn('Anonymous auth fallback:', err);
          resolve(null);
        }
      }
    });
  });
}

/**
 * Save forensic report to Cloud Firestore
 */
export async function saveReportToFirestore(report: ForensicReport): Promise<string> {
  try {
    const user = auth.currentUser;
    const userId = user ? user.uid : 'guest_inspector';
    const shareId = report.shareId || 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

    const reportRef = doc(db, 'reports', report.id);
    const updatedReport = {
      ...report,
      shareId,
      cloudSaved: true,
      userId,
      savedAt: new Date().toISOString()
    };

    // Serialize report object as Firestore doc
    await setDoc(reportRef, {
      id: updatedReport.id,
      fileName: updatedReport.fileName,
      durationSeconds: updatedReport.durationSeconds,
      verdict: updatedReport.verdict,
      overallDeepfakeProbability: updatedReport.overallDeepfakeProbability,
      confidenceScore: updatedReport.confidenceScore,
      createdAt: updatedReport.createdAt,
      userId,
      shareId,
      reportData: JSON.stringify(updatedReport)
    });

    // Also store share reference doc
    const shareRef = doc(db, 'shares', shareId);
    await setDoc(shareRef, {
      reportId: updatedReport.id,
      shareId,
      createdAt: new Date().toISOString(),
      reportData: JSON.stringify(updatedReport)
    });

    return shareId;
  } catch (err) {
    console.error('Error saving report to Firestore:', err);
    throw err;
  }
}

/**
 * Fetch shared report by public Share ID
 */
export async function fetchReportByShareId(shareId: string): Promise<ForensicReport | null> {
  try {
    const shareRef = doc(db, 'shares', shareId);
    const snap = await getDoc(shareRef);
    if (snap.exists() && snap.data().reportData) {
      return JSON.parse(snap.data().reportData) as ForensicReport;
    }
    return null;
  } catch (err) {
    console.error('Error fetching share report:', err);
    return null;
  }
}

/**
 * Load all stored cloud history reports
 */
export async function fetchCloudHistory(): Promise<ForensicReport[]> {
  try {
    const reportsCol = collection(db, 'reports');
    const q = query(reportsCol, orderBy('createdAt', 'desc'), limit(30));
    const querySnapshot = await getDocs(q);
    const list: ForensicReport[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.reportData) {
        try {
          list.push(JSON.parse(data.reportData) as ForensicReport);
        } catch {
          // ignore parsing error
        }
      }
    });
    return list;
  } catch (err) {
    console.warn('Could not fetch cloud history:', err);
    return [];
  }
}

export { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
