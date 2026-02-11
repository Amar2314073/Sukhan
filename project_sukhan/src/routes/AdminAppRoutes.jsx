import { Route } from "react-router"
import { lazy } from "react"
import AdminRoute from "./guards/AdminRoute"

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"))
const AdminPoets = lazy(() => import("../pages/admin/AdminPoets"))
const AdminPoems = lazy(() => import("../pages/admin/AdminPoems"))
const AdminCollections = lazy(() => import("../pages/admin/AdminCollections"))
const AdminBooks = lazy(() => import("../pages/admin/AdminBooks"))
const AddBook = lazy(() => import("../pages/admin/AddBook"))
const EditBook = lazy(() => import("../pages/admin/EditBook"))
const AdminPoetOwnershipRequests = lazy(() => import("../pages/admin/AdminPoetOwnershipRequests"))
const AdminPoetOwners = lazy(() => import("../pages/admin/AdminPoetOwners"))


export const adminAppRoute = [
    <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="poets" element={<AdminPoets />} />
        <Route path="poems" element={<AdminPoems />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/edit/:id" element={<EditBook />} />
        <Route path='poet-ownership/requests' element={<AdminPoetOwnershipRequests />} />
        <Route path='poet-owners' element={<AdminPoetOwners />} />
    </Route>

]
