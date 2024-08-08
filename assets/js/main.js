/*
	Miniport by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ null,      '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('#nav a, .scrolly').scrolly({
			speed: 1000,
			offset: function() { return $nav.height(); }
		});

})(jQuery);




//typewriter 효과 
const sentences = [
    "FullStack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Tech Enthusiast"
];

let currentSentence = 0;
let currentIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const delayBetweenSentences = 2000;

const typewriterElement = document.getElementById("typewriter");

function type() {
    const currentText = sentences[currentSentence];
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, currentIndex - 1);
        currentIndex--;
        if (currentIndex == 0) {
            isDeleting = false;
            currentSentence = (currentSentence + 1) % sentences.length;
            setTimeout(type, typeSpeed);
        } else {
            setTimeout(type, deleteSpeed);
        }
    } else {
        typewriterElement.textContent = currentText.substring(0, currentIndex + 1);
        currentIndex++;
        if (currentIndex == currentText.length) {
            isDeleting = true;
            setTimeout(type, delayBetweenSentences);
        } else {
            setTimeout(type, typeSpeed);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(type, typeSpeed);
});