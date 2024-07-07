const resize = false;

const timeOutput = document.getElementById('time');
const sliderContainer = document.getElementById('sliderContainer');
const filter = document.getElementById('filter');

const sun = document.getElementById('sun');
const moon = document.getElementById('moon');
const path = document.getElementById('sunpath');

let timeValue = 12;
timeOutput.innerHTML = computeTime(timeValue);
sun.style.left = 450 + 'px';
sun.style.top = findY(path, 450) + 'px';
moon.style.left = -450 + 'px';
moon.style.top = findY(path, -450) + 'px';


function findY(path, x) {
	let pathLength = path.getTotalLength();
	let start = 0;
	let end = pathLength;
	let target = (start + end) / 2

	x = Math.max(x, path.getPointAtLength(0).x)
	x = Math.min(x, path.getPointAtLength(pathLength).x)

	while (target >= start && target <= pathLength) {
		let pos = path.getPointAtLength(target)

		if (Math.abs(pos.x - x) < 0.001) {
			return pos.y 
		} else if (pos.x > x) {
			end = target
		} else {
			start = target
		}
		target = (start + end) / 2
	}
}


dragElement(sun, moon);
dragElement(moon, sun);

let selectedElement;
function dragElement(elem, otherEl) {
	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elem.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		let pos5 = findY(path, elem.offsetLeft - pos1);
		elem.style.top = (pos5) + 'px';
		elem.style.left = (elem.offsetLeft - pos1) + 'px';

		let otherPos1 = (elem.offsetLeft - pos1) >= 450 ? (elem.offsetLeft - pos1) - 832 : (elem.offsetLeft - pos1) + 832
		let otherPos5 = findY(path, otherPos1);
		otherEl.style.left = otherPos1 + 'px';
		otherEl.style.top = otherPos5 + 'px';

		let position = elem === sun ? Number(elem.style.left.slice(0, -2)) - 34 : Number(elem.style.left.slice(0, -2)) - 34 - 832;
		timeValue = position >= 0 ? Math.round(((position / (832 / 12) + 6)*10)/5)*5/10 : Math.round((((position) + 832) / (832 / 12) +18)*10/5)*5/10;
		if(timeValue > 24) {
			timeValue -=24;
		}

		const tz = [4, 8, 17, 20];

		let time = timeValue < tz[0] || timeValue > tz[3] ? 'night' : timeValue >= tz[0] && timeValue <= tz[1] ? 'morning' : timeValue > tz[1] && timeValue < tz[2] ? 'noon' : 'evening';
		let bgOffset = timeValue >= 12 ? timeValue - 12 : 12 - timeValue;
		bgOffset = bgOffset * 7 + '%';
		console.log(timeValue);
		console.log(bgOffset);
		sliderContainer.classList = 'slider-container';
		sliderContainer.classList.add('slider-container--' + time);

		let timeString = computeTime(timeValue)
		timeOutput.innerHTML = timeString;

		let bgPos = Number(window.getComputedStyle(filter,null).backgroundPositionY.slice(0,-1));
		filter.style.backgroundPositionY = bgOffset;
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

function computeTime(original) {
	let timeStrings = (original+'').split('.');
	timeStrings[1] = timeStrings[1] || '0';
	return timeStrings.join(':').replace(':0', ':00').replace(':5', ':30');
}

const starContainer = document.getElementById('stars');
makeStars(13, 25, 400, 25, 850);
function makeStars(numStars, xmin, xmax, ymin, ymax) {
	for(let i = 0; i <= numStars; i++) {
		let tempStar = document.createElement('div');
		tempStar.classList.add('star');
		let starPosx = Math.floor(Math.random() * (xmax-xmin)) + xmin;
		let starPosy = Math.floor(Math.random() * (ymax-ymin)) + ymin;
		tempStar.style.top = starPosx + 'px';
		tempStar.style.left = starPosy + 'px';

		let starSize = Math.floor(Math.random() * (22-12)) + 12;
		tempStar.style.height = starSize + 'px';
		tempStar.style.width = starSize + 'px';

		let starDelay = Math.floor(Math.random() * 3);
		tempStar.style.animationDelay = starDelay + 's';

		starContainer.appendChild(tempStar);
	}
	for(let i = 0; i <= numStars*2; i++) {
		let tempStar = document.createElement('div');
		tempStar.classList.add('star-round');
		let starPosx = Math.floor(Math.random() * (xmax-xmin)) + xmin;
		let starPosy = Math.floor(Math.random() * (ymax-ymin)) + ymin;
		tempStar.style.top = starPosx + 'px';
		tempStar.style.left = starPosy + 'px';

		starContainer.appendChild(tempStar);
	}

}

const wrapper = document.getElementById('sliderWrapper');
let sliderHeight = sliderContainer.clientHeight;
let sliderWidth = sliderContainer.clientWidth;
let wrapperHeight;
let wrapperWidth;
window.onresize = resizeSlider;

resizeSlider();

function resizeSlider() {
	if(resize) {
		wrapperHeight = wrapper.clientHeight - 50;
		wrapperWidth = wrapper.clientWidth - 50;
		let scale = Math.min(wrapperHeight / sliderHeight, wrapperWidth / sliderWidth);

		sliderContainer.style.transform = scale >= 1 ? `scale(${scale})` : 'scale(1)';
	}
}