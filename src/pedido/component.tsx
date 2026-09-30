import { useRef, useState } from 'react'
import { differenceBy, isEmpty } from '../util/sets'
import './component.css'
import type { Pedido } from './domain'
import { getPedidosPendientes } from './service'

const PedidoRow = ({ pedido }: { pedido: Pedido }) => (
  <tr className="pedidoRow" data-testid="row">
    <td>{pedido.cliente}</td>
    <td>{pedido.direccion}</td>
    <td>{pedido.gustosPedidos}</td>
  </tr>
)

export const PedidoComponent = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([])
  const [detail, setDetail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const intervalRef = useRef<number | null>(null)

  const actualizarPedidos = async () => {
    try {
      const nuevosPedidosPendientes = await getPedidosPendientes()
      setError(null)
      setPedidosPendientes((oldPedidos) => {
        mostrarPedidosActualizados(oldPedidos, nuevosPedidosPendientes)
        return nuevosPedidosPendientes
      })
    } catch (e: unknown) {
      setError((e as Error).message)
      setDetail('')
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

  const mensaje = error ?? detail

  return (
    <>
      <div className="main">
        <section className="orders-heading">
          <div>
            <p className="eyebrow">OPERACIONES / DESPACHO</p>
            <h1>Pedidos</h1>
            <p className="heading-note">Seguimiento de pedidos pendientes</p>
          </div>
          <div
            className="order-count"
            role="status"
            aria-label={`${pedidosPendientes.length} pedidos en preparación`}
          >
            <strong>{pedidosPendientes.length}</strong>
            <span>en preparación</span>
          </div>
        </section>
        <div className="pedidos">
          <table>
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Domicilio de entrega</th>
                <th scope="col">Gustos</th>
              </tr>
            </thead>
            <tbody>
              {pedidosPendientes.map((pedido) => (
                <PedidoRow pedido={pedido} key={pedido.id} />
              ))}
            </tbody>
          </table>
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
      {mensaje && (
        <div className={error ? 'toast error' : 'toast'} role="status">
          {mensaje}
        </div>
      )}
    </>
  )
}
