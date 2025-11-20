// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'jest-canvas-mock'

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore
global.ResizeObserver = ResizeObserver

const originalGetContext = HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
  if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
    return {
      canvas: this,
      getExtension: () => null,
      getParameter: () => null,
      clear: () => null,
      clearColor: () => null,
      enable: () => null,
      disable: () => null,
      createShader: () => ({}),
      shaderSource: () => null,
      compileShader: () => null,
      createProgram: () => ({}),
      attachShader: () => null,
      linkProgram: () => null,
      useProgram: () => null,
      getProgramParameter: () => null,
      getShaderParameter: () => null,
      getShaderInfoLog: () => null,
      getProgramInfoLog: () => null,
      viewport: () => null,
      drawArrays: () => null,
      createBuffer: () => ({}),
      bindBuffer: () => null,
      bufferData: () => null,
      vertexAttribPointer: () => null,
      enableVertexAttribArray: () => null,
    }
  }
  return originalGetContext.call(this, type, ...args)
}
