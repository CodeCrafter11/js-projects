let bubbles = document.querySelectorAll(".bubble");

gsap.fromTo(
	bubbles,
	{
		opacity: 1,
		x: "random(100,550)",
		y: "-=0",
		scale: "random(1, 3)",
		repeatRefresh: true,
		transformOrigin: "center"
	},
	{
		duration: 2,
		opacity: "random(0, 0.5)",
		scale: 0,
		y: "-=500",
		x: "random(100,550)",
		stagger: {
			amount: 10,
			each: 1,
			repeat: -1
		}
	}
);
