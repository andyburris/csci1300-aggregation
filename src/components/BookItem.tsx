import { BookOpen, Bookmark, Books, ListHeart, MinusCircle } from "@phosphor-icons/react/dist/ssr"
import * as Dropdown from "@radix-ui/react-dropdown-menu"
import { Book, ShelfLocation } from "../data/book"
import { Button } from "./Button"
import { DropdownContent, DropdownItem } from "./Dropdown"

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
                <p className="text-sm text-neutral-500">
                    {book.year >= 0 ? book.year : "Unknown"} • {(book.subject[0] ?? "Unknown") + (book.subject.length > 1 ? ` +${book.subject.length - 1}` : "")} • {`${book.ebooks} ebook${book.ebooks === 1 ? "" : "s"}`}
                </p>
            </div>
            <div className="flex flex-shrink-0">
                { shelfLocation !== null &&
                    <Button onClick={() => onAddToShelf(null)} aria-label="Remove from bookshelf">
                        <MinusCircle/>
                    </Button>
                }
                <BookItemDropdown shelfLocation={shelfLocation} onAddToShelf={onAddToShelf}/>
            </div>
        </div>
    )
}

export function BookItem2({ book, shelfLocation, onAddToShelf }: { book: Book, shelfLocation: ShelfLocation | null, onAddToShelf: (location: ShelfLocation | null) => void }) {
    return (
        <div className="flex flex-col gap-3">
            <div className={
                "flex flex-shrink-0 -skew-y-3 relative ml-3 my-3"
                + " after:absolute after:-top-4 after:left-0 after:w-32 after:h-4 after:bg-neutral-50 after:border-t after:border-r after:border-neutral-300 after:skew-x-[45deg] after:origin-bottom-left after:rounded-tr-lg"
            }>
                <div className="z-10 backdrop-blur absolute top-0 -left-4 w-4 h-full skew-y-[45deg] origin-bottom-right rounded-bl-lg border border-[rgba(0,0,0,.12)]"></div>
                { book.image
                    ? <img src={book.image} alt={book.title} className="absolute top-0 -left-4 w-4 h-full skew-y-[45deg] origin-bottom-right rounded-bl-lg border border-[rgba(0,0,0,.12)]"/>
                    : <div className="absolute top-0 -left-4 w-4 h-full skew-y-[45deg] origin-bottom-right rounded-bl-lg border border-[rgba(0,0,0,.12)] bg-neutral-200"/>
                }
                { book.image 
                    ? <img src={book.image} alt={book.title} className="w-32 h-56 object-cover rounded-br-md border border-l-0 border-[rgba(0,0,0,.12)]"/>
                    : <div className="w-32 h-56 bg-neutral-200 rounded-br-md border border-l-0 border-[rgba(0,0,0,.12)"/>
                }
            </div>
            <div className="flex">
                <div className="flex flex-col flex-grow min-h-14 justify-center gap-1">
                    <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-neutral-500">{book.author}</p>
                    </div>
                    <p className="text-sm text-neutral-500">
                        {book.year >= 0 ? book.year : "Unknown"} • {(book.subject[0] ?? "Unknown") + (book.subject.length > 1 ? ` +${book.subject.length - 1}` : "")} • {`${book.ebooks} ebook${book.ebooks === 1 ? "" : "s"}`}
                    </p>
                </div>
                <div className="flex flex-shrink-0">
                    { shelfLocation !== null &&
                        <Button onClick={() => onAddToShelf(null)} aria-label="Remove from bookshelf">
                            <MinusCircle/>
                        </Button>
                    }
                    <BookItemDropdown shelfLocation={shelfLocation} onAddToShelf={onAddToShelf}/>
                </div>
            </div>
        </div>
    )
}

function BookItemDropdown({ shelfLocation, onAddToShelf }: { shelfLocation: ShelfLocation | null, onAddToShelf: (location: ShelfLocation | null) => void }) {
    return (
        <Dropdown.Root>
        <Dropdown.Trigger asChild>
            <Button aria-label="Add to bookshelf">
                <ListHeart/>
            </Button>
        </Dropdown.Trigger>
        <DropdownContent 
            align="end" 
            onKeyDown={(e) => {
                if(e.key === "A") onAddToShelf(ShelfLocation.Read)
                if(e.key === "R") onAddToShelf(ShelfLocation.Reading)
                if(e.key === "T") onAddToShelf(ShelfLocation.ToRead)
            }}
        >
            <DropdownItem 
                onSelect={() => onAddToShelf(ShelfLocation.Reading)}
                isSelected={shelfLocation === ShelfLocation.Reading}
                icon={<BookOpen/>}
                text="Reading"
                shortcut="R"
                />
            <DropdownItem 
                onSelect={() => onAddToShelf(ShelfLocation.ToRead)}
                isSelected={shelfLocation === ShelfLocation.ToRead}
                icon={<Bookmark/>}
                text="To Read"
                shortcut="T"
                />
            <DropdownItem 
                onSelect={() => onAddToShelf(ShelfLocation.Read)}
                isSelected={shelfLocation === ShelfLocation.Read}
                icon={<Books/>}
                text="Already Read"
                shortcut="A"
                />
        </DropdownContent>
    </Dropdown.Root>
    )
}