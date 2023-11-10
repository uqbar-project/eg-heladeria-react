
[![Build React App](https://github.com/uqbar-project/eg-heladeria-react/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/uqbar-project/eg-heladeria-react/actions/workflows/build.yml) ![coverage](./badges/coverage/coverage.svg)

## Ejemplo - Ciclo de vida de un componente React

La aplicación consiste en modelar los pedidos para una heladería:

![demo](./images/demoButton.gif)

Y en este ejemplo vamos a ver cómo invocar una función asincrónica, y su asociación con el ciclo de vida de los componentes de React.

## Arquitectura general de la aplicación

![Arquitectura - Diagrama](./images/HeladeriaCicloVidaReact.png)

En esta solución participan

- el objeto de dominio Helado
- una función asincrónica que simula pedidos pendientes
- y el componente React que tiene un botón que los dispara

Dado que nuestro componente es una función, no podemos producir efectos colaterales (o "efectos"). De hecho si utilizáramos la variante con clases tampoco podemos hacerlo dentro de la función `render()` porque es cuando se están definiendo los elementos de nuestro DOM. 

## Dominio

El objeto de dominio que representa un helado almacena información sobre los gustos, dirección, etc., un identificador autogenerado internamente (utiliza una constante encapsulada dentro del archivo), y tiene métodos para

- informar que el pedido fue entregado
- informar que se canceló la entrega del pedido (vuelve a estar pendiente)
- determinar si el pedido está o no pendiente

## Servicio

La función `getPedidosPendientes` exportada es asincrónica, ya que la intención es simular que el origen de datos puede estar fuera de la VM donde se ejecuta la aplicación React. El objetivo que cumple cada vez que es invocada es:

- aleatoriamente marcar/desmarcar pedidos como entregados o pendientes, para forzar un cambio en la lista de pedidos pendientes de la heladería
- devolver la lista con los pedidos pendientes

## Componente React

### Estado

- Necesitamos que nuestro componente reaccione ante los cambios en los pedidos pendientes, por eso formará parte de nuestro estado.
- Además vamos a guardar una referencia al componente Toast, para poder mostrar un mensaje al usuario en caso de actualizar satisfactoriamente o encontrar un error. Para ello existe un nuevo hook, [`useRef`](https://es.reactjs.org/docs/hooks-reference.html#useref).

```jsx
const [pedidosPendientes, setPedidosPendientes] = useState([])
const toast = useRef(null)
```

`useRef` es una caja donde podemos almacenar cualquier valor y reasignarlo. El valor actual está en la propiedad `current` del objeto:

```js
toast.current.show({ ... })
```

### Render

El componente React utiliza el framework [PrimeReact](https://www.primefaces.org/primereact/) para simplificar la creación de la tabla, solo debemos indicar declarativamente cuáles son las columnas que nos interesan:

```jsx
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
```

En el ejemplo, "Domicilio de entrega" es lo que figurará en nuestro Table Header, mientras que el valor de cada fila se llenará con el atributo `direccion` de cada helado.

Fíjense además que la definición del Toast hace referencia a nuestra variable de instancia `toast` del componente React.

### Eventos del componente

![React Lifecycle Methods](./images/ReactLifecycleHooks2.png)

## Disparando la consulta

Para disparar la consulta tenemos un botón que llama a una función que **actualiza el estado**, generando así un nuevo render.

### Mostrando las diferencias

Un detalle adicional que queremos mostrar es

- cuántos pedidos nuevos hay (los que no estaban anteriormente y ahora aparecen = Nuevos - Viejos, según la teoría de conjuntos)
- cuántos pedidos se entregaron (los que estaban anteriormente y ahora no están = Viejos - Nuevos, según la teoría de conjuntos)

Aquí resolvemos la diferencia de conjuntos entre los nuevos y los viejos y viceversa (gracias a la función `differenceBy` de Lodash) y mostramos el toast en caso de que haya cambios.

## Test

El test del componente

- genera un stub del service, principalmente con fines didácticos, ya que no estamos realmente consultando a un servicio externo
- para testear que no hay pedidos, PrimeReact genera un div vacío cuya clase exacta estamos verificando (no es un test que tenga mucha resiliencia pero también lo mostramos con fines didácticos)
- para testear que hay pedidos, estamos utilizando el queryByRole donde `row` hace referencia a un tag `<tr>` (lo interesante es que puede haber más de un tag html que cumpla ese rol)

```js
beforeEach(() => {
  vi.mock('./service', () => ({ 
      getPedidosPendientes: () => Promise.resolve([
        new Pedido(['pistacchio', 'dulce de leche'], 'Francia 921 - San Martín', 'Luisa Arévalo'),
        new Pedido(['chocolate', 'crema tramontana', 'crema rusa'], 'Córdoba esq. Crámer', 'El Cholo'),
        new Pedido(['vainilla', 'limón', 'frutilla'], 'Murguiondo 1519', 'Camila Fusani'),
      ])
    })
  )
})

...

test('cuando se actualiza el servidor aparecen nuevos pedidos', async () => {
  render(<PedidoComponent />)
  screen.getByTestId('actualizar').click()
  await waitFor(async () => {
    const allRows = screen.queryAllByRole('row')
    // hay que considerar el encabezado
    // es muy feo tener que hacer esto pero el componente DataTable no nos da data-testid
    expect(allRows.length).toBe(4)  
  })
```

## Bibliografía adicional

- [Estado y ciclo de vida de los componentes de React](https://es.reactjs.org/docs/state-and-lifecycle.html)
