import { Binoculars, Books } from '@phosphor-icons/react/dist/ssr';
import * as Tabs from "@radix-ui/react-tabs";
import React, { useEffect, useState } from 'react';
import { Bookshelf } from './components/Bookshelf';
import { DiscoveryList } from './components/DiscoveryList';
import { Book, BookWithLocation, ShelfLocation } from './data/book';
import { searchBooks } from './data/openlibrary';
import logo from './logo.svg';
import { useDebouncedValue } from './utils';

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
    const [searchedBooks, setSearchedBooks] = useState<Book[] | null>([]);
    useEffect(() => { 
        setSearchedBooks(null)
        searchBooks(debouncedSearchTerm).then((books) => setSearchedBooks(books))
    }, [debouncedSearchTerm]);


	const [shelf, setShelf] = React.useState<Map<string, BookWithLocation>>(localStorage["shelf"] ? new Map(JSON.parse(localStorage["shelf"])) : new Map());

	const updateShelf = (book: BookWithLocation) => {
		setShelf((prev) => {
			const copy = new Map(prev);
			if(book.location === null) copy.delete(book.id);
			else copy.set(book.id, book);
			localStorage["shelf"] = JSON.stringify(Array.from(copy.entries()));
			return copy;
		});	
	}

	const discoveryList = <DiscoveryList 
		books={searchedBooks}
		searchTerm={searchTerm}
		currentShelf={shelf}
		onAddToShelf={updateShelf}
		onSearch={setSearchTerm}
		/>

	return (
		<main className="max-w-3xl mx-auto">
			<header className="flex flex-col gap-2 py-3">
				<div className="size-8 flex items-center justify-center bg-neutral-100 text-neutral-500 rounded-lg">
					<img src={logo} alt="Already logo"/>
				</div>
				<div className="flex flex-col">
					<h1 className="text-3xl font-displaySerif tracking-tight font-semibold">Already</h1>
					<p className="text-neutral-500">A super simple reading list</p>
				</div>
			</header>
			<Tabs.Root defaultValue="discover" className="">
				<Tabs.List className="flex -mx-4 overflow-x-scroll border-b border-neutral-300 pb-px">
					<TabTrigger value="discover"><Binoculars/>Discover</TabTrigger>
					<TabTrigger value="bookshelf"><Books/>Bookshelf <div className="text-neutral-700 bg-neutral-100 px-1 text-base rounded-full">{shelf.size}</div></TabTrigger>
				</Tabs.List>
				<Tabs.Content value="discover" className="py-4">
					<div className="flex flex-col gap-4">
						{discoveryList}
					</div>
				</Tabs.Content>
				<Tabs.Content value="bookshelf" className="py-4">
					<Bookshelf
						books={shelf}
						onAddToShelf={updateShelf}
						/>
				</Tabs.Content>
			</Tabs.Root>
		</main>
	);
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
	return (
		<Tabs.Trigger 
			value={value} 
			className="px-1 py-1 flex-shrink-0 text-neutral-500 group data-[state=active]:text-neutral-900 border-neutral-500 data-[state=active]:border-b data-[state=active]:border-neutral-900 data-[state=active]:-mb-px overflow-visible transition-colors"
		>
			<div className="flex gap-2 items-center px-3 py-2 group-hover:bg-neutral-100 rounded-lg">
				{children}
			</div>
		</Tabs.Trigger>
	)
}
	
export default App;
	