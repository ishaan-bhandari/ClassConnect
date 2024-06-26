// popup.js
question_bank = [];
timestamps = [];

async function send_transcript(request) {
  url = `http://127.0.0.1:5000/generate-questions`;

  await fetch(url, {
    method: "GET", // Specify the method
    headers: {
      "Content-Type": "application/json", // Specify the content type
      Transript_Url: request,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // or response.text() if the server sends non-JSON response
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log("Success:", data); // Handling the success response
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          timestamps.push(key);
          question_bank.push(data[key]);
        }
      }
      console.log(question_bank);
      console.log(timestamps);

      //   sendResponse(timestamps);
    })
    .catch((error) => {
      console.error("Error:", error); // Handling errors
    });
}

function change_question(idx) {
  document.getElementById("question").innerHTML = question_bank[idx].question;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "question") {
  }

  if (request.type == "question") {
  }
  if (request.type == "question") {
  }

  send_transcript(request.link).then(() => {
    // console.log("here");
    sendResponse({ timestamps: timestamps });
  });

  return true;
});
document.getElementById("listClasses").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });
  });
});
// function listAllClassNames() {
//   const allElements = document.querySelectorAll("*"); // Select all elements on the page
//   const classNames = new Set(); // Use a Set to avoid duplicates

//   // Iterate through each element and add its classList to the Set
//   allElements.forEach((element) => {
//     element.classList.forEach((className) => {
//       classNames.add(className);
//     });
//   });

//   // Convert the Set to an array for easier viewing/manipulation
//   return Array.from(classNames);
// }

// // Call the function and log the result
// console.log(listAllClassNames());
