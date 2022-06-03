import React from 'react'
import MangaCard from './MangaCard'

function MainContent(props) {

    //mangaCover={props.mangaListCover[pos]}
  return (
    <main>
        
        <div className="manga-list">
            {
                props.mangaList.map((manga,pos)=>{
                    return(
                    <MangaCard manga={manga} mangaCover={props.mangaListCover[pos]} key={pos}/>
                    )
                })
            }
        </div>
    </main>
  )
}

export default MainContent