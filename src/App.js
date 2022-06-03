import { BrowserRouter as Router ,Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import MangaInfo from "./components/MangaInfo";
import ChapterImgs from "./components/ChapterImgs";
import SearchedMangas from "./components/SearchedMangas";
import AllMangaPage from "./components/AllMangaPage";
import MangaInfoLanguage from "./components/MangaInfoLanguage";

function App() {
	return (
		<div className="HomePage">
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/:title" element={<MangaInfo/>} />
					<Route path="/mangaInfo/:title/:language" element={<MangaInfoLanguage/>} />
					<Route path="/:title/:chapter" element={<ChapterImgs/>} />
					<Route path="/searched/:title" element={<SearchedMangas/>} />
					<Route path="/allManga" element={<AllMangaPage/>} />
				</Routes>
			</Router>
    	</div>
	);
}

export default App;
