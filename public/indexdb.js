let db;

const dbrequest = indexedDB.open("bTrack", 1);

dbrequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("pendingTransactions", { autoIncrement: true });
};

dbrequest.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

function checkDatabase() {
  const transaction = db.transaction(["pendingTransactions"], "readwrite");
  const store = transaction.objectStore("pendingTransactions");
  const getEverything = store.getAll();

  getEverything.onsuccess = function () {
    if (getEverything.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getEverything.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transact = db.transaction(["pendingTransactions"], "readwrite");
          const store = transact.objectStore("pendingTransactions");
          store.clear();
        });
    }
  };
}

function saveTransaction(record) {
  const transaction = db.transaction(["pendingTransactions"], "readwrite");

  const store = transaction.objectStore("pendingTransactions");

  store.add(record);
}

window.addEventListener("online", checkDatabase);
