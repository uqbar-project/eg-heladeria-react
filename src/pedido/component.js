import { differenceBy } from 'lodash'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Panel } from 'primereact/panel'
import { Toast } from 'primereact/toast'
import React, { createRef } from 'react'

import { getPedidosPendientes } from './service'

export class PedidoComponent extends React.Component {

  constructor(props) {
    super(props)
    this.toast = createRef()
    this.state = {
      pedidosPendientes: [],
    }
  }

  componentDidMount() {
    console.log('component did mount')
    this.timerID = setInterval(
      () => this.actualizarPedidosPendientes(),
      10000
    )
  }

  componentWillUnmount() {
    console.log('component will unmount')
    clearInterval(this.timerID)
  }

  async actualizarPedidosPendientes() {
    try {
      const pedidosPendientes = await getPedidosPendientes()
      this.setState({
        pedidosPendientes
      })
    } catch (e) {
      this.toast.current.show({ severity: 'error', detail: e.message })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const idPedido = (pedido) => pedido.id
    const idPedidosViejos = prevState.pedidosPendientes.map(idPedido)
    const idPedidosNuevos = this.state.pedidosPendientes.map(idPedido)
    if (idPedidosViejos !== idPedidosNuevos) {
      const cuantosPedidosNuevos = differenceBy(idPedidosNuevos, idPedidosViejos).length
      const cuantosPedidosViejos = differenceBy(idPedidosViejos, idPedidosNuevos).length
      const detail = `Pedidos nuevos: ${cuantosPedidosNuevos}, Pedidos despachados: ${cuantosPedidosViejos}`
      this.toast.current.show({ severity: 'success', detail })
    }
  }

  render() {
    return (
      <Panel header="Pedidos">
        <DataTable value={this.state.pedidosPendientes}>
          <Column field="cliente" header="Cliente" sortable></Column>
          <Column field="direccion" header="Domicilio de entrega" sortable></Column>
          <Column field="gustosPedidos" header="Gustos" sortable></Column>
        </DataTable>
        <Toast ref={this.toast}></Toast>
      </Panel>
    )
  }
}
