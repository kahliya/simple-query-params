import { BrowserRouter, Route, Routes } from 'react-router';

import ReactRouterExample from './pages/ReactRouterExample';


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReactRouterExample />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
