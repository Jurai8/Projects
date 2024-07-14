
const addWord = document.getElementById("add-word-modal");

const schedule = document.getElementById("schedule-modal");

const btn = document.getElementsByClassName("myBtn")[0];

const btn2 = document.getElementsByClassName("myBtn")[1];

const span = document.getElementsByClassName("exit")[0];

const span2 = document.getElementsByClassName("exit")[1];

btn.onclick = function() {
  addWord.style.display = "block";
}

btn2.onclick = function() {
  schedule.style.display = "block";
}

span.onclick = function() {
  addWord.style.display = "none";
}

span2.onclick = function() {
  schedule.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == addWord) {
    addWord.style.display = "none";
  }

  if (event.target == schedule) {
    schedule.style.display = "none";
  }
}
