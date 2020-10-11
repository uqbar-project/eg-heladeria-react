import { Pedido } from './domain'

const pedidos = [
  new Pedido(['pistacchio', 'dulce de leche'], 'Francia 921 - San Martín', 'Luisa Arévalo'),
  new Pedido(['chocolate', 'crema tramontana', 'crema rusa'], 'Córdoba esq. Crámer', 'El Cholo'),
  new Pedido(['vainilla', 'limón', 'frutilla'], 'Murguiondo 1519', 'Camila Fusani'),
  new Pedido(['vainilla', 'chocolate'], 'Zapala s/n', 'Roque Erba'),
  new Pedido(['crema del cielo', 'kinotos al whisky'], 'Víctor Hugo 2921', 'Patricia Fren', true),
  new Pedido(['crema kinder', 'chocolate', 'mantecol'], 'Holanda 188', 'Edelmiro Molinari', true),
  new Pedido(['crema oreo', 'mascarpone'], 'El Hornero 19241', 'Berta Vanemerak', true),
]

const cambiarEstadoPedidos = () => {
  pedidos.forEach((pedido) => {
    const random = Math.random() * 10 + 1
    if (random > 5) {
      pedido.entregar()
    } else {
      pedido.cancelar()
    }
  })
}

export const getPedidosPendientes = async () => {
  cambiarEstadoPedidos()
  return pedidos.filter((pedido) => pedido.estaPendiente())
}