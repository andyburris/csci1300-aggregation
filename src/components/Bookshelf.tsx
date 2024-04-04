import { Book, ShelfLocation } from "../data/book";
import { BookItem, BookItem2 } from "./BookItem";

export function Bookshelf({ books, onAddToShelf }: { books: Map<Book, ShelfLocation>, onAddToShelf: (book: Book, location: ShelfLocation | null) => void }) {
    const {reading, toRead, read} = Array.from(books).reduce((acc, [book, location]) => {
        switch(location){
            case ShelfLocation.Reading: acc.reading.push(book); break;
            case ShelfLocation.ToRead: acc.toRead.push(book); break;
            case ShelfLocation.Read: acc.read.push(book); break;
        }
        return acc;
    }, {reading: [] as Book[], toRead: [] as Book[], read: [] as Book[]});

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <p className="text-neutral-500">Reading</p>
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                    { reading.map((book) => <BookItem2 key={book.id} book={book} shelfLocation={ShelfLocation.Reading} onAddToShelf={(location) => onAddToShelf(book, location)}/>) }
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-neutral-500">To Read</p>
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                    { toRead.map((book) => <BookItem2 key={book.id} book={book} shelfLocation={ShelfLocation.ToRead} onAddToShelf={(location) => onAddToShelf(book, location)}/>) }
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-neutral-500">Already Read</p>
                <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
                    { read.map((book) => <BookItem2 key={book.id} book={book} shelfLocation={ShelfLocation.Read} onAddToShelf={(location) => onAddToShelf(book, location)}/>) }
                </div>
            </div>
        </div>
    )
}