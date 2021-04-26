// INPUTS STARTS

const filterControls = document.querySelectorAll('input[type=range]');
const outputValues = document.querySelectorAll('output');
const image = document.querySelector('img');


function useFilter() {
  const suffix = this.dataset.sizing || '';
  image.style.setProperty(`--${this.name}`, this.value + suffix);

  outputValues.forEach(output => {
    if (output.parentNode.childNodes[1].name === this.name) {
      output.value = this.value;
    }
  });
}

filterControls.forEach(input => input.addEventListener('change', useFilter));
filterControls.forEach(input => input.addEventListener('mousemove', useFilter));

// INPUTS ENDS

// RESET BUTTON STARTS

const resetButton = document.querySelector('.btn-reset')


function resetFilters() {

  image.style.cssText = "";

  filterControls.forEach(input => {
    input.value = input.defaultValue;
  });

  outputValues.forEach(output => {
    output.value = 0;
    if (output.parentNode.childNodes[1].name === "saturate") {
      output.value = 100;
    }
  });
}

resetButton.addEventListener('click', resetFilters)


// RESET BUTTON ENDS

// NEXT PICTURE BUTTON STARTS
const now = new Date().getHours();

if (now >= 6 && now < 12) {
  var base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/morning/';
}
else if (now >= 12 && now < 18) {
  var base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/day/';
}
else if (now >= 18 && now < 24) {
  var base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/';
}
else {
  var base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/night/';
}

const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg',
  '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let i = 0;

const nextButton = document.querySelector('.btn-next');

function viewBgImage(src) {
  image.src = src;
}

function getImage() {
  const index = i % images.length;
  const imageSrc = base + images[index];
  viewBgImage(imageSrc);
  i++;
}
nextButton.addEventListener('click', getImage);

// NEXT PICTURE BUTTON ENDS

// LOAD PICTURE BUTTON STARTS

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', function (e) {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
  }
  reader.readAsDataURL(file);
});

// LOAD PICTURE BUTTON ENDS

// SAVE PICTURE BUTTON STARTS


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const download = document.querySelector('.btn-save');


function getFilter() {
  let filters = '';
  let imageFilters = image.style.cssText;

  for (let i = 0; i < imageFilters.length; i++) {
    if (imageFilters[i] === '-' && imageFilters[i - 1] !== 'e') {
      continue;
    } else {
      switch (imageFilters[i]) {
        case ":":
          filters = filters + '(';
          break;
        case ";":
          filters = filters + ')';
          break;
        default:
          filters = filters + imageFilters[i];
          break;
      }
    }
  }
  return filters;
}


function drawImage() {

  image.setAttribute('crossOrigin', 'anonymous');

  image.onload = function () {
    var MAX_WIDTH = 830;
    var MAX_HEIGHT = 520;
    var width = image.width;
    var height = image.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    ctx.filter = getFilter();
    ctx.drawImage(image, 0, 0, width, height);
  };
}


download.addEventListener('click', function (e) {
  drawImage();
  setTimeout(function () {
    var link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  }, 100);
});


// SAVE PICTURE BUTTON ENDS

// FULLSCREEN STARTS

const fullscreen = document.querySelectorAll('.fullscreen')

fullscreen.forEach(v => {
  v.addEventListener('click', () => toggleFullScreen())
})


function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// FULLSCREEN ENDS

var filtersLabel = document.querySelectorAll('.filters-label');

filtersLabel.forEach(element => {
  element.addEventListener('mousedown', () => {
    var filtersInput = element.querySelector('.filters-input');
    var filtersOutput = element.querySelector('output');
    var filtersShadow = element.querySelector('.shadow');
    filtersOutput.classList.add('tool-output');
    filtersInput.classList.add('tool');
    filtersShadow.classList.add('shadow-input');
  })
  element.addEventListener('mouseup', () => {
    var filtersInput = element.querySelector('.filters-input');
    var filtersOutput = element.querySelector('output');
    var filtersShadow = element.querySelector('.shadow');
    filtersOutput.classList.remove('tool-output');
    filtersInput.classList.remove('tool');
    filtersShadow.classList.remove('shadow-input');

  })

});

var menuButtons = document.querySelectorAll('.btn');
menuButtons.forEach(element => {
  element.addEventListener('click', () => {
    menuButtons.forEach(e => {
      e.classList.remove('btn-active');
    });
    element.classList.add('btn-active');
  })
});
