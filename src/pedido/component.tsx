import './component.css'
import { useState, useRef } from 'react'
import { getPedidosPendientes } from './service'
import { Pedido } from './domain'
import { differenceBy, isEmpty } from '../util/sets'

const PedidoRow = ({ pedido }: { pedido: Pedido }) => (
  <>
    <div className="pedidoRow" data-testid="row">
      <div>{pedido.cliente}</div>
      <div>{pedido.direccion}</div>
      <div>{pedido.gustosPedidos}</div>
    </div>
    <hr />
  </>
)

export const PedidoComponent = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([])
  const [detail, setDetail] = useState<string>('')

  const intervalRef = useRef<number | null>(null)

  const actualizarPedidos = async () => {
    try {
      const nuevosPedidosPendientes = await getPedidosPendientes()
      setPedidosPendientes(oldPedidos => {
        mostrarPedidosActualizados(oldPedidos, nuevosPedidosPendientes)
        return nuevosPedidosPendientes
      })
    } catch (e: unknown) {
      setDetail((e as Error).message)
    }
  }

  const mostrarPedidosActualizados = (oldList: Pedido[], newList: Pedido[]) => {
    const idPedido = (pedido: Pedido) => pedido.id
    const nuevos = differenceBy(newList, oldList, idPedido).length
    const despachados = differenceBy(oldList, newList, idPedido).length
    setDetail(`Pedidos nuevos: ${nuevos}, Pedidos despachados: ${despachados}`)
  }

  if (!intervalRef.current) {
    intervalRef.current = window.setInterval(actualizarPedidos, 5000)
    actualizarPedidos()
  }

  return (
    <div className="main">
      <h3>Pedidos</h3>
      <div className="pedidos">
        <div className="header">
          <div>Cliente</div>
          <div>Domicilio de entrega</div>
          <div>Gustos</div>
        </div>
        {pedidosPendientes.map(pedido => <PedidoRow pedido={pedido} key={pedido.id} />)}
        {isEmpty(pedidosPendientes) && (
          <>
            <span data-testid="no-rows">No hay pedidos pendientes</span>
            <hr />
          </>
        )}
      </div>
      {detail && <div className="toast">{detail}</div>}
    </div>
  )
}
