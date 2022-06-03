import React from 'react'
import {useParams} from 'react-router-dom'
import { useState, useEffect, Component } from "react";
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./ChapterImgs.css"
import LoadingSpinner from './LoadingSpinner';
import Header from './Header';
import Button from '@mui/material/Button';

//width="891px" height="1300px"
function ChapterImgs() {
    const {title: title} = useParams()
    const {chapter: chapterId} = useParams()
    const [mangaImgs, setMangaImgs] = useState([]);
    const [BaseUrl, setBaseUrl] = useState("")
    const [HashImg, setHashImg] = useState("")
    const [nextChapterIndex, setNextChapterIndex] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const GetMangaChapters = async () => {
        setIsLoading(true);
        let index = 0
        for(let i = 0; i < location.state.chapters.length; i++){
            if(chapterId === location.state.chapters[i].id){
                console.log(i)
                index = i
                setNextChapterIndex(i)
                break
            }
        }
        
        const temp = await fetch(`https://api.mangadex.org/at-home/server/${location.state.chapters[index].id}`)
            .then(res => res.json());
        
        console.log(location.state.chapters[index].id)
        console.log(temp)
        
        setMangaImgs(temp.chapter)
        setBaseUrl(temp.baseUrl)
        setHashImg(temp.chapter.hash)
        setIsLoading(false)
    }

    useEffect(() => {
        GetMangaChapters();
    }, [])

    const location = useLocation();
    const navigate = useNavigate();

    const ChapterImgPage = async (index) => {
        navigate(`/${title}/${location.state.chapters[index].id}`, {state:{chapters:location.state.chapters}})
        await window.location.reload(false)
    } 

    function handleScroll() {
        window.scroll({
          top: document.body.offsetHeight,
          left: 0, 
          behavior: 'smooth',
        });
    }

    function scrollToTop () {
        window.scrollTo({
          top: 0, 
          behavior: 'smooth'
          /* you can also use 'auto' behaviour
             in place of 'smooth' */
        });
      };
  
    //console.log(location.state.chapters)

    class MangaChapterImgs extends Component {
        
        render(){
            if(mangaImgs.length === 0){
                return(
                    console.log("Hello")
                )
            }

            return(
                <div>
                {/* show buttons based on chapter */}
                {
                    location.state.chapters[nextChapterIndex -1] !== undefined ?
                    (
                        location.state.chapters[nextChapterIndex + 1] !== undefined ?
                        (
                        <div className="prevAndNextButton">
                        <Button className="prevButton" onClick={() => {ChapterImgPage(nextChapterIndex - 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Prev Chapter</Button>
                        <Button className="scrollDownButton" onClick={handleScroll} variant='contained' color="primary" style={{fontSize:"14px"}}>Scroll Down</Button>
                        <Button className="nextButton" onClick={() => {ChapterImgPage(nextChapterIndex + 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Next Chapter</Button>
                        </div>
                        ):
                        (
                            <div className="prevAndNextButton">
                            <Button className="prevButton" onClick={() => {ChapterImgPage(nextChapterIndex - 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Prev Chapter</Button>
                            <Button className="scrollDownButton" onClick={handleScroll} variant='contained' color="primary" style={{fontSize:"14px"}}>Scroll Down</Button>
                            </div>
                        )
                    ):
                    (
                        <div className="prevAndNextButton">
                        <Button className="scrollDownButton" onClick={handleScroll} variant='contained' color="primary" style={{fontSize:"14px"}}>Scroll Down</Button>
                        <Button className="nextButton" onClick={() => {ChapterImgPage(nextChapterIndex + 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Next Chapter</Button>
                        </div>
                    )
                }

                <div>Volume: {location.state.chapters[nextChapterIndex].attributes.volume}</div>
                <div>Chapter: {location.state.chapters[nextChapterIndex].attributes.chapter}</div>
                {

                    mangaImgs.dataSaver.map((items,pos)=>{
                        return(
                            <div key = {pos}>
                                <img src={`${BaseUrl}/data-saver/${HashImg}/${items}`}/>
                                <br/>
                                Page {pos}
                                <br/>
                                <br/>
                            </div>
                        )
                    })
                }

                {/* show buttons based on chapter */}
                {
                    location.state.chapters[nextChapterIndex -1] !== undefined ?
                    (
                        location.state.chapters[nextChapterIndex + 1] !== undefined ?
                            (
                            <div className="prevAndNextButton">
                            <Button className="prevButton" onClick={() => {ChapterImgPage(nextChapterIndex - 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Prev Chapter</Button>
                            <Button className="scrollUpButton" onClick={scrollToTop} variant='contained' color="primary" style={{fontSize:"14px"}}>Scroll Up</Button>
                            <Button className="nextButton" onClick={() => {ChapterImgPage(nextChapterIndex + 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Next Chapter</Button>
                            </div>
                            ):
                            (
                                <div className="prevAndNextButton">
                                <Button className="prevButton" onClick={() => {ChapterImgPage(nextChapterIndex - 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Prev Chapter</Button>
                                <Button className="scrollUpButton" onClick={scrollToTop} variant='contained' color="primary" style={{fontSize:"14px"}}>Scroll Up</Button>
                                </div>
                            )
                    ):
                    (
                        <div className="prevAndNextButton">
                        <Button className="scrollUpButton" onClick={scrollToTop} variant='contained' color="primary" style={{fontSize:"14px"}}>Scroll Up</Button>
                        <Button className="nextButton" onClick={() => {ChapterImgPage(nextChapterIndex + 1)}} variant='contained' color="primary" style={{fontSize:"14px"}}>Next Chapter</Button>
                        </div>
                    )
                }
                
                </div>
                
            )
        }
    }


  return (
        
    <div>
                    
        {isLoading ? <LoadingSpinner /> : <div> <Header/> <div className='ChapterInfo'> <MangaChapterImgs/> </div> </div>}
                
    </div>
           
      
    )
}

export default ChapterImgs