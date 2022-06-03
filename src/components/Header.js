import * as React from "react";
import { useState, useEffect } from "react";
// importing material UI components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import SearchedMangas from "./SearchedMangas";


function Header() {

    const [search, setSearch] = useState("");
    
    const location = useLocation();
    const navigate = useNavigate();

    const HomePage = () => {
        navigate(`/`)
    }  

    const AllMangaPage = () => {
        navigate(`/allManga`)
    }  

    const SearchedMangaPage = () => {
        navigate(`/searched/${search}`, {state:{searched:search}})
    } 
   

  return (
        <AppBar >
        
            <Toolbar>
            {/*Inside the IconButton, we 
            can render various icons*/}
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                {/*This is a simple Menu 
                Icon wrapped in Icon */}
                <MenuIcon />
            </IconButton>
            {/* The Typography component applies 
            default font weights and sizes */}
    
            <Typography variant="h6" 
                component="div" sx={{ flexGrow: 1 }}>
                <h1><strong>Manga</strong>Reader</h1>

                
            </Typography>
            <Button color="inherit" onClick={() => {AllMangaPage()}}>Vew All Manga</Button>
            <Button color="inherit" onClick={() => {HomePage()}}>Home</Button>
           
            </Toolbar>

            
            <div className="main-head">
                <form className="search-box" onSubmit={() => SearchedMangaPage()}>
                <input type="search" placeholder='Search for manga' required value={search} onChange={e => setSearch(e.target.value)}/>
                </form>
            </div>
           
        </AppBar>
        
    
  )
}

export default Header