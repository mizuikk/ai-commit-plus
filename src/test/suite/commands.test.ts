import * as assert from 'assert';

suite('commands', () => {
  suite('validateTemperatureInput', () => {
    let validateTemperatureInput: (value: string) => string | undefined;

    setup(async () => {
      const mod = await import('../../commands');
      validateTemperatureInput = mod.validateTemperatureInput;
    });

    test('returns error for empty input', () => {
      assert.strictEqual(validateTemperatureInput(''), 'Temperature is required.');
    });

    test('returns error for whitespace-only input', () => {
      assert.strictEqual(validateTemperatureInput('   '), 'Temperature is required.');
    });

    test('returns error for non-numeric input', () => {
      const result = validateTemperatureInput('abc');
      assert.strictEqual(result, 'Temperature must be a number.');
    });

    test('returns error for negative temperature', () => {
      const result = validateTemperatureInput('-1');
      assert.strictEqual(result, 'Temperature must be between 0 and 2.');
    });

    test('returns error for temperature above 2', () => {
      const result = validateTemperatureInput('2.5');
      assert.strictEqual(result, 'Temperature must be between 0 and 2.');
    });

    test('returns undefined for valid temperature 0', () => {
      assert.strictEqual(validateTemperatureInput('0'), undefined);
    });

    test('returns undefined for valid temperature 2', () => {
      assert.strictEqual(validateTemperatureInput('2'), undefined);
    });

    test('returns undefined for valid temperature 0.7', () => {
      assert.strictEqual(validateTemperatureInput('0.7'), undefined);
    });
  });
});
