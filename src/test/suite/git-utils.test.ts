import * as assert from 'assert';

suite('git-utils', () => {
  suite('getDiffStaged', () => {
    test('throws when repo has no rootUri', async () => {
      const { getDiffStaged } = await import('../../git-utils');
      try {
        await getDiffStaged({ rootUri: undefined as any, inputBox: undefined as any });
        assert.fail('Should have thrown');
      } catch (error: any) {
        assert.ok(
          error.message.includes('No workspace folder found') ||
          error.message.includes('Failed to get staged changes'),
          `Unexpected error: ${error.message}`
        );
      }
    });
  });
});
