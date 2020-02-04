const mainImage = document.getElementById("mainImage");
const images = document.getElementById("images");
const contentDesc = document.getElementById("contentDesc");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const buttons = document.querySelector(".buttons");

let heroImgs = [];
let data = {};
let slides;
const opacity = 0.4;

// Methods
// Get All images
function getImages() {
  // Unable to use fetch because of CORS error//
  //   fetch(
  //     "https://www.westelm.com/services/catalog/v4/category/shop/new/all-new/index.json"
  //   )
  fetch("./assets/data/wscatalog.json")
    .then(res => res.json())
    .then(responseJson => {
      data = responseJson;
      loadImages(data);
    })
    .catch(err => console.log(err));
}

// Load Images and paint ui
function loadImages() {
  let itemId = "";
  let itemName = "";
  let itemPrice = 0;
  let itemHeroImg = "";
  let itemImages = [];
  let otherImages = "";
  let mainImg = "";
  let content;

  data[0].groups.forEach((item, index) => {
    itemId = item.id;
    itemName = item.name;
    itemPrice = item.priceRange.selling.high;
    itemHeroImg = item.hero.href;
    itemImages = item.images;

    // Show the first image
    if (index === 0) {
      [content, mainImg] = getTopImage(
        itemPrice,
        itemName,
        itemHeroImg,
        itemImages
      );
    }

    // Show Other Images
    otherImages += `
      <img
      src="${itemHeroImg}"
      alt="${itemName}"
      id="${itemId}"
      />
      `;
  });

  mainImage.innerHTML = mainImg;
  contentDesc.innerHTML = content;
  images.innerHTML = otherImages;

  const firstImg = document.querySelector(".images img");
  firstImg.style.opacity = opacity;
  heroImgs = document.querySelectorAll(".images img");
  slides = document.querySelectorAll(".slide");
  // add event listener on each image
  heroImgs.forEach(img => img.addEventListener("click", imageSelected));
}

// Get Top Image
function getTopImage(itemPrice, itemName, itemHeroImg, itemImages) {
  let price = dollarAmt(itemPrice);
  let content = `
      <h5>${itemName}</h5>
      <p>${price}</p>`;
  let imgClass = "class = 'slide current'";
  // Dont show next and prev buttons if images are not available
  itemImages.length > 0
    ? (buttons.style.visibility = "visible")
    : (buttons.style.visibility = "hidden");

  let mainImg = `<img
        src="${itemHeroImg}"
        alt="${itemName}"
        ${imgClass} />
        `;

  imgClass = "class = 'slide'";
  itemImages.forEach(imgItem => {
    mainImg += `<img
        src="${imgItem.href}"
        alt="${itemName}"
        ${imgClass} />
        `;
  });

  return [content, mainImg];
}

function imageSelected(e) {
  // reset opacity on all images
  heroImgs.forEach(img => (img.style.opacity = 1));

  // Get the current class
  const current = document.querySelector(".current");

  // remove the current class from the current slide
  current.classList.remove("current");

  const selectedItem = data[0].groups.filter(item => item.id === e.target.id);

  if (selectedItem.length === 1) {
    [content, mainImg] = getTopImage(
      selectedItem[0].priceRange.selling.high,
      selectedItem[0].name,
      selectedItem[0].hero.href,
      selectedItem[0].images
    );

    mainImage.innerHTML = mainImg;
    contentDesc.innerHTML = content;

    slides = document.querySelectorAll(".slide");
  } else {
    console.log("Error: Multiple images with same id");
  }

  // Change opacity of clicked image
  e.target.style.opacity = opacity;
}

function nextSlide() {
  // Get the current class
  const current = document.querySelector(".current");
  // remove the current class from the current slide
  current.classList.remove("current");
  // Check for next slide
  if (current.nextElementSibling) {
    // Add Current to the next sibling
    current.nextElementSibling.classList.add("current");
  } else {
    // Add current to start
    slides[0].classList.add("current");
  }
}

function prevSlide() {
  // Get the current class
  const current = document.querySelector(".current");
  // remove the current class from the current slide
  current.classList.remove("current");
  // Check for previous slide
  if (current.previousElementSibling) {
    // Add Current to the previous sibling
    current.previousElementSibling.classList.add("current");
  } else {
    // Add current to the last slide
    slides[slides.length - 1].classList.add("current");
  }
}

// convert amount to dollar
function dollarAmt(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", getImages);

// Button events
nextButton.addEventListener("click", e => {
  nextSlide();
});

prevButton.addEventListener("click", e => {
  prevSlide();
});
