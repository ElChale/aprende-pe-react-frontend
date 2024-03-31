import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import './bootstrap.min.css'
import { store  } from './store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')).render(
      <React.Fragment >
            <Provider store={store} >
                  <App />
            </Provider>
      </React.Fragment>,
)
