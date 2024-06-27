timestamps = [];

var button = document.getElementById("tab-attachments-tab"); // Replace 'buttonId' with the actual ID of the button
if (button) {
  button.click();
  console.log("clicked");
} else {
  console.log("Button not found");
}

iframe = document.querySelector("div.video").querySelector("iframe");
video = iframe.contentWindow.document.querySelector("video");
json_link = document
  .querySelectorAll(".js-download-attachment-link")[1]
  .getAttribute("href");
// Send the data to the extension
(async () => {
  const response = await chrome.runtime.sendMessage({
    type: "initial",
    link: json_link,
  });
  // do something with response here, not outside the function
  console.log(response.timestamps);
  // convert response.timestamps from a string array to an int array of timestamps
  timestamps = response.timestamps.map((timestamp) => parseInt(timestamp));
})();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("here");

  if (request.request === "play") {
    // console.log("play");
    video.play();
  }
});

function pausePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function getToTimeStamp(minutes, seconds) {
  if (video) {
    const totalSeconds = minutes * 60 + seconds;
    video.currentTime = totalSeconds;

    console.log(`Video time set to ${minutes}:${seconds}`);
  } else {
    console.log("Video element not found in iframe.");
  }
}

function checkTimeStamps() {
  if (video) {
    let currentTime = Math.floor(video.currentTime);
    if (timestamps.includes(currentTime)) {
      idx = timestamps.indexOf(currentTime);
      // console.log(`Handle question # ${timestamps.indexOf(currentTime) + 1}`);

      video.pause();

      ask_question(idx);
      timestamps.splice(idx, 1);
    }
  } else {
    console.log("Video element not found in iframe.");
  }
}

async function ask_question(idx) {
  // console.log("Asking question");
  const response = await chrome.runtime.sendMessage({
    type: "interrupt",
    question_idx: idx,
  });
  // do something with response here, not outside the function
  console.log(response);
}

setInterval(checkTimeStamps, 750);
