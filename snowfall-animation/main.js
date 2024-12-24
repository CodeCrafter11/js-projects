const TOTAL_NUM_FLAKES = 300;
const SNOW_SYMBOLS = ["•", "❅", "❆", "❄"];

const LAYERS = [
	{
		layer: 1,
		sizeMin: 24,
		sizeMax: 40,
		speedFactor: 0.12,
		swayAmpMin: 10,
		swayAmpMax: 30,
		opacity: 1,
		blur: 0,
		colorVariationMin: 255,
		colorVariationMax: 255,
		symbols: ["•"],
		zIndex: 6
	},
	{
		layer: 2,
		sizeMin: 20,
		sizeMax: 28,
		speedFactor: 0.09,
		swayAmpMin: 10,
		swayAmpMax: 25,
		opacity: 0.85,
		blur: 2,
		colorVariationMin: 255,
		colorVariationMax: 255,
		symbols: ["•"],
		zIndex: 5
	},
	{
		layer: 3,
		sizeMin: 16,
		sizeMax: 24,
		speedFactor: 0.07,
		swayAmpMin: 10,
		swayAmpMax: 20,
		opacity: 0.75,
		blur: 4,
		colorVariationMin: 255,
		colorVariationMax: 255,
		symbols: ["•"],
		zIndex: 4
	},
	{
		layer: 4,
		sizeMin: 12,
		sizeMax: 18,
		speedFactor: 0.05,
		swayAmpMin: 10,
		swayAmpMax: 20,
		opacity: 0.65,
		blur: 5,
		colorVariationMin: 220,
		colorVariationMax: 229,
		symbols: ["•"],
		zIndex: 3
	},
	{
		layer: 5,
		sizeMin: 10,
		sizeMax: 14,
		speedFactor: 0.03,
		swayAmpMin: 10,
		swayAmpMax: 20,
		opacity: 0.55,
		blur: 7,
		colorVariationMin: 210,
		colorVariationMax: 219,
		symbols: ["•"],
		zIndex: 2
	},
	{
		layer: 6,
		sizeMin: 8,
		sizeMax: 12,
		speedFactor: 0.01,
		swayAmpMin: 10,
		swayAmpMax: 20,
		opacity: 0.4,
		blur: 30,
		colorVariationMin: 200,
		colorVariationMax: 209,
		symbols: ["•"],
		zIndex: 1
	}
];

class SnowLayer {
	constructor(canvasId, layerProps) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext("2d");
		this.layerProps = layerProps;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas.width = this.width * window.devicePixelRatio;
		this.canvas.height = this.height * window.devicePixelRatio;
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		this.snowflakes = [];
		this.snowPileHeights = [];
		this.SEGMENT_WIDTH = 5;
		this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);
		this.initializeSnowPiles();
		this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
	}

	initializeSnowPiles() {
		this.snowPileHeights = [];
		this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);
		for (let j = 0; j < this.NUM_SEGMENTS; j++) {
			if (j === 0) {
				this.snowPileHeights[j] = this.height - 30 + (Math.random() * 10 - 5);
			} else {
				const previousHeight = this.snowPileHeights[j - 1];
				let delta = Math.random() * 10 - 5;
				let newHeight = previousHeight + delta;

				const maxHeight = this.height - 10;
				const minHeight = this.height - 100;
				if (newHeight > maxHeight) {
					newHeight = maxHeight;
				} else if (newHeight < minHeight) {
					newHeight = minHeight;
				}

				this.snowPileHeights[j] = newHeight;
			}
		}
		this.smoothSnowPile(2);
	}

	smoothSnowPile(iterations = 1) {
		for (let iter = 0; iter < iterations; iter++) {
			const temp = [...this.snowPileHeights];
			for (let i = 1; i < this.NUM_SEGMENTS - 1; i++) {
				temp[i] =
					(this.snowPileHeights[i - 1] +
						this.snowPileHeights[i] +
						this.snowPileHeights[i + 1]) /
					3;
			}
			this.snowPileHeights = temp;
		}
	}

	createSnowflakes(numFlakes) {
		for (let i = 0; i < numFlakes; i++) {
			this.snowflakes.push(this.createSnowflake());
		}
	}

	createSnowflake() {
		const symbol = this.layerProps.symbols[
			Math.floor(Math.random() * this.layerProps.symbols.length)
		];
		const layerProps = this.layerProps;

		const size =
			Math.random() * (layerProps.sizeMax - layerProps.sizeMin) +
			layerProps.sizeMin;
		const fallSpeed = size * layerProps.speedFactor + Math.random() * 0.5;
		const swayAmplitude =
			Math.random() * (layerProps.swayAmpMax - layerProps.swayAmpMin) +
			layerProps.swayAmpMin;
		const swaySpeed = Math.random() * 0.02 + 0.01;

		const rotation = Math.random() * Math.PI * 2;
		const rotationSpeed = Math.random() * 0.02 - 0.01;

		const colorVariation =
			Math.floor(
				Math.random() *
					(layerProps.colorVariationMax - layerProps.colorVariationMin + 1)
			) + layerProps.colorVariationMin;
		const color = `rgba(${colorVariation}, ${colorVariation}, ${colorVariation}, ${layerProps.opacity})`;

		return {
			x: Math.random() * this.width,
			y: Math.random() * -this.height,
			size: size,
			symbol: symbol,
			fallSpeed: fallSpeed,
			swayAmplitude: swayAmplitude,
			swaySpeed: swaySpeed,
			swayOffset: Math.random() * Math.PI * 2,
			opacity: layerProps.opacity,
			blur: layerProps.blur,
			color: color,
			rotation: rotation,
			rotationSpeed: rotationSpeed
		};
	}

	drawSnowPile() {
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.snowPileHeights[0]);

		for (let i = 1; i < this.NUM_SEGMENTS; i++) {
			this.ctx.lineTo(i * this.SEGMENT_WIDTH, this.snowPileHeights[i]);
		}

		this.ctx.lineTo(this.width, this.snowPileHeights[this.NUM_SEGMENTS - 1]);
		this.ctx.lineTo(this.width, this.height);
		this.ctx.lineTo(0, this.height);
		this.ctx.closePath();

		this.ctx.fillStyle = `rgba(255, 255, 255, ${this.layerProps.opacity})`;
		this.ctx.fill();
	}

	getSnowPileHeight(x) {
		const index = Math.floor(x / this.SEGMENT_WIDTH);
		if (index < 0 || index >= this.NUM_SEGMENTS) {
			return this.height;
		}
		return this.snowPileHeights[index];
	}

	addToSnowPile(x, size) {
		const index = Math.floor(x / this.SEGMENT_WIDTH);
		if (index < 0 || index >= this.NUM_SEGMENTS) return;

		this.snowPileHeights[index] -= size * 0.5;

		const spread = 2;
		for (let i = 1; i <= spread; i++) {
			if (index - i >= 0) {
				this.snowPileHeights[index - i] -= size * 0.05;
			}
			if (index + i < this.NUM_SEGMENTS) {
				this.snowPileHeights[index + i] -= size * 0.05;
			}
		}

		for (let i = -spread; i <= spread; i++) {
			const currentIndex = index + i;
			if (currentIndex >= 0 && currentIndex < this.NUM_SEGMENTS) {
				if (this.snowPileHeights[currentIndex] < this.height - 100) {
					this.snowPileHeights[currentIndex] = this.height - 100;
				}
			}
		}

		this.smoothSnowPile(1);
	}

	animate(wind) {
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.drawSnowPile();

		for (let flake of this.snowflakes) {
			const swayX = Math.sin(flake.swayOffset) * flake.swayAmplitude;

			const windEffect = wind.speed * wind.direction;

			flake.rotation += flake.rotationSpeed;

			this.ctx.save();

			this.ctx.translate(flake.x + swayX + windEffect, flake.y);

			this.ctx.rotate(flake.rotation);

			this.ctx.font = `${flake.size}px sans-serif`;
			this.ctx.fillStyle = flake.color;

			this.ctx.shadowBlur = flake.blur;
			this.ctx.shadowColor = flake.color;

			this.ctx.fillText(flake.symbol, 0, 0);

			this.ctx.restore();

			flake.y += flake.fallSpeed;
			flake.x += windEffect * 0.5;
			flake.swayOffset += flake.swaySpeed;

			if (
				flake.y >=
				this.getSnowPileHeight(flake.x + swayX + windEffect) - flake.size / 2
			) {
				this.addToSnowPile(flake.x + swayX + windEffect, flake.size);
				Object.assign(flake, this.createSnowflake());
				flake.y = Math.random() * -this.height;
				flake.x = Math.random() * this.width;
				flake.swayOffset = Math.random() * Math.PI * 2;
			}

			if (flake.x > this.width + 50) {
				flake.x = -50;
			} else if (flake.x < -50) {
				flake.x = this.width + 50;
			}

			if (flake.y > this.height + 50) {
				flake.y = Math.random() * -this.height;
				flake.x = Math.random() * this.width;
				flake.swayOffset = Math.random() * Math.PI * 2;
			}
		}
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas.width = this.width * window.devicePixelRatio;
		this.canvas.height = this.height * window.devicePixelRatio;
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);
		this.initializeSnowPiles();
		this.snowflakes = [];
		this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
	}
}

let wind = {
	direction: Math.random() < 0.5 ? -1 : 1,
	speed: Math.random() * 0.5 + 0.1
};

setInterval(() => {
	wind.direction = Math.random() < 0.5 ? -1 : 1;
	wind.speed = Math.random() * 0.5 + 0.1;
}, 5000);

const snowLayers = LAYERS.map(
	(layer) => new SnowLayer(`snow-canvas-${layer.layer}`, layer)
);

window.addEventListener("resize", () => {
	for (let layer of snowLayers) {
		layer.resize();
	}
});

function animate() {
	for (let layer of snowLayers) {
		layer.animate(wind);
	}
	requestAnimationFrame(animate);
}

animate();
