import React, { Suspense, use, useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import * as Tabs from "@radix-ui/react-tabs"
import { Binoculars, Bookmark, Books, Disc } from '@phosphor-icons/react/dist/ssr';
import { getBooks, searchBooks } from './data/openlibrary';
import { BookItem } from './components/BookItem';
import { Book, ShelfLocation } from './data/book';
import { useDebouncedValue } from './utils';
import { DiscoveryList } from './components/DiscoveryList';
import { Bookshelf } from './components/Bookshelf';

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
	useEffect(() => console.log(`search term changed to ${debouncedSearchTerm}`), [debouncedSearchTerm]);
	const discoverPromise = useMemo(() => searchBooks(debouncedSearchTerm), [debouncedSearchTerm]);

	const [shelf, setShelf] = React.useState<Map<Book, ShelfLocation>>(new Map());

	const updateShelf = (book: Book, location: ShelfLocation | null) => {
		if(location === null) {
			setShelf((prev) => {
				const copy = new Map(prev);
				copy.delete(book);
				return copy;
			})
		} else {
			setShelf((prev) => new Map(prev).set(book, location));
		}
	}

	return (
			<main className="max-w-3xl mx-auto">
				<header className="flex flex-col gap-2">
					<div className="size-8 flex items-center justify-center bg-neutral-100 text-neutral-500 rounded-lg">
						<img src={logo} alt="logo"/>
					</div>
					<div className="flex flex-col">
						<p className="text-3xl font-displaySerif tracking-tight font-semibold">Already</p>
						<p className="text-neutral-500">A super simple reading list</p>
					</div>
				</header>
				<Tabs.Root defaultValue="discover">
					<Tabs.List className="flex -mx-4 my-3 px-1 overflow-x-scroll border-b border-neutral-300 pb-px">
						<TabTrigger value="discover"><Binoculars/>Discover</TabTrigger>
						<TabTrigger value="bookshelf"><Books/>Bookshelf</TabTrigger>
					</Tabs.List>
					<Tabs.Content value="discover">
						<div className="flex flex-col gap-4">
							<DiscoveryList 
								currentShelf={shelf}
								onAddToShelf={updateShelf}
								/>
						</div>
					</Tabs.Content>
					<Tabs.Content value="bookshelf">
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
			className="flex gap-2 items-center px-3 py-3 flex-shrink-0 text-neutral-500 data-[state=active]:text-neutral-900 hover:border-b hover:-mb-px border-neutral-500 data-[state=active]:border-b data-[state=active]:border-neutral-900 data-[state=active]:-mb-px overflow-visible transition-colors"
		>
			{children}
		</Tabs.Trigger>
	)
}
	
export default App;
	