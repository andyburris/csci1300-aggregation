import { BookOpen, Bookmark, BookmarkSimple, Books, Check, ListHeart, ListPlus, MinusCircle } from "@phosphor-icons/react/dist/ssr"
import { Book, ShelfLocation } from "../data/book"
import * as Dropdown from "@radix-ui/react-dropdown-menu"
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
                <p className="text-sm text-neutral-500">{book.year} • {(book.subject[0] ?? "Unknown") + (book.subject.length > 1 ? ` +${book.subject.length - 1}` : "")}</p>
            </div>
            <div className="flex flex-shrink-0">
                { shelfLocation !== null &&
                    <Button onClick={() => onAddToShelf(null)} aria-label="Remove from bookshelf">
                        <MinusCircle/>
                    </Button>
                }
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
            </div>
        </div>
    )
}