import { formatearGusto } from "../util/strings"

let lastId = 1

export class Pedido {
  id: number

  constructor(private gustos: string[] = [], public direccion = '', public cliente = '', private despachado = false) {
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

