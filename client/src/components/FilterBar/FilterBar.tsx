import React from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import './FilterBar.css';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    onSearch?: (term: string) => void;
    onStatusFilter?: (status: string) => void;
    onDateFilter?: (range: string) => void;
    statusOptions?: FilterOption[];
    placeholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    onSearch,
    onStatusFilter,
    onDateFilter,
    statusOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
    ],
    placeholder = 'Pesquisar...',
}) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedStatus, setSelectedStatus] = React.useState('all');
    const [selectedDateRange, setSelectedDateRange] = React.useState('all');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) onSearch(value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedStatus(value);
        if (onStatusFilter) onStatusFilter(value);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedDateRange(value);
        if (onDateFilter) onDateFilter(value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setSelectedDateRange('all');
        if (onSearch) onSearch('');
        if (onStatusFilter) onStatusFilter('all');
        if (onDateFilter) onDateFilter('all');
    };

    return (
        <div className="filter-bar">
            <div className="filter-search">
                <Search size={18} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="filter-actions">
                {onStatusFilter && (
                    <div className="filter-select-wrapper">
                        <Filter size={16} />
                        <select value={selectedStatus} onChange={handleStatusChange}>
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {onDateFilter && (
                    <div className="filter-select-wrapper">
                        <Calendar size={16} />
                        <select value={selectedDateRange} onChange={handleDateChange}>
                            <option value="all">Todas as datas</option>
                            <option value="today">Hoje</option>
                            <option value="yesterday">Ontem</option>
                            <option value="thisMonth">Mês Atual</option>
                            <option value="lastMonth">Mês Anterior</option>
                            <option value="custom">Personalizado...</option>
                        </select>
                    </div>
                )}

                {(searchTerm || selectedStatus !== 'all' || selectedDateRange !== 'all') && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        <X size={16} />
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
