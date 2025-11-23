import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';


export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    onSort?: (key: string, direction: 'asc' | 'desc') => void;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

function DataTable<T>({
    columns,
    data,
    pagination,
    onPageChange,
    onSort,
    onRowClick,
    isLoading = false,
    emptyMessage = 'Nenhum registro encontrado.',
}: DataTableProps<T>) {
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        if (onSort) onSort(key, direction);
    };

    if (isLoading) {
        return (
            <div className="p-12 text-center text-text-secondary bg-bg-secondary rounded-xl border border-border">
                <div className="w-[30px] h-[30px] border-[3px] border-border border-t-primary rounded-full mx-auto mb-4 animate-spin"></div>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (!isLoading && data.length === 0) {
        return (
            <div className="p-12 text-center text-text-secondary bg-bg-secondary rounded-xl border border-border">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary border overflow-hidden">
            {/* Mobile-friendly horizontal scroll wrapper */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr>
                                    {columns.map((col, index) => (
                                        <th
                                            key={index}
                                            style={{ width: col.width }}
                                            onClick={() => col.sortable && handleSort(col.key as string)}
                                            className={`p-4 bg-bg-tertiary text-text-secondary font-semibold text-sm border-b border-border whitespace-nowrap ${col.sortable ? 'cursor-pointer transition-colors hover:bg-bg-primary group' : ''}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {col.header}
                                                {col.sortable && (
                                                    <span className="opacity-50 group-hover:opacity-100">
                                                        {sortConfig?.key === col.key ? (
                                                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                                        ) : (
                                                            <ArrowUpDown size={14} />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        onClick={() => onRowClick && onRowClick(item)}
                                        className={`border-b border-border last:border-b-0 hover:bg-bg-tertiary ${onRowClick ? 'cursor-pointer transition-colors hover:bg-bg-secondary' : ''}`}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="p-4 text-text-primary text-sm">
                                                {col.render ? col.render(item) : (item as any)[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {pagination && (
                <div className="p-4 flex justify-between items-center flex-wrap gap-4 max-sm:flex-col max-sm:items-center">
                    <div className="text-sm text-text-secondary text-center sm:text-left">
                        <span className="hidden sm:inline">Mostrando </span>
                        <strong className="text-text-primary">{((pagination.page - 1) * pagination.limit) + 1}</strong> a <strong className="text-text-primary">{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> de <strong className="text-text-primary">{pagination.total}</strong>
                        <span className="hidden sm:inline"> registros</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                            className="min-w-[32px] h-[32px] flex items-center justify-center border border-border bg-transparent text-text-primary rounded-md cursor-pointer transition-all text-sm hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
                            aria-label="Página anterior"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(p => {
                                // On mobile, show fewer page numbers
                                if (window.innerWidth < 640) {
                                    return p === 1 || p === pagination.totalPages || p === pagination.page;
                                }
                                return p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1;
                            })
                            .map((p, i, arr) => (
                                <React.Fragment key={p}>
                                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-text-secondary">...</span>}
                                    <button
                                        className={`min-w-[32px] h-[32px] flex items-center justify-center border border-border bg-transparent text-text-primary rounded-md cursor-pointer transition-all text-sm hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] ${pagination.page === p ? 'bg-primary border-primary text-white' : ''}`}
                                        onClick={() => onPageChange && onPageChange(p)}
                                        aria-label={`Página ${p}`}
                                        aria-current={pagination.page === p ? 'page' : undefined}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            ))
                        }
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
                            className="min-w-[32px] h-[32px] flex items-center justify-center border border-border bg-transparent text-text-primary rounded-md cursor-pointer transition-all text-sm hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
                            aria-label="Próxima página"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
