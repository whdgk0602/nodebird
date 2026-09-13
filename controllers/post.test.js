jest.mock('../models', () => ({
  Post: { findAll: jest.fn() },
  Hashtag: { findOne: jest.fn() },
}));
const { Post, Hashtag } = require('../models');
const { loadMorePosts } = require('./post');

describe('loadMorePosts', () => {
  const res = { render: jest.fn() };
  const next = jest.fn();

  test('해시태그 없이 lastId 이전 게시글을 최신순으로 가져와 렌더링해야 함', async () => {
    const req = { query: { lastId: '5' }, user: null };
    const posts = [{ id: 4 }];
    Post.findAll.mockResolvedValue(posts);

    await loadMorePosts(req, res, next);

    expect(Post.findAll).toBeCalled();
    expect(res.render).toBeCalledWith('_twits.html', expect.objectContaining({ twits: posts }));
  });

  test('해시태그 쿼리가 있으면 해당 해시태그의 게시글만 가져와야 함', async () => {
    const req = { query: { lastId: '5', hashtag: '점심' }, user: null };
    const getPosts = jest.fn().mockResolvedValue([{ id: 3 }]);
    Hashtag.findOne.mockResolvedValue({ getPosts });

    await loadMorePosts(req, res, next);

    expect(getPosts).toBeCalled();
    expect(res.render).toBeCalledWith('_twits.html', expect.objectContaining({ twits: [{ id: 3 }] }));
  });

  test('존재하지 않는 해시태그면 빈 배열을 렌더링해야 함', async () => {
    const req = { query: { lastId: '5', hashtag: '없는태그' }, user: null };
    Hashtag.findOne.mockResolvedValue(null);

    await loadMorePosts(req, res, next);

    expect(res.render).toBeCalledWith('_twits.html', expect.objectContaining({ twits: [] }));
  });

  test('DB 에러 발생 시 next(error) 호출해야 함', async () => {
    const req = { query: { lastId: '5' }, user: null };
    const error = new Error('DB에러');
    Post.findAll.mockRejectedValue(error);

    await loadMorePosts(req, res, next);

    expect(next).toBeCalledWith(error);
  });
});
