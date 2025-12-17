export class AppError {
    constructor(
        public message: string,
        public isCritical: boolean = false,
        public color: string = 'red'
    ) { }

    static critical(message: string, color: string = 'red'): AppError {
        return new AppError(message, true, color);
    }

    static warning(message: string, color: string = 'yellow'): AppError {
        return new AppError(message, false, color);
    }
}
