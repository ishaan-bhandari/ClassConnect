var button = document.getElementById("tab-attachments-tab"); // Replace 'buttonId' with the actual ID of the button
if (button) {
  button.click();
  console.log("clicked");
} else {
  console.log("Button not found");
}

allElements = document.querySelectorAll("*");
classSet = new Set();
console.log("running");
allElements.forEach((element) => {
  element.classList.forEach((className) => {
    if (element.getAttribute("data-entry-id") === "1_a4g92nen") {
      // console.log(element.getAttribute("href"));
    }
    classSet.add(className);
  });
});

// console.log([...classList]);

allLinks = document.querySelectorAll(".js-download-attachment-link");
playButton = document.querySelector('button[title="Play clip"]');
console.log(playButton);
console.log(allLinks[1].getAttribute("href"));

