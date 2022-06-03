import React from 'react'
import { useState, useEffect} from "react";
import MainContent from './MainContent';
import {useLocation} from 'react-router-dom';
import Header from './Header';

function SearchedMangas() {

    const [mangaList, setMangaList] = useState([]);
    const [searchedRecentMangaCovers, setSearchedRecentMangaCovers] = useState([]);
    const location = useLocation();
    

    {/*const GetSearchedMangaCovers = async (mangaId) => {
        let arr = []
        for(let i = 0; i < mangaId.length; i++){
            const temp = await fetch(`https://api.mangadex.org/cover?limit=1&manga%5B%5D=${mangaId[i].id}`)
                .then(res => res.json());
            
            arr.push(temp.data[0].attributes.fileName)
            console.log(temp)
        }

       setSearchedRecentMangaCovers(arr)
       
    }

    const FetchManga = async (query) => {
        const temp = await fetch(`https://api.mangadex.org/manga?limit=10&title=${query}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=asc`)
            .then(res => res.json());

        setMangaList(temp.data)
        
        await GetSearchedMangaCovers(temp.data)
    }*/}


    const GetSearchedMangaCovers = async (mangaId) => {
        let arr = []
        //console.log(mangaId.length)
        for(let i = 0; i < mangaId.length; i++){
            const temp = await fetch(`https://api.mangadex.org/cover?limit=1&manga%5B%5D=${mangaId[i].id}`)
                .then(res => res.json());
            
            arr.push(temp.data[0].attributes.fileName)
            console.log(temp)
        }

       setSearchedRecentMangaCovers(arr)
       
    }

    const FetchManga = async (query) => {
        const temp = await fetch(`https://mangadb-search.herokuapp.com/mangadb/search?q=${query}&nsfw=false&limit=10&skip=0`)
    .then(res => res.json());

        {/*const temp = await fetch(`https://api.mangadex.org/manga?limit=10&title=${query}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`)
        .then(res => res.json());*/}

        setMangaList(temp.results)
        await GetSearchedMangaCovers(temp.results)
    }




    useEffect(() => {
        FetchManga(location.state.searched);
    }, [])

    console.log(mangaList)
    console.log(searchedRecentMangaCovers)
  return (
    <div>
        <Header/>
        <MainContent mangaList={mangaList} mangaListCover={searchedRecentMangaCovers}/>
    
    </div>
  )
}

export default SearchedMangas