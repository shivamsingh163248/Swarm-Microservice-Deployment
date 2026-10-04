const status = document.querySelector('#status');

async function refreshResults() {
  try {
    const response = await fetch('/api/results');
    if (!response.ok) throw new Error('The results service is not ready yet.');
    const counts = await response.json();
    const total = counts.cats + counts.dogs;
    document.querySelector('#total').textContent = total;
    document.querySelector('#cats-count').textContent = counts.cats;
    document.querySelector('#dogs-count').textContent = counts.dogs;
    document.querySelector('#cats-bar').style.width = `${total ? (counts.cats / total) * 100 : 0}%`;
    document.querySelector('#dogs-bar').style.width = `${total ? (counts.dogs / total) * 100 : 0}%`;
    status.textContent = total ? 'The tally is up to date.' : 'No votes yet. Be the first to cast one.';
  } catch (error) {
    status.textContent = error.message;
  }
}

refreshResults();
setInterval(refreshResults, 3000);