import express from "express";
import "dotenv/config.js";
import { connectToDatabase } from "./db/connect.js";
import { Book } from "./model/book.model.js";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

//ROTA para cadastrar livros
app.post("/api/v1/books", async (req,res)=>{
    const{ title,subtitle,author,genre,cover }=req.body;
    try{
        const book = new Book({title, subtitle,author, genre, cover});
        await book.save(); 
        res.status(201).json({sucess:true, data:book});       
    }catch(error){
        console.error("Error saving book",error);
        res.status(500).json({sucess:false, error:"Erro durante cadastro."});
    }
});

//ROTA para consultar livros
app.get("/api/v1/books", async (req,res)=>{
    try{
        const books = await Book.find();
        res.status(200).json({sucess:true, data:books});
    }catch(error){
        console.error("Error fetching books",error);
        res.status(500).json({sucess:false, error:"Erro durante consulta dos dados."});
    }
});

//Rota para conultar por id
app.get("/api/v1/books/:id",async (req,res)=>{
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({sucess:false, error:"ID inválido."});
    }

    try{
        const book = await Book.findById(id);
        if (!book){
            return res.status(404).json({sucess:false, error:"Livro não encontrado."});
        }
        res.status(200).json({sucess:true, data:book});
    }catch(error){
        console.error("Erro de consulta por ID",error);
        res.status(500).json({sucess:false, error:"Erro durante consulta do livro."});
    }
});

app.listen (3000, ()=>{
    console.log("Server is running on port 3000. CTRL + C to stop.");
    connectToDatabase();
});
