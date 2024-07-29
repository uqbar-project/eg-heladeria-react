import './component.css'  
import { useState } from 'react'

import { differenceBy, isEmpty } from 'lodash'

import { getPedidosPendientes } from './service'
import { Pedido } from './domain'

// Muestra la información de un pedido
const PedidoRow = ({ pedido }: { pedido: Pedido }) => {
  return (<>
    <div className="pedidoRow" data-testid="row">
      <div>{pedido.cliente}</div>
      <div>{pedido.direccion}</div>
      <div>{pedido.gustosPedidos}</div>
    </div>
    <hr></hr>
  </>)
}
  
// Componente principal
export const PedidoComponent = () => {
  console.info('render')
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([])
  const [detail, setDetail] = useState<string>('')

  const actualizarPedidos = async () => {
    try {
      console.info('Actualizando pedidos pendientes')
      const nuevosPedidosPendientes = await getPedidosPendientes()
      console.info('pedidos nuevos', nuevosPedidosPendientes)
      mostrarPedidosActualizados(pedidosPendientes, nuevosPedidosPendientes)
      setPedidosPendientes(nuevosPedidosPendientes)
    } catch (e: unknown) {
      console.error(e)
      setDetail((e as Error).message)
    }
  }

  // Eliminamos el Toast a los 10 segundos
  setTimeout(() => {
    setDetail('')
  }, 10000)

  const mostrarPedidosActualizados = (pedidosPendientes: Pedido[], nuevosPedidosPendientes: Pedido[]) => {
    const idPedido = (pedido: Pedido) => pedido.id
    const cuantosPedidosNuevos = differenceBy(nuevosPedidosPendientes, pedidosPendientes, idPedido).length
    const cuantosPedidosDespachados = differenceBy(pedidosPendientes, nuevosPedidosPendientes, idPedido).length
    setDetail(`Pedidos nuevos: ${cuantosPedidosNuevos}, Pedidos despachados: ${cuantosPedidosDespachados}`)
  }

  // render propiamente dicho
  return (
    <div className="main">
      <h3>Pedidos</h3>
      <div className="pedidos">
        <div className="header">
          <div>Cliente</div>
          <div>Domicilio de entrega</div>
          <div>Gustos</div>
        </div>
        {pedidosPendientes.map((pedido: Pedido, i: number) => {
          return <PedidoRow pedido={pedido} key={'pedido' + i}/>
        })}
        {isEmpty(pedidosPendientes) && 
          <>
            <span data-testid="no-rows">No hay pedidos pendientes</span>
            <hr/>
          </>
        }
      </div>
      <br/>
      <button className="actualizar" data-testid="actualizar" onClick={ () => { actualizarPedidos() } }>Actualizar pedidos</button>
      {detail && <div className="toast">{detail}</div>}
    </div>
  )

}