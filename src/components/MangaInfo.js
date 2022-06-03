import React,{Component} from 'react'
import {useParams} from 'react-router-dom'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './MangaInfo.css'
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import ISO6391 from 'iso-639-1';
import { Button } from '@mui/material';

// this gives the manga info
//https://api.mangadex.org/manga/a1c7c817-4e59-43b7-9365-09675a149a6f

// this gives the chapter imgs
// https://api.mangadex.org/at-home/server/7ed7f0f6-e4f0-4b4c-acf7-6a2b7a0fdef1

// this is to get all the volume and chapters limit is 100 you have to add an offset
//https://api.mangadex.org/chapter?limit=5&offset=5&manga=${a1c7c817-4e59-43b7-9365-09675a149a6f}&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5BpublishAt%5D=asc&order%5BreadableAt%5D=asc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc

//https://api.mangadex.org/chapter?limit=5&offset=5&manga=${a1c7c817-4e59-43b7-9365-09675a149a6f&translatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5BpublishAt%5D=asc&order%5BreadableAt%5D=asc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc
//`https://api.mangadex.org/manga?limit=1&title=${title}-junction-doujinshi&includedTagsMode=AND&excludedTagsMode=OR`

//`https://api.mangadex.org/chapter?limit=100&offset=${offset}&manga=${mangaId}&translatedLanguage%5B%5D=en&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5BpublishAt%5D=asc&order%5BreadableAt%5D=asc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc`


//get the volume covers
//https://api.mangadex.org/cover?limit=100&manga%5B%5D=${a77742b1-befd-49a4-bff5-1ad4e6b0ef7b}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc

function MangaInfo() {

    const navigate = useNavigate();
    const ChapterImgPage = (chapterId) => {
        navigate(`/${title}/${chapterId}`, {state:{chapters:mangaVolumes}})
    }  

    const mangaInfoLanPage = (genre) => {
        if(genre === "All Languages"){
            navigate(`/${title}`)
        }
        else{
        navigate(`/mangaInfo/${title}/${genre}`)
        }
    }  

    const {title: title} = useParams()
    const [mangaInfo, setMangaInfo] = useState([]);
    const [mangaVolumes, setMangaVolumes] = useState([]);
    const [finalOffset, setFinalOffset] = useState(0)
    const [offset, setOffset] = useState(0)
    const [mangaCover, setMangaCover] = useState("")
    const [allVolumeCover, setAllVolumeCover] = useState([]);
    const [allVolumeIndex, setAllVolumeIndex] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mangaData, setMangaData] = useState([])
    const [checkedGenre, setCheckedGenre] = useState([]);
    const [mangaVolumes2, setMangaVolumes2] = useState([]);
    const [mangaLanguages, setMangaLanguages] = useState(["All Languages"])
    const [mangaLanguages2, setMangaLanguages2] = useState(["All Languages"])

    var v = 0;
    

    useEffect(() => {
        //GetMangaInfo();
        GetMangaInfoById();
    }, [])

    const GetMangaInfo = async () => {
        setIsLoading(true);
        const temp = await fetch(`https://api.mangadex.org/manga?limit=1&title=${title}`)
            .then(res => res.json());
        
        await setMangaInfo(temp)
        await GetMangaVolumes(temp.data[0].id, offset)
        await GetMangaCover(temp.data[0].id)
        await GetAllVolumeCovers(temp.data[0].id)
    }

    const GetMangaData = async (name) => {
        const temp = await fetch(`https://mangadb-search.herokuapp.com/mangadb/search?q=${name}&nsfw=false&limit=1&skip=0`)
            .then(res => res.json());

        setMangaData(temp.results)
    }

    const GetMangaInfoById = async () => {
        //console.log(language)
        setOffset(0)
        setIsLoading(true);
        const temp = await fetch(`https://api.mangadex.org/manga/${title}`)
            .then(res => res.json());
        
        console.log(temp)
        await setMangaInfo(temp)
        let arr = ["All Languages"]
        temp.data.attributes.availableTranslatedLanguages.map((genre,pos)=>{
            arr.push(getRightLanguage(genre))
        })
        await setMangaLanguages(arr)

        await setMangaLanguages2(mangaLanguages2.concat(temp.data.attributes.availableTranslatedLanguages))
        await GetMangaData(temp.data.attributes.title.en)

        //var x = temp.data.attributes.availableTranslatedLanguages
        await GetMangaVolumes(temp.data.id, offset)

        await GetMangaCover(temp.data.id)
        await GetAllVolumeCovers(temp.data.id)
    }

    const GetAllVolumeCovers = async (mangaId) => {
        const temp = await fetch(`https://api.mangadex.org/cover?limit=100&manga%5B%5D=${mangaId}&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5Bvolume%5D=asc`)
            .then(res => res.json());
        
        let volumeArr = []
        let JpgArr = []
        JpgArr.push(null)
        for(let i = 0; i < temp.data.length; i++){
            
            JpgArr.push(temp.data[i].attributes.fileName)
            volumeArr.push(temp.data[i].attributes.volume)
        }
        
        setAllVolumeIndex(volumeArr)

        setAllVolumeCover(JpgArr)
        setIsLoading(false)
        //console.log(volumeArr.indexOf("3"))
    }

    const GetMangaCover = async (mangaId) => {
        const temp = await fetch(`https://api.mangadex.org/cover?limit=1&manga%5B%5D=${mangaId}`)
            .then(res => res.json());
        
        setMangaCover(temp.data[0].attributes.fileName)
    }

    //&translatedLanguage%5B%5D=${language}
    const GetMangaVolumes = async (mangaId,offset,) => {
        //await timeout(3000); //for 1 sec delay
       
        const temp = await fetch(`https://api.mangadex.org/chapter?limit=100&offset=${offset}&manga=${mangaId}&order%5Bvolume%5D=asc`)
            .then(res => res.json());
        
        setFinalOffset(temp.total)
        var x = offset;
        x += 100
        setOffset(x)
    
        var mergedResult = mangaVolumes.concat(temp.data)

        mergedResult = mergedResult.sort(function(a,b) {
            return parseInt(a.attributes.chapter) - parseInt(b.attributes.chapter)
        });

        for(let i = 0 ; i < mergedResult.length; i++){
            if( mergedResult[i].attributes.volume === null || mergedResult[i].attributes.pages === 0 || mergedResult[i].attributes.title.includes("(uncensored)")){
                mergedResult.splice(i, 1);
            } 
        }
        setMangaVolumes(mergedResult)

    }


    function incrementV(num){
        v = num
    }   

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }


    function getRightLanguage(language){
        if(language.length <= 2){
            let x = ISO6391.getName(language)
            return x
        }
        else{
        switch (language){
            case "zh-hk":
                return "Traditional Chinese"
            case "pt-br":
                return "Brazilian Portugese"
            case "es-la":
                return "Latin American Spanish"
            case "ja-ro":
                return "Romanized Japanese"
            case "ko-ro":
                return "Romanized Korean"
            case "zh-ro":
                return "Romanized Chinese"
            }
        }
    }

    

    //console.log(mangaInfo)
    //console.log(allVolumeCover)
    //console.log(mangaVolumes)
    //console.log(mangaVolumes2)
    //console.log(mangaData)
    class Mangas extends Component {
        
        render(){
            if(mangaVolumes.length === 0 ){
                return
            }
            
            if(offset <= finalOffset){
                
                GetMangaVolumes(mangaInfo.data.id, offset)
            }

            return(
                <div >
                
                    
                   
                        <div className="card">

                            <div className="card-img">


                                <img src ={`https://uploads.mangadex.org/covers/${mangaInfo.data.id}/${mangaCover}`} width="500px" height="600px" />

                                <div className="card-content">

                                    
                                    <h1> {mangaInfo.title} </h1>
                                    

                                    <br/>

                                    <div>
                                    <h3>Views</h3>
                                    {mangaData[0].views}
                                    </div>

                                    <br/>

                                    <div>
                                    <h3>Rating</h3>
                                    {mangaData[0].rating.bayesian} / 10
                                    </div>

                                    <br/>

                                    <div>
                                    <h3>Author: </h3>
                                    {mangaData[0].author[0]}
                                    </div>

                                    <br/>
                                

                                    <div>
                                    <h3>Artist: </h3>
                                    {mangaData[0].artist[0]}
                                    </div>

                                    <br/>
                                    
                                    <h3>Description</h3>
                                    {mangaData[0].description.split("\r")[0]}
                                    
                                    
                                </div>
                            </div>
                        </div>
           
                    
                    <h2>Available Chapter Languages</h2>
                    {/*{mangaInfo.data.attributes.availableTranslatedLanguages}*/}
                    
                    {
                        mangaLanguages.map((genre, pos) => {
                            return (
                              <label>
                                <input
                                  className="genres"
                                  type="checkBox"
                                  name={pos}
                                  value={genre}
                                  style={{ margnLeft: "5px", marginRight: "5px" }}
                                  onChange={(e) => {
                                    mangaInfoLanPage(mangaLanguages2[pos]);
                                  }}
                                />
                                {genre}
                                {"  "}
                              </label>
                            );
                          })

                         
                    }
                        
                    <br/>
                    <br/>

                    {/*{
                        mangaVolumes.map((items, pos)=>{
                            
                            return (
                                <div key={pos} className="card">
                                    <div className="card-img">
                                    <div>
                                        {
                                            v !== items.attributes.volume ?
                                            (
                                                
                                                allVolumeCover[allVolumeIndex.indexOf(items.attributes.volume)] !== undefined ?
                                                (
                                                
                                                <div>
                                                <br/>
                                                
                                                <div> Volume {items.attributes.volume} </div>
                                                <img src={`https://uploads.mangadex.org/covers/${mangaInfo.data.id}/${allVolumeCover[allVolumeIndex.indexOf(items.attributes.volume)]}.256.jpg`}/>



                                                </div>
                                                ):
                                                ""
                                            ):
                                            ""
                                        }
                                    </div>

                                    <div className="card-content">

                                    <div onClick={() => {ChapterImgPage(items.id)} }>
                                    Ch. {items.attributes.chapter + " "} 
                                    
                                    <button>Read</button>
                                    <div>
                                        {getRightLanguage(items.attributes.translatedLanguage)}
                                    </div>
                                    </div>
                                    <br/>
                                    
                                    {incrementV(mangaVolumes[pos].attributes.volume)}
                                    </div>
                                    </div>
                               
                                </div>
                    
                            )
                        })
                        
                    }*/}

                    <h2>All Chapters</h2>

                    {
                        allVolumeCover.map((item,pos)=>{
                            return (
                                <div key={pos} className="card2">
                                
                                {
                                    pos !== 0 ?
                                    (
                                    <div className="card-img2">
                                   
                                    <div ><img src={`https://uploads.mangadex.org/covers/${mangaInfo.data.id}/${item}.256.jpg`}/> </div>
                                    <div className="card-content2">
                                    <h1> Volume {pos} </h1>
                                    <br/>
                                    {
                                        
                                        mangaVolumes.map((items,indexi)=>{

                                            if(parseInt(items.attributes.volume) !== pos){
                                                return
                                            }
                                            else{
                                                return (
                                                    <div className='img-wrapper'>

                                                    <div onClick={() => {ChapterImgPage(items.id)} }>
                                                    Ch. {items.attributes.chapter + " "} {getRightLanguage(items.attributes.translatedLanguage)}
                                                    <Button variant='contained' color="primary" style={{fontSize:"14px"}}>Read</Button>
                                                   
                                                    
                                                    </div>
                                                    <br/>
                                                    
                                                    {/*{incrementV(mangaVolumes[pos].attributes.volume)}*/}
                                                    </div>

                                                )
                                            }
                                        })
                                    }
                                    </div>
                                    </div>
                                    ):
                                    ""
                                }
                              
                                </div>

                            )
                            
                            
                        })
                       
                    }
                   
                </div>
                
            )
        }
    }


  return (
    <div>
        <Header/>
        {isLoading ? <LoadingSpinner /> : <div className="MangaInfo">  <Mangas/> </div> }
    
    </div>
  )
}

export default MangaInfo