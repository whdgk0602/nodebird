jest.mock('../models', () => ({
  Comment: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));
const { Comment } = require('../models');
const { create, remove } = require('./comment');

describe('create', () => {
  const req = {
    user: { id: 1 },
    params: { id: '10' },
    body: { content: '댓글 내용' },
  };
  const res = { json: jest.fn(), status: jest.fn(() => res), send: jest.fn() };
  const next = jest.fn();

  test('댓글을 생성하고 작성자 정보를 포함해 응답해야 함', async () => {
    Comment.create.mockResolvedValue({ id: 5 });
    Comment.findOne.mockResolvedValue({ id: 5, content: '댓글 내용', User: { id: 1, nick: '테스터' } });

    await create(req, res, next);

    expect(Comment.create).toBeCalledWith({
      content: '댓글 내용',
      UserId: 1,
      PostId: '10',
    });
    expect(res.json).toBeCalledWith({ id: 5, content: '댓글 내용', User: { id: 1, nick: '테스터' } });
  });

  test('DB에서 에러가 발생하면 next(error) 호출함', async () => {
    const error = new Error('DB에러');
    Comment.create.mockRejectedValue(error);

    await create(req, res, next);

    expect(next).toBeCalledWith(error);
  });
});

describe('remove', () => {
  const req = { user: { id: 1 }, params: { commentId: '7' } };
  const res = { status: jest.fn(() => res), send: jest.fn() };
  const next = jest.fn();

  test('댓글이 없으면 404를 응답해야 함', async () => {
    Comment.findOne.mockResolvedValue(null);

    await remove(req, res, next);

    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith('no comment');
  });

  test('본인 댓글이 아니면 403을 응답해야 함', async () => {
    Comment.findOne.mockResolvedValue({ UserId: 2, destroy: jest.fn() });

    await remove(req, res, next);

    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith('forbidden');
  });

  test('본인 댓글이면 삭제하고 success를 응답해야 함', async () => {
    const destroy = jest.fn().mockResolvedValue();
    Comment.findOne.mockResolvedValue({ UserId: 1, destroy });

    await remove(req, res, next);

    expect(destroy).toBeCalled();
    expect(res.send).toBeCalledWith('success');
  });
});
