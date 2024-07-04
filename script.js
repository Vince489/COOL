const images = [
  'new/1.png',
  'new/2.png',
  'new/3.png',
  'new/4.png',
  'new/5.png',
  'new/6.png',
  'new/7.png',
  'new/8.png',
  'new/9.png',
  'new/10.png',
  'new/11.png',
  'new/12.png',
  'new/13.png',
  'new/14.png',
  'new/15.png',
  'new/16.png',
  'new/17.png', 
  'new/18.png',
  'new/19.png',
  'new/20.png',
  'new/21.png',
  'new/22.png',
  'new/23.png',
  'new/24.png',
  'new/25.png',
  'new/26.png',
  'new/27.png',
  'new/28.png',
  'new/29.png',
  'new/30.png',
  'new/31.png',
  'new/32.png',
  'new/33.png',
  'new/34.png',
  'new/35.png',
  'new/36.png',
  'new/37.png',
  'new/38.png',
  'new/39.png',
  'new/40.png',
  'new/41.png',
  'new/42.png',
  'new/43.png',
  'new/44.png',
  'new/45.png',
  'new/46.png',
  'new/47.png',
  'new/48.png',
  'new/49.png',
  'new/50.png',
  'new/51.png',
  'new/52.png',
  'new/53.png',
  'new/54.png',
  'new/55.png',
  'new/56.png',
  'new/57.png',
  'new/58.png',
  'new/59.png',
  'new/60.png'
];

const flipbookContainer = document.getElementById('flipbook');

images.forEach((image, index) => {
  const imgElement = document.createElement('img');
  imgElement.src = image;
  imgElement.id = `image-${index}`;
  flipbookContainer.appendChild(imgElement);
});

let currentIndex = 0;
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
  currentIndex = 0;
  displayNextImage();
});

function displayNextImage() {
  if (currentIndex > 0) {
      document.getElementById(`image-${currentIndex - 1}`).style.display = 'none';
  }
  if (currentIndex < images.length) {
      document.getElementById(`image-${currentIndex}`).style.display = 'block';
      currentIndex++;
      setTimeout(displayNextImage, 100); // Adjust the speed (100ms) as needed
  }
}
