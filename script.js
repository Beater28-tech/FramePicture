const photoInput = document.getElementById('photoInput');
const frameInput = document.getElementById('frameInput');
const previewImage = document.getElementById('previewImage');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let cropper;
let frameImage = null;

// When photo is uploaded
photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = 'block';

    previewImage.onload = () => {
      if (cropper) cropper.destroy(); // remove old cropper
      cropper = new Cropper(previewImage, {
        aspectRatio: 1,
        viewMode: 1,
        movable: true,
        cropBoxResizable: true
      });
    };

    cropBtn.style.display = 'inline-block';
    statusText.textContent = 'Step 2: Crop your image.';
  }
});

// When frame is uploaded
frameInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      frameImage = img;
      statusText.textContent = 'Frame uploaded!';
    };
    img.src = URL.createObjectURL(file);
  }
});

// Crop and merge
cropBtn.addEventListener('click', function () {
  if (!cropper || !frameImage) {
    alert('Please upload both image and frame.');
    return;
  }

  // Get cropped image
  const croppedCanvas = cropper.getCroppedCanvas({
    width: 800,
    height: 800,
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(croppedCanvas, 0, 0, 800, 800);
  ctx.drawImage(frameImage, 0, 0, 800, 800);

  canvas.style.display = 'block';
  downloadBtn.style.display = 'inline-block';
  statusText.textContent = '✅ Ready to download!';
});

// Download image
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'framed-cropped-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});