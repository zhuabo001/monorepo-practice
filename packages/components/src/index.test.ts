import { describe, it, expect } from 'vitest'

describe('组件测试', () => {
  it('应该能测试组件逻辑', () => {
    const component = {
      name: 'TestComponent',
      props: { message: 'hello' }
    }
    expect(component.name).toBe('TestComponent')
    expect(component.props.message).toBe('hello')
  })

  it('应该能在 jsdom 环境中运行', () => {
    // 测试浏览器环境相关功能
    const div = document.createElement('div')
    div.textContent = 'test'
    expect(div.textContent).toBe('test')
  })
})