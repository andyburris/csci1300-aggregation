export class Book{
    public constructor(
        public id: string,
        public title: string,
        public author: string,
        public image: string | null,
    ) {}
}

export enum ShelfLocation {
    ToRead = "to-read",
    Reading = "reading",
    Read = "read"
}