// Select DOM elements
const stateMessageDiv = document.getElementById('stateMessage');
const fetchRepoButton = document.getElementById('fetchRepo');
const languageSelect = document.getElementById('languageSelect');

// Event listener for the language selection
languageSelect.addEventListener('change', () => {
    if (languageSelect.value) {
        fetchRepoButton.style.display = 'block'; // Show the fetch button
        stateMessageDiv.innerHTML = ''; // Clear previous messages
    } else {
        fetchRepoButton.style.display = 'none'; // Hide the fetch button
        stateMessageDiv.innerHTML = '<div class="message empty">Please select a language</div>';
    }
});

// Event listener for the fetch repository button
fetchRepoButton.addEventListener('click', fetchRandomRepository);

// Function to fetch a random repository
async function fetchRandomRepository() {
    stateMessageDiv.innerHTML = '<div class="message loading">Loading, please wait...</div>';

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=language:${languageSelect.value}&sort=stars&order=desc`);
        if (!response.ok) throw new Error('Network response was not ok'); // Check for HTTP errors
        const data = await response.json();

        if (data.items.length === 0) {
            stateMessageDiv.innerHTML = '<div class="message error">No repositories found</div>';
        } else {
            const repo = data.items[Math.floor(Math.random() * data.items.length)]; // Select a random repository
            stateMessageDiv.innerHTML = `
                <div class="message success">
                    <p><strong>${repo.name}</strong></p>
                    <p>${repo.description || 'No description available.'}</p>
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                </div>
            `;
        }
    } catch (error) {
        stateMessageDiv.innerHTML = `
            <div class="message error">Error fetching repositories: ${error.message}</div>
            <button id="retryButton">Click to retry</button>
        `;
        document.getElementById('retryButton').addEventListener('click', fetchRandomRepository); // Add retry functionality
    }
}
