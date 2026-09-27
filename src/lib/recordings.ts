/** Speaking recordings are stored as Blobs in IndexedDB, keyed by "<attemptId>/<promptId>". */
const DB_NAME = 'msi-recordings'
const STORE = 'blobs'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => request.result.createObjectStore(STORE)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  return dbPromise
}

function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const request = action(tx.objectStore(STORE))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }),
  )
}

export function putRecording(key: string, blob: Blob): Promise<IDBValidKey> {
  return run('readwrite', (store) => store.put(blob, key))
}

export function getRecording(key: string): Promise<Blob | undefined> {
  return run<Blob | undefined>('readonly', (store) => store.get(key))
}

export async function deleteRecordings(prefix: string): Promise<void> {
  const keys = await run<IDBValidKey[]>('readonly', (store) => store.getAllKeys())
  await Promise.all(keys.filter((k) => String(k).startsWith(prefix)).map((k) => run('readwrite', (store) => store.delete(k))))
}
