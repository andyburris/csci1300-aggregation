import { ArrowsDownUp, Calendar, ChartLineUp, FunnelSimple, TextAa, User } from "@phosphor-icons/react/dist/ssr";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Book, ShelfLocation } from "../data/book";
import { BookItem } from "./BookItem";
import { Button } from "./Button";
import { DropdownContent, DropdownItem } from "./Dropdown";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

export interface DiscoveryListProps {
    books: Book[] | null;
    searchTerm: string;
    currentShelf: Map<Book, ShelfLocation>;
    onAddToShelf: (book: Book, location: ShelfLocation | null) => void;
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
        <div className="flex flex-col gap-1 -mx-2">
            <input 
                placeholder="Search for books" 
                className="w-full shadow-outset p-3 rounded-xl"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
            />        
            <div className="flex items-center flex-wrap gap-1">
                <Dropdown.Root>
                    <Dropdown.Trigger asChild>
                        <Button>
                            <FunnelSimple/> 
                            <p>
                                { (hasEbook !== null) && (hasEbook ? "Only ebooks, " : "Without ebooks, ") }
                                <span className="text-neutral-900">{ selectedSubjects.length === 0 ? "All" : selectedSubjects.length} </span>
                                { selectedSubjects.length === 1 ? "subject" : "subjects" }
                            </p>
                        </Button>
                    </Dropdown.Trigger>
                    <DropdownContent align="start">
                        <Dropdown.Group>
                            <Dropdown.Label className="p-3 text-neutral-500">Ebook</Dropdown.Label>
                            <DropdownItem onSelect={() => setHasEbook(null)} text="All" isSelected={hasEbook == null}/>
                            <DropdownItem onSelect={() => setHasEbook(true)} text="Yes" isSelected={hasEbook == true}/>
                            <DropdownItem onSelect={() => setHasEbook(false)} text="No" isSelected={hasEbook == false}/>
                        </Dropdown.Group>

                        <Dropdown.Group>
                            <Dropdown.Label className="p-3 text-neutral-500">Subject</Dropdown.Label>
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
                        </Dropdown.Group>
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