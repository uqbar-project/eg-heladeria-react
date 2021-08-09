import React from 'react'
import { jest } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'
import { PedidoComponent } from './component'
import { Pedido } from './domain'
import './service'
import { getPedidosPendientes } from './service'

jest.mock('./service')

beforeEach(() => {
  jest.useFakeTimers()
  getPedidosPendientes.mockResolvedValue([
    new Pedido(['pistacchio', 'dulce de leche'], 'Francia 921 - San Martín', 'Luisa Arévalo'),
    new Pedido(['chocolate', 'crema tramontana', 'crema rusa'], 'Córdoba esq. Crámer', 'El Cholo'),
    new Pedido(['vainilla', 'limón', 'frutilla'], 'Murguiondo 1519', 'Camila Fusani'),
  ])
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

test('inicialmente no tenemos pedidos', () => {
  const { getAllByRole } = render(<PedidoComponent />)
  const emptyRow = getAllByRole('row').find((row) => row.className === 'p-datatable-emptymessage')
  expect(emptyRow).toBeTruthy()
})

test('cuando se actualiza el servidor aparecen nuevos pedidos', async () => {
  const { queryAllByRole } = render(<PedidoComponent />)
  jest.advanceTimersByTime(11000)
  await waitFor(async () => {
    const allRows = queryAllByRole('row')
    // hay que considerar el encabezado
    // es muy desagradable tener que hacer esto pero el componente DataTable no nos da data-testid
    expect(allRows.length).toBe(4)
  })
  
})