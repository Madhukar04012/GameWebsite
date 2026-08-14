import React from "react";
interface State {
    hasError: boolean;
    error: Error | null;
}
interface Props {
    children: React.ReactNode;
}
export declare class ErrorBoundary extends React.Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): {
        hasError: boolean;
        error: Error;
    };
    componentDidCatch(error: Error, info: React.ErrorInfo): void;
    render(): string | number | bigint | boolean | React.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map