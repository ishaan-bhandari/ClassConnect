// popup.js
question_bank = [];
timestamps = [];

async function send_transcript(req) {
  url = `http://127.0.0.1:5000/get_transcript`;
  console.log(req);

  await fetch(url, {
    method: "GET", // Specify the method
    headers: {
      "Content-Type": "application/json", // Specify the content type
      "Transcript-Url": req,
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
  document.querySelector(".quiz-container").style.display = "block";
  document.querySelector(".btn-get-started").style.display = "none";
  document.getElementById("question").innerHTML = question_bank[idx].Question;
  document.getElementById("answer-a").innerHTML = question_bank[idx].A;
  document.getElementById("answer-b").innerHTML = question_bank[idx].B;
  document.getElementById("answer-c").innerHTML = question_bank[idx].C;
  document.getElementById("answer-d").innerHTML = question_bank[idx].D;
  document.getElementById("right-answer").innerHTML =
    question_bank[idx].Correct;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.type);
  if (request.type == "initial") {
    console.log("right request");
    send_transcript(request.link).then(() => {
      // console.log("here");
      sendResponse({ timestamps: timestamps });
    });
  }

  if (request.type == "interrupt") {
    change_question(request.question_idx);
    sendResponse({ response: "done" });
  }

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

document.getElementById("submitButton").addEventListener("click", function () {
  const question = document.getElementById("questionInput").value;
  url = `http://127.0.0.1:5000/query_rag_model`;
  console.log("submit");
  fetch(url, {
    method: "GET", // Specify the method
    headers: {
      "Content-Type": "application/json", // Specify the content type
      query_text: question,
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

      const responseBox = document.getElementById("responseBox");
      responseBox.textContent = data;

      //   sendResponse(timestamps);
    })
    .catch((error) => {
      console.error("Error:", error); // Handling errors
    });
  //

  document.getElementById("questionInput").value = "";
});

document
  .getElementById("questionInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      document.getElementById("submitButton").click();
    }
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
