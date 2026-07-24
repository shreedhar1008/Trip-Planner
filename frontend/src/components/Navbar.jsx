import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        🌍 Trip Planner
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
      </div>
    </nav>
  )
}

export default Navbar