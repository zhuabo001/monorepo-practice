import { describe, it, expect } from 'vitest'

describe('核心功能测试', () => {
  it('应该能测试核心逻辑', () => {
    const add = (a: number, b: number) => a + b
    expect(add(2, 3)).toBe(5)
  })

  it('应该能处理错误', () => {
    const throwError = () => {
      throw new Error('测试错误')
    }
    expect(throwError).toThrow('测试错误')
  })
})