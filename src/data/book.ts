export class Book{
    public constructor(
        public id: string,
        public title: string,
        public author: string,
        public image: string | null,
        public year: number,
        public subject: string[],
        public link: string,
        public ebooks: number,
    ) {}
}

export enum ShelfLocation {
    ToRead = "to-read",
    Reading = "reading",
    Read = "read"
}