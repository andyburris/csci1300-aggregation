import { useEffect, useState } from "react";
import { Book, ShelfLocation } from "../data/book";
import { BookItem } from "./BookItem";
import { func } from "prop-types";
import { useDebouncedValue } from "../utils";
import { searchBooks } from "../data/openlibrary";

export function DiscoveryList({ currentShelf, onAddToShelf }: { currentShelf: Map<Book, ShelfLocation>, onAddToShelf: (book: Book, location: ShelfLocation | null) => void }){
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);

    const [books, setBooks] = useState<Book[] | null>([]);
    useEffect(() => { 
        setBooks(null)
        searchBooks(debouncedSearchTerm).then((books) => setBooks(books))
     }, [debouncedSearchTerm]);

    return (
        <div className="flex flex-col gap-4">
        <input 
            placeholder="Search for books" 
            className="w-full shadow-outset p-3 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />        
        { books
            ? books.map((book) => <BookItem 
                key={book.id} 
                book={book} 
                shelfLocation={currentShelf.get(book) || null}
                onAddToShelf={(location) => onAddToShelf(book, location)}/>)
            : <p>Loading...</p>
        }
    </div>

    )
}