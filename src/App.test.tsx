import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('smoke test de la app', () => {
  render(<App />)
  const pedidosElement = screen.getByText('Pedidos')
  expect(pedidosElement).toBeTruthy()
})
