timestamps = [];
var button = document.getElementById("tab-attachments-tab"); // Replace 'buttonId' with the actual ID of the button
if (button) {
  button.click();
  console.log("clicked");
} else {
  console.log("Button not found");
}

allLinks = document.querySelectorAll(".js-download-attachment-link");
console.log(allLinks[1].getAttribute("href"));
// Send the data to the extension
(async () => {
  const response = await chrome.runtime.sendMessage({
    link: allLinks[1].getAttribute("href"),
  });
  // do something with response here, not outside the function
  console.log(response.timestamps);
  timestamps = response.timestamps;
})();

// fetch("", {
//   method: "POST", // Specify the method
//   headers: {
//     "Content-Type": "application/json", // Specify the content type
//   },
//   body: JSON.stringify({
//     link: linkToSend, // Data you want to send in JSON format
//   }),
// })
//   .then((response) => {
//     if (response.ok) {
//       return response.json(); // or response.text() if the server sends non-JSON response
//     }
//     throw new Error("Network response was not ok.");
//   })
//   .then((data) => {
//     console.log("Success:", data); // Handling the success response
//   })
//   .catch((error) => {
//     console.error("Error:", error); // Handling errors
//   });
