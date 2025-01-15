import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import { searchGithub } from "./api/API";

function App() {
	return (
		<>
			<Nav />
			<main>
				<Outlet />
			</main>
		</>
	);
}

export default App;
