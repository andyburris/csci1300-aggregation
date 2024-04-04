import { Book } from "./book";

export function searchBooks(term: string): Promise<Book[]> {
    if(term.trim() === "") return Promise.resolve([]);
    return fetch(`https://openlibrary.org/search.json?title=${term}`)
        .then((response) => response.json())
        .then((data) => data.docs.map((book: any) => 
            new Book(
                book.key, 
                book.title, 
                book.author_name?.join(", ") ?? "Unknown",
                book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
                book.first_publish_year ?? 0,
                book.subject ?? [])))
}

// export function getBooks(ids: string[]): Promise<Book[]> {
//     if(ids.length === 0) return Promise.resolve([]);
//     return Promise.all(ids.map((id) => fetch(`https://openlibrary.org/works/${id}.json`)
//         .then((response) => response.json())
//         .then((data) => new Book(data.key, data.title, data.author_name?.join(", ") || "Unknown", `https://covers.openlibrary.org/b/id/${data.cover_i}-M.jpg`))
//     ));
// }