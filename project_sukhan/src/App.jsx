import { BrowserRouter, Routes, Route } from "react-router"
import { Suspense, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import AppLoader from './shimmer/AppLoader'

import { publicRoutes } from "./routes/PublicRoutes"
import { userRoutes } from "./routes/UserRoutes"
import { adminAppRoute } from "./routes/AdminAppRoutes"

import { ThemeProvider } from "./context/ThemeContext"
import { loadUser } from "./redux/slices/authSlice"

import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import PaymentFailed from "./components/payment/PaymentFailed"

function App() {
  const dispatch = useDispatch()
  const zenMode = useSelector((state) => state.ui.zenMode)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Toaster position="bottom-center" />

        <div className="min-h-screen bg-base-100">
          <Navbar />

          <main
            className={`transition-all duration-900 ${
              zenMode ? "pt-0" : "pt-1"
            }`}
          >
            <Suspense fallback={<AppLoader />}>
              <Routes>
                <Route path='/test' element={<PaymentFailed />} />
                {publicRoutes}
                {userRoutes}
                {adminAppRoute}
              </Routes>
            </Suspense>
          </main>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
