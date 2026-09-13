function showErrorBanner(message) {
  const banner = document.getElementById('error-banner');
  if (!banner || !message) return;
  banner.textContent = message;
  banner.hidden = false;
}

window.addEventListener('DOMContentLoaded', () => {
  const error = new URL(location.href).searchParams.get('error');
  if (error) {
    showErrorBanner(error);
  }
});
