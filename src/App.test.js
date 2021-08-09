import { render } from '@testing-library/react'
import React from 'react'
import App from './App'

test('renders a header with title', () => {
  const { getByText } = render(<App />)
  const pedidosElement = getByText('Pedidos')
  expect(pedidosElement).toBeInTheDocument()
})
