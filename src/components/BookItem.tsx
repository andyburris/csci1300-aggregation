import { BookOpen, Bookmark, BookmarkSimple, Books } from "@phosphor-icons/react/dist/ssr"
import { Book, ShelfLocation } from "../data/book"

export function BookItem({ book, shelfLocation, onAddToShelf }: { book: Book, shelfLocation: ShelfLocation | null, onAddToShelf: (location: ShelfLocation | null) => void }) {
    return (
        <div className="flex gap-3">
            { book.image 
                ? <img src={book.image} alt={book.title} className="w-9 h-14 object-cover rounded flex-shrink-0"/>
                : <div className="w-9 h-14 bg-neutral-200 rounded-sm flex-shrink-0 border-l-2 border-neutral-500"/>
            }
            <div className="flex flex-col flex-grow min-h-14 justify-center">
                <p className="font-semibold">{book.title}</p>
                <p className="text-neutral-500">{book.author}</p>
            </div>
            <div className="flex flex-shrink-0">
                <button 
                    className="text-neutral-500 hover:text-neutral-900 size-10 flex items-center justify-center hover:bg-neutral-50 rounded-lg text-xl"
                    onClick={() => onAddToShelf(shelfLocation === ShelfLocation.ToRead ? null : ShelfLocation.ToRead)}
                    >
                    <BookmarkSimple weight={shelfLocation === ShelfLocation.ToRead ? "fill" : "regular"}/>
                </button>
                <button 
                    className="text-neutral-500 hover:text-neutral-900 size-10 flex items-center justify-center hover:bg-neutral-50 rounded-lg text-xl"
                    onClick={() => onAddToShelf(shelfLocation === ShelfLocation.Reading ? null : ShelfLocation.Reading)}
                    >
                    <BookOpen weight={shelfLocation === ShelfLocation.Reading ? "fill" : "regular"}/>
                </button>
                <button 
                    className="text-neutral-500 hover:text-neutral-900 size-10 flex items-center justify-center hover:bg-neutral-50 rounded-lg text-xl"
                    onClick={() => onAddToShelf(shelfLocation === ShelfLocation.Read ? null : ShelfLocation.Read)}
                    >
                    <Books weight={shelfLocation === ShelfLocation.Read ? "fill" : "regular"}/>
                </button>
            </div>
        </div>
    )
}