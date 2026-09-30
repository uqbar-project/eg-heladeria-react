import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { PedidoComponent } from './component'
import { Pedido } from './domain'

const { getPedidosPendientesMock } = vi.hoisted(() => ({
  getPedidosPendientesMock: vi.fn(),
}))

vi.mock('./service', () => ({
  getPedidosPendientes: getPedidosPendientesMock,
}))

const crearPedidos = () => [
  new Pedido(
    ['pistacchio', 'dulce de leche'],
    'Francia 921 - San Martín',
    'Luisa Arévalo'
  ),
  new Pedido(
    ['chocolate', 'crema tramontana', 'crema rusa'],
    'Córdoba esq. Crámer',
    'El Cholo'
  ),
  new Pedido(
    ['vainilla', 'limón', 'frutilla'],
    'Murguiondo 1519',
    'Camila Fusani'
  ),
]

beforeEach(() => {
  getPedidosPendientesMock.mockReset()
  getPedidosPendientesMock.mockResolvedValue(crearPedidos())
})

afterEach(() => {
  vi.useRealTimers()
})

test('inicialmente no tenemos pedidos', () => {
  render(<PedidoComponent />)
  const emptyRow = screen.getByTestId('no-rows')
  expect(emptyRow).toBeInTheDocument()
})

test('cuando se actualiza el servidor aparecen nuevos pedidos', async () => {
  render(<PedidoComponent />)
  await waitFor(async () => {
    const allRows = screen.queryAllByTestId('row')
    expect(allRows.length).toBe(3)
  })
})

test('el detalle informa cuántos pedidos nuevos y despachados hay', async () => {
  render(<PedidoComponent />)
  const detalle = await screen.findByText(
    'Pedidos nuevos: 3, Pedidos despachados: 0'
  )
  expect(detalle).toBeInTheDocument()
})

test('el detalle informa los pedidos despachados en una actualización posterior', async () => {
  vi.useFakeTimers()
  const lista = crearPedidos()
  getPedidosPendientesMock
    .mockResolvedValueOnce(lista)
    .mockResolvedValueOnce(lista.slice(0, 1))

  render(<PedidoComponent />)
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0)
  })
  expect(
    screen.getByText('Pedidos nuevos: 3, Pedidos despachados: 0')
  ).toBeInTheDocument()

  await act(async () => {
    await vi.advanceTimersByTimeAsync(5000)
  })
  expect(
    screen.getByText('Pedidos nuevos: 0, Pedidos despachados: 2')
  ).toBeInTheDocument()
})
