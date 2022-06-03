import React from 'react'
import { useState, useEffect, Component } from "react";
import Header from './Header';
import Button from '@mui/material/Button';
import MainContent from './MainContent';
import ReactPaginate from 'react-paginate';
import LoadingSpinner from './LoadingSpinner';


function AllMangaPage() {


    const [recentManga, setRecentManga] = useState([]);
    const [recentMangaCovers, setRecentMangaCovers] = useState([]);
    const [offset, setOffset] = useState(0)
    const [pageNumber, setPageNumber] = useState(0);
    const [allManga, setAllManga] = useState([])
    const [allMangaCovers, setAllMangaCovers] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    const GetAllManga = async () => {
        setIsLoading(true);
        const temp = await fetch("https://mangadb-search.herokuapp.com/mangadb?sortby=views&ascending=false&nsfw=false&limit=42741&skip=0")
            .then(res => res.json());

        setAllManga(temp.results);
        //setIsLoading(false)
       await GetAllMangaCovers(temp.results.slice(0,12))
    }

    const GetAllMangaCovers = async (mangaIds) => {
        let arr = mangaIds
        
        let arr2 =[];
        for(let i = 0; i < 12; i++){
            const temp = await fetch(`https://api.mangadex.org/cover?limit=1&manga%5B%5D=${arr[i].id}`)
                .then(res => res.json());
            
            arr2.push(temp.data[0].attributes.fileName)
            console.log(temp)
        }
        setAllMangaCovers(arr2)
        setIsLoading(false)
    }

    



    useEffect(() => {
        GetAllManga()
    }, [])


    {/*useEffect(() => {
        GetRecentManga()
    }, [])*/}

    const GetRecentManga = async () => {
        setIsLoading(true);
        const temp = await fetch(`https://api.mangadex.org/manga?limit=100&offset=${offset}&availableTranslatedLanguage%5B%5D=en&order%5BlatestUploadedChapter%5D=desc`)
            .then(res => res.json());
        
        let y = offset
        y += 100
        setOffset(y)

        let x = recentManga.concat(temp.data)
        
        setRecentManga(x)
        let pv = pageNumber * 12
        console.log(pageNumber)
        await GetRecentMangaCovers(temp.data.slice(pv, pv + 12))
        setIsLoading(false);

    }


    const GetRecentManga2 = async () => {
        
        const temp = await fetch(`https://api.mangadex.org/manga?limit=100&offset=${offset}&availableTranslatedLanguage%5B%5D=en&order%5BlatestUploadedChapter%5D=desc`)
            .then(res => res.json());
        
        let y = offset
        y += 100
        setOffset(y)

        let x = recentManga.concat(temp.data)
        
        setRecentManga(x)
    }

    const GetRecentMangaCovers = async (mangaIds) => {
        let arr = mangaIds
        let arr2 =[]
        for(let i = 0; i < 12; i++){
            const temp = await fetch(`https://api.mangadex.org/cover?limit=1&manga%5B%5D=${arr[i].id}`)
                .then(res => res.json());
            
            arr2.push(temp.data[0].attributes.fileName)
            console.log(temp)
        }
        
        setRecentMangaCovers(arr2)
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }


    const changePage = async ({selected}) => {
        //console.log(selected)
        //setIsLoading(true);
        setPageNumber(selected);
        let pv = selected * 12
        await GetAllMangaCovers(allManga.slice(pv, pv + 12))
        //setIsLoading(false);
        
    }

    {/*let userPerPage = 12;
    let pagesVisited = pageNumber * userPerPage
    let pageCount = Math.ceil(recentManga.length / 12)*/}

    let userPerPage = 12;
    let pagesVisited = pageNumber * userPerPage
    let pageCount = Math.ceil(allManga.length / 12)


    console.log(allManga.slice(pagesVisited, pagesVisited + userPerPage))
    console.log(allMangaCovers)
  return (
    <div className="App">
            <Header/>
        {
            isLoading ? <LoadingSpinner /> : 

            <div>

            <div >
            {
                allMangaCovers.length > 0 ?
                (
                    <div>
                {/*<MainContent mangaList={recentManga.slice(pagesVisited, pagesVisited + userPerPage)} mangaListCover={recentMangaCovers.slice(pagesVisited,pagesVisited + userPerPage)}/>*/}
                <MainContent mangaList={allManga.slice(pagesVisited, pagesVisited + userPerPage)} mangaListCover={allMangaCovers}/>
            
              
                <ReactPaginate 
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
                />
                {/*<Button className="moreMangaButton" onClick={() => {GetRecentManga2()}} variant='contained' color="primary" style={{fontSize:"14px"}}>Get More Mangas</Button>*/}
                </div>
                ):
                ""
            }

            {/*<Button onClick={() => {GetRecentManga2()}} variant='contained' color="primary" style={{fontSize:"14px"}}>Get More Manga</Button>*/}
        
            </div>
            </div>
        }
    
    </div>
  )
}

export default AllMangaPage
