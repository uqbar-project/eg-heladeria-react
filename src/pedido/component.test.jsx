import { render, screen, waitFor } from '@testing-library/react'
import { PedidoComponent } from './component'
import { Pedido } from './domain'
import './service'
import { vi } from 'vitest'

beforeEach(() => {
  vi.mock('./service', () => ({ 
      getPedidosPendientes: () => Promise.resolve([
        new Pedido(['pistacchio', 'dulce de leche'], 'Francia 921 - San Martín', 'Luisa Arévalo'),
        new Pedido(['chocolate', 'crema tramontana', 'crema rusa'], 'Córdoba esq. Crámer', 'El Cholo'),
        new Pedido(['vainilla', 'limón', 'frutilla'], 'Murguiondo 1519', 'Camila Fusani'),
      ])
    })
  )
})

test('inicialmente no tenemos pedidos', () => {
  render(<PedidoComponent />)
  const emptyRow = screen.getAllByRole('row').find((row) => row.className === 'p-datatable-emptymessage')
  expect(emptyRow).toBeTruthy()
})

test('cuando se actualiza el servidor aparecen nuevos pedidos', async () => {
  render(<PedidoComponent />)
  screen.getByTestId('actualizar').click()
  await waitFor(async () => {
    const allRows = screen.queryAllByRole('row')
    // hay que considerar el encabezado
    // es muy feo tener que hacer esto pero el componente DataTable no nos da data-testid
    expect(allRows.length).toBe(4)
  })
  
})