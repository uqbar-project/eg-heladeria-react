import { formatearGusto } from "src/util/strings"

var lastId = 1

export class Pedido {

  constructor(gustos = [], direccion = '', cliente = '', despachado = false) {
    this.gustos = gustos
    this.direccion = direccion
    this.cliente = cliente
    this.despachado = despachado
    this.id = lastId++
  }

  entregar() {
    this.despachado = true
  }

  cancelar() {
    this.despachado = false
  }

  estaPendiente() {
    return !this.despachado
  }

  get gustosPedidos() {
    return this.gustos.map((gusto) => formatearGusto(gusto)).join(', ')
  }
}

