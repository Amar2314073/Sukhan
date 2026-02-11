import { Route } from "react-router"
import PrivateRoute from "./guards/PrivateRoute"
import Profile from "../pages/Profile"
import LikedPoems from "../pages/LikedPoems"
import SavedPoems from "../pages/SavedPoems"
import PoetOwnerRoute from "./guards/PoetOwnerRoute"
import PoetOwnerDashboard from "../pages/poetOwner/PoetOwnerDashboard"



export const userRoutes = [
    <Route path='/profile' element={<PrivateRoute />} >
        <Route index element={<Profile />} />
        <Route path='likedPoems' element={<LikedPoems />} />
        <Route path='savedPoems' element={<SavedPoems />} />
    </Route>,

    <Route path='/poet-owner' element={<PoetOwnerRoute />}>
        <Route index element={<PoetOwnerDashboard />} />
    </Route>
]
