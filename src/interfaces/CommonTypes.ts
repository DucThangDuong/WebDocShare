import type { ReactNode } from "react";

export interface LayoutProps {
    children: ReactNode;
}

export class ApiError extends Error {
    status: number;
    data: object | undefined;

    constructor(status: number, message: string, data?: object) {
        super(message);
        this.status = status;
        this.data = data;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
