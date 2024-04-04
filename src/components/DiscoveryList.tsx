import { useEffect, useState } from "react";
import { Book, ShelfLocation } from "../data/book";
import { BookItem } from "./BookItem";
import { useDebouncedValue } from "../utils";
import { searchBooks } from "../data/openlibrary";
import { Button } from "./Button";
import { ArrowsDownUp, BookOpenText, Calendar, ChartLineUp, FunnelSimple, TextAa, User } from "@phosphor-icons/react/dist/ssr";
import * as Dropdown from "@radix-ui/react-dropdown-menu"
import { DropdownContent, DropdownItem } from "./Dropdown";



export function DiscoveryList({ currentShelf, onAddToShelf }: { currentShelf: Map<Book, ShelfLocation>, onAddToShelf: (book: Book, location: ShelfLocation | null) => void }){
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);

    const [books, setBooks] = useState<Book[] | null>([]);
    useEffect(() => { 
        setBooks(null)
        searchBooks(debouncedSearchTerm).then((books) => setBooks(books))
    }, [debouncedSearchTerm]);

    const allSubjects = books?.flatMap((book) => book.subject) ?? [];
    const popularSubjects = allSubjects.reduce((acc, subject) => {
        if(acc.has(subject)) { acc.set(subject, (acc.get(subject) ?? 0) + 1) } else acc.set(subject, 1);
        return acc;
    }, new Map<string, number>());
    const mostPopularSubjects = Array.from(popularSubjects.entries()).sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([subject, count]) => subject);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const filteredBooks = selectedSubjects.length > 0 ? books?.filter((book) => selectedSubjects.some((subject) => book.subject.includes(subject))) : books;

    const [sort, setSort] = useState<"Relevance" | "Title" | "Author" | "Date">("Relevance")
    const sortedBooks = filteredBooks?.toSorted((a: Book, b: Book) => {
        if(sort === "Relevance") return 0;
        if(sort === "Title") return a.title.localeCompare(b.title);
        if(sort === "Author") return a.author.localeCompare(b.author);
        if(sort === "Date") return a.year - b.year;
        return 0;
    })

    return (
        <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
            <input 
                placeholder="Search for books" 
                className="w-full shadow-outset p-3 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />        
            <div className="flex items-center flex-wrap justify-between">
                <Dropdown.Root>
                    <Dropdown.Trigger asChild>
                        <Button>
                            <FunnelSimple/> 
                            <p>
                                <span className="text-neutral-900">{ selectedSubjects.length === 0 ? "All" : selectedSubjects.length} </span>
                                { selectedSubjects.length === 1 ? "subject" : "subjects" }
                            </p>
                        </Button>
                    </Dropdown.Trigger>
                    <DropdownContent align="start">
                        <DropdownItem
                            onSelect={() => setSelectedSubjects([])}
                            text="All"
                            isSelected={selectedSubjects.length === 0}
                            />
                        { mostPopularSubjects.map((subject) => 
                            <DropdownItem 
                                key={subject}
                                onSelect={() => setSelectedSubjects((prev) => prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject])}
                                isSelected={selectedSubjects.includes(subject)}
                                text={subject}
                            />
                        )}
                    </DropdownContent>
                </Dropdown.Root>
                <Dropdown.Root>
                    <Dropdown.Trigger asChild>
                        <Button>
                            <ArrowsDownUp/> <p>Sort by <span className="text-neutral-900">{sort}</span></p>
                        </Button>
                    </Dropdown.Trigger>
                    <DropdownContent align="end">
                        <DropdownItem onSelect={() => setSort("Relevance")} icon={<ChartLineUp/>} text="Relevance"/>
                        <DropdownItem onSelect={() => setSort("Title")} icon={<TextAa/>} text="Title"/>
                        <DropdownItem onSelect={() => setSort("Author")} icon={<User/>} text="Author"/>
                        <DropdownItem onSelect={() => setSort("Date")} icon={<Calendar/>} text="Release date"/>
                    </DropdownContent>
                </Dropdown.Root>
            </div>
        </div>
        { sortedBooks
            ? sortedBooks.map((book) => <BookItem 
                key={book.id} 
                book={book} 
                shelfLocation={currentShelf.get(book) ?? null}
                onAddToShelf={(location) => onAddToShelf(book, location)}/>)
            : <p>Loading...</p>
        }
    </div>

    )
}