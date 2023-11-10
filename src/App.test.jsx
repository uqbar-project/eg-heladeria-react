import { render, screen } from '@testing-library/react'
import App from './App'

test('renders a header with title', () => {
  render(<App />)
  const pedidosElement = screen.getByText('Pedidos')
  expect(pedidosElement).toBeInTheDocument()
})
