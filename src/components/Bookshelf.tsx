import { BookOpenText, BookmarkSimple, Books } from "@phosphor-icons/react/dist/ssr";
import { Book, BookWithLocation, ShelfLocation } from "../data/book";
import { BookItem, BookItem2 } from "./BookItem";

export function Bookshelf({ books, onAddToShelf }: { books: Map<string, BookWithLocation>, onAddToShelf: (book: BookWithLocation) => void }) {
    const {reading, toRead, read} = Array.from(books).reduce((acc, [id, book]) => {
        switch(book.location){
            case ShelfLocation.Reading: acc.reading.push(book); break;
            case ShelfLocation.ToRead: acc.toRead.push(book); break;
            case ShelfLocation.Read: acc.read.push(book); break;
        }
        return acc;
    }, {reading: [] as Book[], toRead: [] as Book[], read: [] as Book[]});

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <p className="text-neutral-500 flex items-center gap-2"><BookOpenText className="inline"/> Reading</p>
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                    { reading.map((book) => <BookItem2 key={book.id} book={book} shelfLocation={ShelfLocation.Reading} onAddToShelf={(location) => onAddToShelf({...book, location})}/>) }
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-neutral-500 flex items-center gap-2"><BookmarkSimple className="inline"/> To Read</p>
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                    { toRead.map((book) => <BookItem2 key={book.id} book={book} shelfLocation={ShelfLocation.ToRead} onAddToShelf={(location) => onAddToShelf({...book, location})}/>) }
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-neutral-500 flex items-center gap-2"><Books className="inline"/> Already Read</p>
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                    { read.map((book) => <BookItem2 key={book.id} book={book} shelfLocation={ShelfLocation.Read} onAddToShelf={(location) => onAddToShelf({...book, location})}/>) }
                </div>
            </div>
        </div>
    )
}