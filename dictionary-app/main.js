const input = document.querySelector('input');
const result = document.querySelector('.result');
const sound = document.querySelector('.sound');

const reset = () => input.value = '';

async function getData(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error('404 Something went wrong!');
    return res.json();
  } catch (e) {
    result.innerHTML = `
      <div class='error'>
        <h1>Something Went Wrong!</h1>
        <ul>
          <li>Check your spelling</li>
          <li>No such word in our dictionary</li>
          <li>Try again</li>
        </ul>
      </div>
    `;
  }
}

function playAudio(data) {
  const {audio} = data[0].phonetics.find(({audio}) => audio.endsWith('us.mp3')) || '';
  sound.setAttribute('src',audio);
}

function markup(data) {
  const word = data[0].word;
  const pos = data[0].meanings[0].partOfSpeech;
  const definitions = data[0].meanings[0].definitions.slice(0,3);
  const {text} = data[0].phonetics.find(({text}) => text) || '';

  result.innerHTML = `
    <div class='word'>
      <h1>${word}</h1>
      <button class='sound-btn'>
        <ion-icon class='sound-icon' name="volume-high-sharp"></ion-icon>
      </button>
    </div>
    <div class='details'>
      <span class='phonetic'>${text}</span>
      <span class='pos'>${pos}</span>
    </div>
    <ul class='definitions'>
      ${definitions.reduce((res,{definition:d}) => res + `<li>${d}</li>`,'')}
    </ul>
  `;
}

async function define() {
  if (!input.value.trim().length) return;
  const data = await getData(input.value);
  markup(data);
  playAudio(data);
}

const isEnter = (e) => e.keyCode === 13 && define();

function init(e) {
  e.target.closest('.search-icon') && define();
  e.target.closest('.sound-btn') && sound.play();
}

document.addEventListener('click',init,false);
input.addEventListener('keydown',isEnter,false);
input.addEventListener('focus',reset,false);