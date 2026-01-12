console.log("JavaScriptが動いた！");

const button = document.getElementById("addBtn");
const sortBtn = document.getElementById("sortBtn");
const englishInput = document.getElementById("english");
const meaningInput = document.getElementById("meaning");
const wordList = document.getElementById("wordList");

let editIndex = null;
let sortMode = "normal";

const savedWords = JSON.parse(localStorage.getItem("words")) || [];

renderWords();

button.addEventListener("click", () => {
  const englishWord = englishInput.value;
  const meaningWord = meaningInput.value;

  if (englishWord === "" || meaningWord === "") {
    return;
  }

  if (editIndex !== null) {
    savedWords[editIndex] = {
      english: englishWord,
      meaning: meaningWord,
      learned: savedWords[editIndex].learned
    };
    editIndex = null;
    button.textContent = "追加";
  } else {
    savedWords.push({
      english: englishWord,
      meaning: meaningWord,
      learned: false
    });
  }

  saveWords();
  renderWords();

  englishInput.value = "";
  meaningInput.value = "";
});

sortBtn.addEventListener("click", () => {
  if (sortMode === "normal") {
    sortMode = "unlearned";
    sortBtn.textContent = "元の順に戻す";
  } else {
    sortMode = "normal";
    sortBtn.textContent = "覚えてない順";
  }
  renderWords();
});

function renderWords() {
  wordList.innerHTML = "";

  let displayWords = [...savedWords];

  if (sortMode === "unlearned") {
    displayWords.sort((a, b) => {
      return a.learned - b.learned;
    });
  }

displayWords.forEach((word) => {
  const li = document.createElement("li");
  li.classList.add("word-item"); // ★追加

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

    checkbox.checked = word.learned;

    checkbox.addEventListener("change", () => {
      word.learned = checkbox.checked;
      saveWords();
      renderWords();
    });

    const span = document.createElement("span");
    span.textContent = `${word.english} - ${word.meaning}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => {
      englishInput.value = word.english;
      meaningInput.value = word.meaning;
      editIndex = savedWords.indexOf(word);
      button.textContent = "更新";
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.addEventListener("click", () => {
      savedWords.splice(savedWords.indexOf(word), 1);
      saveWords();
      renderWords();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    wordList.appendChild(li);
  });
}

function saveWords() {
  localStorage.setItem("words", JSON.stringify(savedWords));
}
