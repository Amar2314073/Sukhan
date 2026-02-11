import { Route } from "react-router"
import Home from "../pages/Home"
import Poems from "../pages/Poem"
import Poets from "../pages/Poets"
import Search from "../pages/Search"
import About from "../pages/About"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Collections from "../pages/Collections"
import CollectionDetail from "../pages/CollectionDetail"
import PoetProfile from "../pages/PoetProfile"
import PoemDetail from "../pages/PoemDetail"
import ExploreBooks from "../pages/ExploreBooks"
import ClaimPoetOwnership from "../pages/poetOwner/ClaimPoetOwnership"



export const publicRoutes = [
    <Route path='/login' element={<Login />} />,
    <Route path='/register' element={<Signup />} />,


    <Route path="/" element={<Home />} />,
    <Route path="/poems" element={<Poems />} />,
    <Route path="/poets" element={<Poets />} />,
    <Route path="/about" element={<About />} />,
    <Route path="/search" element={<Search />} />,
    <Route path="/collections" element={<Collections />} />,
    <Route path='collections/:id' element={<CollectionDetail />} />,
    <Route path='/poets/:id' element={<PoetProfile />} />,
    <Route path="/poems/:id" element={<PoemDetail />} />,
    <Route path="/books/explore" element={<ExploreBooks/>} />,
    <Route path='/poet-ownership/claim/:poetId' element={<ClaimPoetOwnership />} />,

]