button = document.getElementById("tab-attachments-tab"); // Replace 'buttonId' with the actual ID of the button
if (button) {
  button.click();
  console.log("clicked");
} else {
  console.log("Button not found");
}


// console.log([...classList]);

allLinks = document.querySelectorAll(".js-download-attachment-link");
iframe = document.querySelector('div.video').querySelector("iframe");
video = iframe.contentWindow.document.querySelector('video');
console.log(video);

// Assume 'iframe' and other necessary variables are already defined

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
    console.log('Video element not found in iframe.');
  }
}

timeStamps = [300,600,900]

function checkTimeStamps() {
  if (video) {
    let currentTime = Math.floor(video.currentTime);
    if (timeStamps.includes(currentTime)) {
      idx = timeStamps.indexOf(currentTime);
      console.log(`Handle question # ${timeStamps.indexOf(currentTime) + 1}`);

      video.pause();
      
      // ask_question(idx );
    }
  } else {
    console.log('Video element not found in iframe.');
  }
}

setInterval(checkTimeStamps, 1000);





