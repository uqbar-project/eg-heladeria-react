import { Pedido } from './domain'

test('un pedido inicialmente está pendiente', () => {
  const pedido = getPedidoDefault()
  expect(pedido.estaPendiente()).toBeTruthy()
})

test('cuando el pedido se despacha deja de estar pendiente', () => {
  const pedido = getPedidoDefault()
  pedido.entregar()
  expect(pedido.estaPendiente()).toBeFalsy()
})

test('cuando el pedido se cancela vuelve a estar pendiente', () => {
  const pedido = getPedidoDefault()
  pedido.entregar()
  pedido.cancelar()
  expect(pedido.estaPendiente()).toBeTruthy()
})

test('los pedidos concatenan los gustos en orden', () => {
  const pedido = getPedidoDefault()
  expect(pedido.gustosPedidos).toBe('Vainilla, Limón, Frutilla')
})

function getPedidoDefault() {
  return new Pedido(['vainilla', 'limón', 'frutilla'], 'Murguiondo 1519', 'Camila Fusani')
}
