import React from 'react'
import { useState, useEffect, Component } from "react";
import Header from './Header';
import Sidebar from './Sidebar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoadingSpinner from './LoadingSpinner';


function LandingPage() {
    
	const [topManga, setTopManga] = useState([]);
    const [topViewManga, setTopViewManga] = useState([]);
    const [topViewMangaIds, setTopViewMangaIds] = useState([]);
    const [topMangaViewCover, setTopMangaViewCover] = useState([]);
    const [topRaitingMangaCovers, setTopRaitingMangaCovers] = useState([]);
    const [raitingManga, setRaitingManga] = useState([]);
    const [raitingMangaIds, setRaitingMangaIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const MangaPage = (title) => {
        navigate(`/${title}`)
    }  

    const AllMangaPage = () => {
        navigate(`/allManga`)
    }  

    const GetTopViewManga = async () => {
        setIsLoading(true);

        {/*const temp2 = await fetch("https://mangadb-search.herokuapp.com/mangadb?sortby=views&ascending=false&nsfw=false&limit=15&skip=0")
.           then(res => res.json());

        console.log(temp2.results)*/}

        const temp = await fetch("https://api.jikan.moe/v3/top/manga/1/bypopularity")
            .then(res => res.json());
        
        setTopViewManga(temp.top.slice(0,20));
        await GetTopViewMangaIds(temp.top.slice(0,20))
        
       
    }

    const GetTopViewMangaIds = async (mangaNames) => {
        let arr = []
        for(let i = 0; i < mangaNames.length; i++){  
            {/*const temp = await fetch(`https://api.mangadex.org/manga?limit=12&title=${ mangaNames[i].title }&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`)
                .then(res => res.json());*/}

            //console.log(mangaNames[i].title)
            const temp = await fetch(`https://mangadb-search.herokuapp.com/mangadb/search?q=${mangaNames[i].title}&nsfw=false&limit=1&skip=0`)
                .then(res => res.json());

            arr.push(temp.results[0])
            //console.log(temp)
                
            {/*for(let j = 0; j < temp.data.length; j++){
                if(temp.data[j].attributes.title.en == mangaNames[i].title){
                    arr.push(temp.data[j])
                    console.log(temp)
                }
            }*/}   
            
        }

        setTopViewMangaIds(arr)
        await GetTopViewMangaCover(arr)
    }

    const GetTopViewMangaCover = async (item) => {
        //console.log(item)
        let arr = []
        for(let i = 0; i < item.length; i++){
        
        const temp = await fetch(`https://manga-dex-reader-backend.herokuapp.com/topViewManga/${item[i].id}`)
            .then(response => response.json())
        
               
        arr.push(temp.data[0].attributes.fileName)
        }
        setTopMangaViewCover(arr);
        setIsLoading(false);
    }

    /////////

    const GetTopManhwa = async () => {
        {/*const temp = await fetch("http://localhost:3000/topRatingManga",{mode: 'cors'})
            .then(res => res.json());*/}

        setIsLoading(true);
        
        const temp = await fetch("https://api.jikan.moe/v3/top/manga/1/manhwa")
            .then(res => res.json());

        
        setRaitingManga(temp.top.slice(0,20));
        await GetTopManhwaId(temp.top.slice(0,20))
       
    }

    const GetTopManhwaId = async (mangaNames) => {

        let arr = []
        for(let i = 0; i < mangaNames.length; i++){  

            {/*const temp = await fetch(`https://api.mangadex.org/manga?limit=12&title=${ mangaNames[i].title }&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc`)
                .then(res => res.json());

                
            for(let j = 0; j < temp.data.length; j++){
                if(temp.data[j].attributes.title.en == mangaNames[i].title){
                    arr.push(temp.data[j])
                    console.log(temp)
                }
            } */}

            const temp = await fetch(`https://mangadb-search.herokuapp.com/mangadb/search?q=${mangaNames[i].title}&nsfw=false&limit=1&skip=0`)
                .then(res => res.json());

            arr.push(temp.results[0])
            //console.log(temp)  
        }

        setRaitingMangaIds(arr)
        await GetTopRatingMangaCover(arr)

    }

    const GetTopRatingMangaCover = async (item) => {

        let arr = []
        for(let i = 0; i < item.length; i++){
        
        const temp = await fetch(`https://manga-dex-reader-backend.herokuapp.com/topRatingManga/${item[i].id}`)
            .then(res => res.json());
           
        arr.push(temp.data[0].attributes.fileName)
        }
        setTopRaitingMangaCovers(arr);
        setIsLoading(false);
    }

    useEffect(() => {
        GetTopViewManga();
    }, [])

    useEffect(() => {
        GetTopManhwa();
    }, [])

   
    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
    };

      
  return (
        <div>
        <Header/>
      {
         
        isLoading ? <LoadingSpinner /> :
        <div className="App"> 

        <div className="viewAllMangaBttn">
        <Button className="nextButton" onClick={() => AllMangaPage()} variant='contained' color="primary" style={{fontSize:"14px"}}>View All Manga</Button>
        </div>

        <h1>Top Manga</h1>
        <Slider {...settings} className="sliderDiv">
        {topViewMangaIds.map((item, pos) => {
            return (
              <div className="topMangas" onClick={() => MangaPage(item.id)} key={pos}>
          
              
                {
                    topMangaViewCover.length > 0 ?
                    (
                        <img src ={`https://uploads.mangadex.org/covers/${item.id}/${topMangaViewCover[pos]}`} width="227px" height="335px"/>
                    ):
                    ""
                }

                <br/>
                <br/>

                <div>
                    <h1>{item.title}</h1>
                </div>

                <br/>

                <div>
                    <h3>Rating: {item.rating.bayesian} / 10</h3>
                </div>

                <br/>

                <div>
                    <h3>Views: {item.views} </h3>
                </div>

                <br/>

                <div>
                    <h3>Author: {item.author[0]}</h3>
                </div>

                <br/>

                <div>
                    <h3>Artist: {item.artist[0]}</h3>
                </div>




               
              </div>
            );
          })}
        </Slider>


        <h1>Top Manhwa</h1>
        <Slider {...settings} className="sliderDiv">
        {raitingMangaIds.map((item, pos) => {
            return (
              <div className="topMangas" onClick={() => MangaPage(item.id)} key={pos}>
             
                {
                    topRaitingMangaCovers.length > 0 ?
                    (
                        <img src ={`https://uploads.mangadex.org/covers/${item.id}/${topRaitingMangaCovers[pos]}`} width="227px" height="335px"/>
                    ):
                    ""
                }

                <br/>
                <br/>

                <div>
                    <h1>{item.title}</h1>
                </div>

                <br/>

                <div>
                    <h3>Rating: {item.rating.bayesian} / 10</h3>
                </div>

                <br/>

                <div>
                    <h3>Views: {item.views} </h3>
                </div>

                <br/>

                <div>
                    <h3>Author: {item.author[0]}</h3>
                </div>

                <br/>

                <div>
                    <h3>Artist: {item.artist[0]}</h3>
                </div>

              </div>

            );
          })}
        </Slider>

    </div>
        }
    </div>
                
  );
}

export default LandingPage
