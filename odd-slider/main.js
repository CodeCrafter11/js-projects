let i = 0;
let inputpos = 0.4;
let offsetY = 0;
const slider = document.querySelector(".slider");
const slidercircle = document.querySelector(".slider-circle");
const slidertext = document.querySelector(".slider-text");
const progresspath = document.querySelector(".progress-path");
let mousedown = false;

const updateCircle = () => {
	// position the circle horizontally
	slidercircle.style.transform = `translate(-50%, -50%) translateX(${inputpos * 25 - 12.5}rem)`;
	
	// position the circle vertically;
	if (inputpos >= 1.05) {
		slidercircle.style.top = "3em";
		slidertext.innerHTML = "10";
	} else if (inputpos <= -0.05) {
		slidercircle.style.top = "3em";
		slidertext.innerHTML = "0";
	} else {
		slidercircle.style.top = `${(Math.round(inputpos * 10) % 2) * 4 + 1}em`;
		slidertext.innerHTML = String(Math.round(inputpos * 10));
	}
	
	// make the path link to the ball
	progresspath.setAttribute("d",
														`M 13 3
														L ${Math.max(inputpos * 25 + 10.5, 13)} 3
														Q ${Math.max(inputpos * 25 + 12, 13)} 3
														${inputpos * 25 + 13} ${getComputedStyle(slidercircle).top.slice(0, -2) / 14.4}`);
}

// detect if the slider is held
slider.onmousedown = function (evt) {
	mousedown = true;
};

slider.addEventListener('touchstart', () => {
	mousedown = true;
});

document.body.onmouseup = function (evt) {
	if (evt.button == 0) { mousedown = false; }
};

slider.addEventListener('touchend', () => {
	mousedown = false;
});

slider.addEventListener("input", (e) => {
	// get the slider value
	inputpos = slider.value * 0.001 ;
	
	// make soft bounds
	if (inputpos < 0) {
		inputpos = 1.25 * Math.pow(inputpos + 0.4, 2) - 0.2;
	}
	if (inputpos > 1) {
		inputpos = -1.25 * Math.pow(inputpos - 1.4, 2) + 1.2;
	}
	
	// update the circle and line position
	updateCircle();
});

// every frame (60 times per second)
setInterval(function () {
	
	// if the slider isnt held
	if (!mousedown) {
		
		// find the closest valid position
		const targetpos = Math.min(Math.max(Math.round(inputpos * 10) / 10, 0), 1);
		
		// softly glide to that position
		if (Math.abs(inputpos - targetpos) < 0.001) {
			inputpos = targetpos;
			slider.value = Math.round(inputpos * 1000);
		} else {
			inputpos = 0.9 * inputpos + 0.1 * targetpos;
			slider.value = Math.round(inputpos * 1000);
		}
	}
	
	// update the circle and the line position
	updateCircle();
	
}, 1000 / 60);