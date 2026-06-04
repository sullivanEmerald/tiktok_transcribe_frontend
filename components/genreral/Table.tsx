import React from "react";

// New column type supporting accessorKey, header (string/function), and cell renderer
export interface CustomTableColumn<T = any> {
    id?: string;
    accessorKey?: keyof T | string;
    accessorFn?: (row: T) => any;
    header: string | (() => React.ReactNode);
    cell?: (info: { row: T; value: any; rowIndex: number }) => React.ReactNode;
    className?: string;
}

export interface CustomTableProps<T = any> {
    columns: CustomTableColumn<T>[];
    data: T[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    onRowClick?: (row: T) => void;
    // ...other props as needed
}

const CustomTable = <T extends Record<string, any>>({
    columns,
    data,
    currentPage,
    totalPages,
    onPageChange,
    className = "",
    onRowClick,
    ...props
}: CustomTableProps<T>) => {
    return (
        <div className={`w-full bg-background border-none outline-none py-2 ${className}`} {...props}>
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 ">
                    <thead className="bg-card text-foreground uppercase text-sm font-medium tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.id ?? String(col.accessorKey ?? idx)}
                                    className="px-6 py-6 text-left text-sm font-bold text-foreground tracking-wider"
                                >
                                    {typeof col.header === "function" ? col.header() : col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-gray-300 dark:divide-gray-700">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-foreground">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    className={`hover:bg-background/70 transition ${onRowClick ? "cursor-pointer" : ""}`}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {columns.map((col, colIndex) => {
                                        const value = col.accessorFn
                                            ? col.accessorFn(row)
                                            : col.accessorKey
                                                ? row[col.accessorKey as keyof T]
                                                : undefined;
                                        return (
                                            <td
                                                key={col.id ?? String(col.accessorKey ?? colIndex)}
                                                className={`px-4 py-2 whitespace-nowrap text-sm text-gray-700 ${col.className || ""}`}
                                            >
                                                {col.cell
                                                    ? col.cell({ row, value, rowIndex })
                                                    : value ?? "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            {/* <div className="flex justify-end mt-4">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border border-gray-300 rounded-l-md ${currentPage === 1 ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
                    >
                        First
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === 1 ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 border-t border-b border-gray-300 ${page === currentPage
                                ? "bg-primary text-white font-bold"
                                : "hover:bg-blue-100 text-blue-600"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === totalPages ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border border-gray-300 rounded-r-md ${currentPage === totalPages ? "bg-gray-100 text-gray-400" : "hover:bg-gray-200"}`}
                    >
                        Last
                    </button>
                </nav>
            </div> */}
        </div>
    );
};

export default CustomTable;
