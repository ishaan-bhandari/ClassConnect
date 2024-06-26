// popup.js
question_s
chrome.runtime.onMessage.addListener(function (request, sender,     ) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  console.log(request.link);

  fetch("", {
    method: "POST", // Specify the method
    headers: {
      "Content-Type": "application/json", // Specify the content type
    },
    body: JSON.stringify({
      link: request.link, // Data you want to send in JSON format
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // or response.text() if the server sends non-JSON response
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      console.log("Success:", data); // Handling the success response
      sendResponse(timestamps);
    })
    .catch((error) => {
      console.error("Error:", error); // Handling errors
    });
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
