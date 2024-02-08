import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://mobile-app-a0598-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsDB = ref(database, "endorsements");

const textarea = document.getElementById("textarea");
const publishBtn = document.getElementById("publish-btn");
const itemList = document.getElementById("item-list");

const fromInput = document.getElementById("from-input");
const toInput = document.getElementById("to-input");

onValue(endorsementsDB, function(snapshot) {
  if(snapshot.exists()) {
    clearEndorsementList();
    const endorsementEntries = Object.entries(snapshot.val());
    updateEndorsementList(endorsementEntries);
  } else {
    itemList.innerHTML = "No items found...";
  }
});

function updateEndorsementList(endorsementEntries) {
  for (let i = endorsementEntries.length - 1; i > -1; i--) {
    const currentItem = endorsementEntries[i];
    const currentItemID = currentItem[0];
    const currentObject = currentItem[1];
    const newEndorsementListItem = createListItem(currentObject, currentItemID);
    itemList.append(newEndorsementListItem);
  };
}

function createListItem(endorsementObject, endorsementID) {
  const endorsementText = endorsementObject["text"];
  const endorsementTo = endorsementObject["to"];
  const endorsementFrom = endorsementObject["from"];

  const endorsementToText = document.createElement("p");
  endorsementToText.textContent = `To ${endorsementTo}`;
  endorsementToText.classList.add("toText")

  const endorsementParaText = document.createElement("p");
  endorsementParaText.classList.add("paraText")
  endorsementParaText.textContent = endorsementText;

  const endorsementFromText = document.createElement("p");
  endorsementFromText.textContent = `From ${endorsementFrom}`;
  endorsementFromText.classList.add("fromText")

  let listItem = document.createElement("li");
  listItem.classList.add("endorsement-item");

  listItem.addEventListener("click", function() {
    removeItemFromDatabase(endorsementID);
  })

  listItem.append(endorsementToText);
  listItem.append(endorsementParaText);
  listItem.append(endorsementFromText);
  return listItem
}

function removeItemFromDatabase(endorsementID) {
  const exactLocationOfItemInDB = ref(database, `endorsements/${endorsementID}`);
  remove(exactLocationOfItemInDB);
}

function clearEndorsementList() {
  itemList.innerHTML = "";
}

function clearTextarea() {
  textarea.value = "";
  fromInput.value = "";
  toInput.value = "";
}

function addItemToDatabase(textValue, fromValue, toValue) {
  const endorsement = {
    to: toValue,
    from: fromValue,
    text: textValue,
    likes: 0
  };
  push(endorsementsDB, endorsement);
}

publishBtn.addEventListener("click", function() {
  const textAreaValue = textarea.value;
  const toInputValue = toInput.value;
  const fromInputValue = fromInput.value;
  clearTextarea();
  addItemToDatabase(textAreaValue, fromInputValue, toInputValue);
});