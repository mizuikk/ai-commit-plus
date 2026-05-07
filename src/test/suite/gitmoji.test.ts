import * as assert from 'assert';

suite('gitmoji', () => {
  suite('getGitmojiForCommitType', () => {
    test('returns ✨ for feat', async () => {
      const { getGitmojiForCommitType } = await import('../../gitmoji');
      assert.strictEqual(getGitmojiForCommitType('feat'), '✨');
    });

    test('returns ♻️ for refactor', async () => {
      const { getGitmojiForCommitType } = await import('../../gitmoji');
      assert.strictEqual(getGitmojiForCommitType('refactor'), '♻️');
    });

    test('throws for unknown type', async () => {
      const { getGitmojiForCommitType } = await import('../../gitmoji');
      assert.throws(() => getGitmojiForCommitType('unknown' as any));
    });
  });

  suite('COMMIT_TYPE_REFERENCES', () => {
    test('every entry has a non-empty gitmojiCode', async () => {
      const { COMMIT_TYPE_REFERENCES } = await import('../../gitmoji');
      for (const ref of COMMIT_TYPE_REFERENCES) {
        assert.ok(ref.gitmojiCode, `Missing gitmojiCode for type: ${ref.type}`);
      }
    });
  });
});
