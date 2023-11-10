import { useRef, useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Panel } from 'primereact/panel'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'

import { differenceBy } from 'lodash'

import { getPedidosPendientes } from './service'

// ============================================================================================
// Para evitar el error
// backend.bundle.js:1 Uncaught (in promise) TypeError: Converting circular structure to JSON
// --> starting at object with constructor 'HTMLDivElement'
JSON.stringify = () => '{}'
//
// ============================================================================================

export const PedidoComponent = () => {

  console.info('render')
  const [pedidosPendientes, setPedidosPendientes] = useState([])

  const toast = useRef(null)

  const actualizarPedidos = async () => {
    try {
      console.info('Actualizando pedidos pendientes')
      const nuevosPedidosPendientes = await getPedidosPendientes()
      mostrarPedidosActualizados(pedidosPendientes, nuevosPedidosPendientes)
      setPedidosPendientes(nuevosPedidosPendientes)
    } catch (e) {
      toast.current.show({ severity: 'error', detail: e.message })
    }
  }

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
      <br/>
      <Button data-testid="actualizar" label="Actualizar pedidos" severity="help" rounded icon="pi pi-refresh" onClick={ () => { actualizarPedidos() } }/>
      <Toast ref={toast}></Toast>
    </Panel>
  )

}