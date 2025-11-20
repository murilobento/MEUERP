import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import './DataTable.css';

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
            <div className="datatable-loading">
                <div className="spinner"></div>
                <p>Carregando dados...</p>
            </div>
        );
    }

    if (!isLoading && data.length === 0) {
        return (
            <div className="datatable-empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="datatable-container">
            <div className="datatable-wrapper">
                <table className="datatable">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(col.key as string)}
                                    className={col.sortable ? 'sortable' : ''}
                                >
                                    <div className="th-content">
                                        {col.header}
                                        {col.sortable && (
                                            <span className="sort-icon">
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
                                className={onRowClick ? 'clickable-row' : ''}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.render ? col.render(item) : (item as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="datatable-footer">
                    <div className="pagination-info">
                        Mostrando <strong>{((pagination.page - 1) * pagination.limit) + 1}</strong> a <strong>{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> de <strong>{pagination.total}</strong> registros
                    </div>
                    <div className="pagination-controls">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                            .map((p, i, arr) => (
                                <React.Fragment key={p}>
                                    {i > 0 && arr[i - 1] !== p - 1 && <span className="pagination-ellipsis">...</span>}
                                    <button
                                        className={pagination.page === p ? 'active' : ''}
                                        onClick={() => onPageChange && onPageChange(p)}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            ))
                        }
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
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
