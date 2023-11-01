import { differenceBy } from 'lodash'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Panel } from 'primereact/panel'
import { Toast } from 'primereact/toast'
import { useRef, useEffect, useState } from 'react'

import { getPedidosPendientes } from './service'

export const PedidoComponent = () => {

  const [pedidosPendientes, setPedidosPendientes] = useState([])
  const toast = useRef(null)

  useEffect(() => {
    const timerID = setInterval(
      async () => {
        try {
          console.info('Actualizando pedidos pendientes')
          const nuevosPedidosPendientes = await getPedidosPendientes()
          mostrarPedidosActualizados(pedidosPendientes, nuevosPedidosPendientes)
          setPedidosPendientes(nuevosPedidosPendientes)
        } catch (e) {
          toast.current.show({ severity: 'error', detail: e.message })
        }
      },
      10000
    )

    // Importante quitar el timer ya que si no se siguen agregando intervalos para disparar los pedidos pendientes
    return () => { clearInterval(timerID) }
  })

  const mostrarPedidosActualizados = (pedidosPendientes, nuevosPedidosPendientes) => {
    const idPedido = (pedido) => pedido.id
    const cuantosPedidosNuevos = differenceBy(nuevosPedidosPendientes, pedidosPendientes, idPedido).length
    const cuantosPedidosDespachados = differenceBy(pedidosPendientes, nuevosPedidosPendientes, idPedido).length
    const detail = `Pedidos nuevos: ${cuantosPedidosNuevos}, Pedidos despachados: ${cuantosPedidosDespachados}`
    toast.current.show({ severity: 'info', detail, closable: false })
  }

  // render propiamente dicho
  return (
    <Panel header="Pedidos">
      <DataTable value={pedidosPendientes}>
        <Column data-testid="fila" field="cliente" header="Cliente" sortable></Column>
        <Column field="direccion" header="Domicilio de entrega" sortable></Column>
        <Column field="gustosPedidos" header="Gustos"></Column>
      </DataTable>
      <Toast ref={toast}></Toast>
    </Panel>
  )

}