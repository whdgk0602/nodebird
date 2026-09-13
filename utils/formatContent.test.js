const formatContent = require('./formatContent');

describe('formatContent', () => {
  test('일반 텍스트는 그대로 반환한다', () => {
    expect(formatContent('안녕하세요')).toBe('안녕하세요');
  });

  test('해시태그를 검색 링크로 변환한다', () => {
    expect(formatContent('오늘 #점심 맛있었다')).toBe(
      '오늘 <a href="/hashtag?hashtag=%EC%A0%90%EC%8B%AC">#점심</a> 맛있었다',
    );
  });

  test('여러 개의 해시태그를 모두 변환한다', () => {
    expect(formatContent('#커피 그리고 #디저트')).toBe(
      '<a href="/hashtag?hashtag=%EC%BB%A4%ED%94%BC">#커피</a> 그리고 <a href="/hashtag?hashtag=%EB%94%94%EC%A0%80%ED%8A%B8">#디저트</a>',
    );
  });

  test('사용자가 입력한 HTML 태그는 이스케이프해 XSS를 방지한다', () => {
    expect(formatContent('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
  });
});
