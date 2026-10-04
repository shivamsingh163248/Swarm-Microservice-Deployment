const buttons = document.querySelectorAll('[data-choice]');
const feedback = document.querySelector('.feedback');

buttons.forEach((button) => {
  button.addEventListener('click', async () => {
    buttons.forEach((item) => { item.disabled = true; });
    feedback.textContent = 'Sending your vote...';

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: button.dataset.choice }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Vote could not be saved.');
      feedback.textContent = 'Vote counted. Thanks for weighing in.';
    } catch (error) {
      feedback.textContent = error.message;
      buttons.forEach((item) => { item.disabled = false; });
    }
  });
});