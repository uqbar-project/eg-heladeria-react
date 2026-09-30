import './App.css'
import { PedidoComponent } from './pedido/component'

function App() {
  return (
    <div className="App">
      <header className="masthead">
        <div className="brand-signature">
          <span className="brand-seal" aria-hidden="true">
            LC
          </span>
          <div>
            <p className="brand-name">la cremería</p>
            <span className="brand-location">HELADOS · SAN MARTÍN</span>
          </div>
        </div>
        <div className="shop-status">
          <span className="status-dot" aria-hidden="true" />
          <span>Sistema activo</span>
        </div>
      </header>
      <PedidoComponent />
    </div>
  )
}

export default App
