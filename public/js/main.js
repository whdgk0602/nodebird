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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function handleFollow(button) {
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
}

function handleCommentToggle(button) {
  const list = button.nextElementSibling;
  if (list) list.hidden = !list.hidden;
}

function updateCommentCount(commentsEl) {
  const toggle = commentsEl.querySelector('.comment-toggle');
  const count = commentsEl.querySelectorAll('.comment').length;
  toggle.textContent = `댓글 ${count}개`;
  const emptyEl = commentsEl.querySelector('.comment-empty');
  if (count === 0 && !emptyEl) {
    const empty = document.createElement('div');
    empty.className = 'comment-empty';
    empty.textContent = '아직 댓글이 없습니다.';
    commentsEl.querySelector('.comment-list').prepend(empty);
  }
}

function handleCommentSubmit(form) {
  const postId = form.querySelector('.comment-post-id').value;
  const input = form.querySelector('.comment-input');
  const content = input.value.trim();
  if (!content) return;
  axios.post(`/post/${postId}/comment`, { content })
    .then((res) => {
      const comment = res.data;
      const list = form.closest('.comment-list');
      const emptyEl = list.querySelector('.comment-empty');
      if (emptyEl) emptyEl.remove();
      const div = document.createElement('div');
      div.className = 'comment';
      div.dataset.commentId = comment.id;
      div.innerHTML = `<span class="comment-author">${escapeHtml(comment.User.nick)}</span>`
        + `<span class="comment-content">${escapeHtml(comment.content)}</span>`
        + '<button type="button" class="comment-delete">삭제</button>';
      form.before(div);
      input.value = '';
      updateCommentCount(form.closest('.comments'));
    })
    .catch((err) => {
      console.error(err);
      showErrorBanner('댓글 작성에 실패했습니다.');
    });
}

function handleCommentDelete(button) {
  if (!confirm('댓글을 삭제하시겠습니까?')) return;
  const commentEl = button.closest('.comment');
  const postId = commentEl.closest('.twit').querySelector('.twit-id').value;
  const commentId = commentEl.dataset.commentId;
  axios.post(`/post/${postId}/comment/${commentId}/delete`)
    .then(() => {
      const commentsEl = commentEl.closest('.comments');
      commentEl.remove();
      updateCommentCount(commentsEl);
    })
    .catch((err) => {
      console.error(err);
      showErrorBanner('댓글 삭제에 실패했습니다.');
    });
}

const twitsContainer = document.querySelector('.twits');
if (twitsContainer) {
  twitsContainer.addEventListener('click', (e) => {
    const followBtn = e.target.closest('.twit-follow');
    if (followBtn) return handleFollow(followBtn);

    const toggleBtn = e.target.closest('.comment-toggle');
    if (toggleBtn) return handleCommentToggle(toggleBtn);

    const deleteBtn = e.target.closest('.comment-delete');
    if (deleteBtn) return handleCommentDelete(deleteBtn);
  });

  twitsContainer.addEventListener('submit', (e) => {
    const form = e.target.closest('.comment-form');
    if (form) {
      e.preventDefault();
      handleCommentSubmit(form);
    }
  });
}

const loadMoreBtn = document.getElementById('load-more');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    const params = new URLSearchParams({ lastId: loadMoreBtn.dataset.lastId });
    if (loadMoreBtn.dataset.hashtag) params.set('hashtag', loadMoreBtn.dataset.hashtag);
    loadMoreBtn.disabled = true;
    axios.get(`/post/more?${params.toString()}`)
      .then((res) => {
        const html = res.data;
        const addedCount = (html.match(/class="twit"/g) || []).length;
        if (addedCount === 0) {
          loadMoreBtn.hidden = true;
          return;
        }
        loadMoreBtn.insertAdjacentHTML('beforebegin', html);
        const twitIds = twitsContainer.querySelectorAll('.twit-id');
        loadMoreBtn.dataset.lastId = twitIds[twitIds.length - 1].value;
        if (addedCount < 10) loadMoreBtn.hidden = true;
      })
      .catch((err) => {
        console.error(err);
        showErrorBanner('더 불러오기에 실패했습니다.');
      })
      .finally(() => {
        loadMoreBtn.disabled = false;
      });
  });
}
