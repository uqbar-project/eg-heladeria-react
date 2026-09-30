import { useRef, useState } from 'react'
import { differenceBy, isEmpty } from '../util/sets'
import './component.css'
import type { Pedido } from './domain'
import { getPedidosPendientes } from './service'

const PedidoRow = ({ pedido }: { pedido: Pedido }) => (
  <>
    <div className="pedidoRow" data-testid="row">
      <div>{pedido.cliente}</div>
      <div>{pedido.direccion}</div>
      <div>{pedido.gustosPedidos}</div>
    </div>
  </>
)

export const PedidoComponent = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([])
  const [detail, setDetail] = useState<string>('')

  const intervalRef = useRef<number | null>(null)

  const actualizarPedidos = async () => {
    try {
      const nuevosPedidosPendientes = await getPedidosPendientes()
      setPedidosPendientes((oldPedidos) => {
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
    <>
      <div className="main">
        <section className="orders-heading">
          <div>
            <p className="eyebrow">OPERACIONES / DESPACHO</p>
            <h1>Pedidos</h1>
            <p className="heading-note">Seguimiento de pedidos pendientes</p>
          </div>
          <div className="order-count" aria-label={`${pedidosPendientes.length} pedidos en preparación`}>
            <strong>{pedidosPendientes.length}</strong>
            <span>en preparación</span>
          </div>
        </section>
        <div className="pedidos">
          <div className="header">
            <div>Cliente</div>
            <div>Domicilio de entrega</div>
            <div>Gustos</div>
          </div>
          {pedidosPendientes.map((pedido) => (
            <PedidoRow pedido={pedido} key={pedido.id} />
          ))}
          {isEmpty(pedidosPendientes) && (
            <div className="empty-state">
              <span className="empty-mark" aria-hidden="true">
                ✳
              </span>
              <span data-testid="no-rows">No hay pedidos pendientes</span>
              <p>Cuando entre uno, lo vas a ver acá.</p>
            </div>
          )}
        </div>
      </div>
      {detail && (
        <div className="toast" role="status">
          {detail}
        </div>
      )}
    </>
  )
}
