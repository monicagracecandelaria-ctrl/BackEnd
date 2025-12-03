import express from "express";
import { createNote, getAllNotes, updateNote, deleteNotes } from "../controller/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNotes);


export default router;