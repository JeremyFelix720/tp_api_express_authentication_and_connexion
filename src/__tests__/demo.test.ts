import { describe, expect, test } from 'vitest'
import demo from '../modules/demo';

describe("Description", () => {
  describe("Category", () => {
    test("Test name", () => {
      expect(demo(2, 2)).toBe(4);
    });
  })
})