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

  componentDidUpdate() {
    console.log('component did update')
  }

  async actualizarPedidosPendientes() {
    const toast = this.toast.current
    try {
      const pedidosPendientes = await getPedidosPendientes()
      toast.show({ severity: 'success', detail: 'Nuevos pedidos actualizados' })
      this.setState({
        pedidosPendientes
      })
    } catch (e) {
      toast.show({ severity: 'error', detail: e.message })
    }
  }

  render() {
    return (
      <Panel header="Pedidos" >
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
