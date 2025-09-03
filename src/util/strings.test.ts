import { expect, test } from 'vitest'
import { formatearGusto } from './strings'

test('formatear un gusto', () => {
  expect(formatearGusto('dulce de leche')).toBe('Dulce de leche')
})

test('formatear un gusto vacío', () => {
  expect(formatearGusto('')).toBe('')
})
