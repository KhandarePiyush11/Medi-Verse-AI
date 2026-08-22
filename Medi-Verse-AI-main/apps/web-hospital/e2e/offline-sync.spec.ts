import { test, expect } from '@playwright/test';

test.describe('NeuroSynapse Offline-First IndexedDB Edge Sync Integration Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to React 19 Hospital Clinical Workstation
    await page.goto('http://localhost:5173');
  });

  test('should persist prescription in IndexedDB when offline and auto-sync when network restores', async ({ page, context }) => {
    // 1. Simulate Network Disconnection (Low-Bandwidth Tier-2/3 OPD Network Drop)
    await context.setOffline(true);
    await page.dispatchEvent('window', 'offline');

    // 2. Verify Offline Network Banner appears
    const offlineBanner = page.locator('text=LOW-BANDWIDTH / OFFLINE MODE ACTIVE');
    await expect(offlineBanner).toBeVisible();

    // 3. Scribe a prescription in Smart Rx Scribe panel while offline
    const medicationInput = page.locator('input[value="Levetiracetam 500mg"]');
    await medicationInput.fill('Levetiracetam 250mg (Renal Adjusted)');

    const dispatchBtn = page.locator('button:has-text("DISPATCH ABDM M3 SIGNED RX")');
    await dispatchBtn.click();

    // 4. Verify Cryptographic MCI signature button state changes
    const signedBtn = page.locator('text=SIGNED & SAVED TO INDEXEDDB (MCI-884920)');
    await expect(signedBtn).toBeVisible();

    // 5. Verify record persistence directly inside client-side IndexedDB (NeuroSynapseOfflineDB)
    const unsyncedRecordCount = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        const request = indexedDB.open('NeuroSynapseOfflineDB', 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('opd_prescriptions', 'readonly');
          const store = tx.objectStore('opd_prescriptions');
          const countReq = store.count();
          countReq.onsuccess = () => resolve(countReq.result);
        };
      });
    });

    expect(unsyncedRecordCount).toBeGreaterThanOrEqual(1);

    // 6. Restore Network Connection
    await context.setOffline(false);
    await page.dispatchEvent('window', 'online');

    // 7. Verify Auto-Sync Reconciliation Worker flushes the IndexedDB queue
    await page.waitForTimeout(1000); // Allow background sync worker execution

    const remainingUnsynced = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        const request = indexedDB.open('NeuroSynapseOfflineDB', 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('opd_prescriptions', 'readonly');
          const store = tx.objectStore('opd_prescriptions');
          const index = store.index('synced');
          const req = index.count(IDBKeyRange.only(false));
          req.onsuccess = () => resolve(req.result);
        };
      });
    });

    expect(remainingUnsynced).toBe(0);
  });
});
