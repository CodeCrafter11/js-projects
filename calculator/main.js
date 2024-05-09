const display = document.querySelector('.display');
const clear = document.querySelector('.clear');
let result = '';
let toggle;

function changeMode(btn) {
  btn.name = btn.name === 'moon-outline' ? 'sunny-outline' : 'moon-outline';
  document.body.classList.toggle('mode');
}

const clearLast = () => result.slice(0,[...result].findLastIndex((c) => /[/*+-]/.test(c)));

function clearAll() {
  setTimeout(() => {
    display.textContent = 0;
    clear.textContent = 'AC';
    result = '';
  });
}

function toClear() {
  return (toggle = !toggle) || !result
    ? clearAll()
    : result = clearLast();
}

function convert(unit) {
  /[/*+-]$/.test(String(result)) ? result = result.slice(0,-1) : sum();
  return unit === 'polarity' ? result *= -1 : result /= 100;
}

function updateDisplay() {
  if (result) clear.textContent = 'C';
  display.textContent = result;
}

function sum() {
  if (!result) return clearAll();
  display.textContent = eval(result);
  result = eval(result);
  toggle = false;
}

function updateResult(value) {
  result += value; 
  toggle = true;
}

function rules() {
  if (/^[0]{2,}/.test(result)) clearAll();
  if (/^[/*+]/.test(result)) clearAll();
  if (/(^-)[/*+-]{1,}/.test(result)) result = result.slice(0,-1);
  if (/([./*+-])\1+/.test(result)) result = result.slice(0,-1);
  if (/.[/*+-]{2,}/.test(result)) result = result.slice(0,-2) + result.slice(-1);
}

function operations(e) {
  const value = e.target.dataset.value;
  if (typeof(result) === 'number' && e.target.matches('.number')) result = '';
  if (e.target.matches('div[data-value]')) updateResult(value);
  if (e.target.matches('.clear')) toClear();
  if (e.target.matches('.polarity')) convert('polarity');
  if (e.target.matches('.percent')) convert('percent');
  if (e.target.matches('.equal')) sum();
}

function init(e) {
  if (e.target.closest('.btn')) changeMode(e.target);
  if (!e.target.closest('.calculator')) return;
  operations(e);
  rules();
  updateDisplay();
}

window.addEventListener('click',init,false);