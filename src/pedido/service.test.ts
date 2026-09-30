import { beforeEach, expect, test, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})

test('con números aleatorios bajos devuelve todos los pedidos como pendientes', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  const { getPedidosPendientes } = await import('./service')
  const pedidos = await getPedidosPendientes()
  expect(pedidos).toHaveLength(7)
})

test('con números aleatorios altos no deja ningún pedido pendiente', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.9)
  const { getPedidosPendientes } = await import('./service')
  const pedidos = await getPedidosPendientes()
  expect(pedidos).toHaveLength(0)
})
