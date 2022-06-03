import React from 'react'
import { useNavigate } from 'react-router-dom';


function MangaCard({manga, mangaCover}) {
    const navigate = useNavigate();

    const MangaPage = (title) => {
        console.log(title)
        navigate(`/${title}`)
    }  

  return (
    <article className='manga-card'>
        <a onClick={() => {MangaPage(manga.id)}} target="_blank" rel="noreferror">

            <figure>
                {
                    mangaCover !== undefined ?
                    (
                        <div >
                            
                            <img src ={`https://uploads.mangadex.org/covers/${manga.id}/${mangaCover}.256.jpg`}></img>
                            

                            <br/>

                            <div className="mangaDescription">
                                <h1>{manga.title}</h1>
                                <br/>

                                <h3 style={{color: "white"}}>Rating:</h3> 
                                {manga.rating.bayesian} / 10
                              
                                <br/>
                                <br/>

                                <h3 style={{color: "white"}}>Views: </h3>
                                {manga.views}

                                <br/>
                                <br/>
                                

                                <h3 style={{color: "white"}}>Author: </h3>
                                {manga.author[0]}

                                <br/>
                                <br/>

                                <h3 style={{color: "white"}}>Artist: </h3>
                                {manga.artist[0]}

                                <br/>
                                <br/>

                                <h3 style={{color: "white"}}>Description: </h3>
                                {manga.description.length !== 0 ? manga.description.split("\r")[0] : "N/A" }

                            
                
                            </div>
                        </div>
                
                    ):
                    ""
                }
               
            </figure>
            
        </a>
    </article>
  )
}

export default MangaCard