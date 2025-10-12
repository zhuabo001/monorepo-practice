import { describe, it, expect } from 'vitest'

describe('示例测试', () => {
  it('应该能运行基本测试', () => {
    expect(1 + 1).toBe(2)
  })

  it('应该能测试异步代码', async () => {
    const result = await Promise.resolve('hello')
    expect(result).toBe('hello')
  })
})