// popup.js
document.getElementById('listClasses').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content.js']
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
