const twit = document.getElementById('twit');
const twitCounter = document.getElementById('twit-counter');
if (twit && twitCounter) {
  const updateCounter = () => {
    twitCounter.textContent = `${twit.value.length} / ${twit.maxLength}`;
  };
  twit.addEventListener('input', updateCounter);
  updateCounter();
}

const imgInput = document.getElementById('img');
if (imgInput) {
  const imgLabel = document.getElementById('img-label');
  const imgPreview = document.getElementById('img-preview');
  const imgUrl = document.getElementById('img-url');
  const defaultLabelText = imgLabel.textContent;

  imgInput.addEventListener('change', function () {
    if (!this.files[0]) return;
    const formData = new FormData();
    formData.append('img', this.files[0]);
    imgLabel.textContent = '업로드 중...';
    imgInput.disabled = true;
    axios.post('/post/img', formData)
      .then((res) => {
        imgUrl.value = res.data.url;
        imgPreview.src = res.data.url;
        imgPreview.hidden = false;
      })
      .catch((err) => {
        console.error(err);
        showErrorBanner('이미지 업로드에 실패했습니다.');
      })
      .finally(() => {
        imgLabel.textContent = defaultLabelText;
        imgInput.disabled = false;
      });
  });
}

document.querySelectorAll('.twit-follow').forEach((button) => {
  button.addEventListener('click', () => {
    const myId = document.querySelector('#my-id');
    if (!myId) return;
    const userId = button.closest('.twit').querySelector('.twit-user-id').value;
    if (userId === myId.value) return;
    if (!confirm('팔로잉하시겠습니까?')) return;
    button.disabled = true;
    axios.post(`/user/${userId}/follow`)
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        console.error(err);
        button.disabled = false;
        showErrorBanner('팔로우에 실패했습니다.');
      });
  });
});
