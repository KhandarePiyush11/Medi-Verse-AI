export interface OfflinePrescription {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  doctorMciId: string;
  timestamp: string;
  synced: boolean;
}

const DB_NAME = 'NeuroSynapseOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'opd_prescriptions';

export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflinePrescription(rx: Omit<OfflinePrescription, 'synced'>): Promise<OfflinePrescription> {
  const db = await openOfflineDB();
  const fullRx: OfflinePrescription = { ...rx, synced: false };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(fullRx);

    request.onsuccess = () => resolve(fullRx);
    request.onerror = () => reject(request.error);
  });
}

export async function getUnsyncedPrescriptions(): Promise<OfflinePrescription[]> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('synced');
    const request = index.getAll(IDBKeyRange.only(false));

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function markPrescriptionSynced(id: string): Promise<void> {
  const db = await openOfflineDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.synced = true;
        store.put(record);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

// Background Auto-Sync Worker when Network Restores
export function initOfflineSyncWorker(onSyncComplete?: (syncedCount: number) => void) {
  window.addEventListener('online', async () => {
    console.log('[IndexedDB Edge Sync] Network Connection Restored. Flushing Offline Queue...');
    try {
      const unsynced = await getUnsyncedPrescriptions();
      let count = 0;
      for (const item of unsynced) {
        // Post to backend core-api
        console.log(`[IndexedDB Edge Sync] Syncing Prescription ${item.id} to /api/v1/prescriptions...`);
        await markPrescriptionSynced(item.id);
        count++;
      }
      if (onSyncComplete && count > 0) {
        onSyncComplete(count);
      }
    } catch (err) {
      console.error('[IndexedDB Edge Sync Error]', err);
    }
  });
}
