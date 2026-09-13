window.addEventListener('DOMContentLoaded', () => {
  if (new URL(location.href).searchParams.get('error') === 'exist') {
    showErrorBanner('이미 존재하는 이메일입니다.');
  }
});
