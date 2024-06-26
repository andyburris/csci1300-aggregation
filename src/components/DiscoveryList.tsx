import { ArrowsDownUp, Calendar, ChartLineUp, FunnelSimple, TextAa, User } from "@phosphor-icons/react/dist/ssr";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Book, BookWithLocation, ShelfLocation } from "../data/book";
import { BookItem, BookItem2 } from "./BookItem";
import { Button } from "./Button";
import { DropdownContent, DropdownItem } from "./Dropdown";
import { ArrowCounterClockwise, BookOpenText } from "@phosphor-icons/react";

export interface DiscoveryListProps {
    books: Book[] | null;
    searchTerm: string;
    currentShelf: Map<string, BookWithLocation>;
    onAddToShelf: (book: BookWithLocation) => void;
    onSearch: (term: string) => void;
}

export function DiscoveryList({ books, searchTerm, currentShelf, onAddToShelf, onSearch }: DiscoveryListProps){

    const allSubjects = books?.flatMap((book) => book.subject) ?? [];
    const popularSubjects = allSubjects.reduce((acc, subject) => {
        if(acc.has(subject)) { acc.set(subject, (acc.get(subject) ?? 0) + 1) } else acc.set(subject, 1);
        return acc;
    }, new Map<string, number>());
    const mostPopularSubjects = Array.from(popularSubjects.entries()).sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([subject, count]) => subject);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [hasEbook, setHasEbook] = useState<boolean | null>(null);
    const filteredBooks = books?.filter((book) => 
        (selectedSubjects.length === 0 || selectedSubjects.some((subject) => book.subject.includes(subject)))
        && (hasEbook === null || (hasEbook ? book.ebooks > 0 : book.ebooks <= 0))
    ) 
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
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Search for books"
            />        
            <div className="flex items-center flex-wrap gap-1">
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
                            <BookOpenText/> 
                            <p><span className="text-neutral-900">{hasEbook === null ? "All" : hasEbook ? "Only" : "Without" }</span> ebooks</p>
                        </Button>
                    </Dropdown.Trigger>
                    <DropdownContent align="start">
                        <DropdownItem onSelect={() => setHasEbook(null)} text="All" isSelected={hasEbook == null}/>
                        <DropdownItem onSelect={() => setHasEbook(true)} text="Yes" isSelected={hasEbook == true}/>
                        <DropdownItem onSelect={() => setHasEbook(false)} text="No" isSelected={hasEbook == false}/>
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
                { (hasEbook !== null || selectedSubjects.length > 0 || sort !== "Relevance") && 
                    <Button onClick={() => { setHasEbook(null); setSelectedSubjects([]); setSort("Relevance")}}>
                        <ArrowCounterClockwise/> <p>Reset</p>
                    </Button>
                }
            </div>
        </div>
        { sortedBooks && <p className="text-neutral-500">Results ({sortedBooks?.length})</p> }
        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
            { sortedBooks
                ? sortedBooks.map((book) => <BookItem2 
                    key={book.id} 
                    book={book} 
                    shelfLocation={currentShelf.get(book.id)?.location ?? null}
                    onAddToShelf={(location) => onAddToShelf({ ...book, location })}/>)
                : <p>Loading...</p>
            }
        </div>
    </div>

    )
}