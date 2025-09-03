import { describe, expect, test } from 'vitest'
import { differenceBy, isEmpty } from './sets'

class Persona {
    constructor(public nombre: string) {}
    nombrePiola() { return this.nombre.toLowerCase() }
}

describe('helpers de set', () => {

  test('differenceBy de una lista de personas deja solo los nombres que están en el primer conjunto y no en el segundo', () => {
      expect(differenceBy([
          new Persona("Enrique"),
          new Persona("Flavia"),
          new Persona("Claudia")
      ], [
          new Persona("enrique"),
          new Persona("Mabel"),
          new Persona("Michele")
      ],
      (persona: Persona) => persona.nombrePiola())).toEqual([new Persona("Flavia"), new Persona("Claudia")])
  })
  
  describe('isEmpty', () => {
    test('una lista vacía es true', () => {
      expect(isEmpty([])).toBe(true)
    })
  
    test('una lista no vacía es false', () => {
      expect(isEmpty([1, 2])).toBe(false)
    })
  })

})