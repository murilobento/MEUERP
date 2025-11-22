import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Calendar, X, ChevronDown } from 'lucide-react';
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

interface FilterSelectProps {
    icon: React.ReactNode;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    label?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ icon, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="filter-select-container" ref={containerRef}>
            <button
                className={`filter-select-trigger min-h-[44px] sm:min-h-[40px] ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="trigger-content">
                    {icon}
                    <span>{selectedOption.label}</span>
                </div>
                <ChevronDown size={14} className={`trigger-arrow ${isOpen ? 'rotated' : ''}`} />
            </button>

            {isOpen && (
                <div className="filter-select-dropdown">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`filter-select-option min-h-[44px] sm:min-h-[40px] ${opt.value === value ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

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

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        if (onStatusFilter) onStatusFilter(value);
    };

    const handleDateChange = (value: string) => {
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

    const dateOptions = [
        { label: 'Todas as datas', value: 'all' },
        { label: 'Hoje', value: 'today' },
        { label: 'Ontem', value: 'yesterday' },
        { label: 'Mês Atual', value: 'thisMonth' },
        { label: 'Mês Anterior', value: 'lastMonth' },
        { label: 'Personalizado', value: 'custom' },
    ];

    return (
        <div className="filter-bar flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="filter-search w-full sm:flex-1">
                <Search size={18} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="min-h-[44px] sm:min-h-[40px]"
                />
            </div>

            <div className="filter-actions flex-wrap gap-2 sm:gap-3">
                {onStatusFilter && (
                    <FilterSelect
                        icon={<Filter size={16} />}
                        value={selectedStatus}
                        options={statusOptions}
                        onChange={handleStatusChange}
                    />
                )}

                {onDateFilter && (
                    <FilterSelect
                        icon={<Calendar size={16} />}
                        value={selectedDateRange}
                        options={dateOptions}
                        onChange={handleDateChange}
                    />
                )}

                {/* Render date inputs if 'custom' is selected or if onDateRangeChange is provided without onDateFilter (optional usage) */}
                {selectedDateRange === 'custom' && onDateFilter && (
                    <div className="date-range-inputs w-full sm:w-auto flex-col sm:flex-row gap-2">
                        <input
                            type="date"
                            className="filter-date-input min-h-[44px] sm:min-h-[40px]"
                            onChange={(e) => onDateFilter(`custom_start:${e.target.value}`)}
                            placeholder="De"
                        />
                        <span className="date-separator hidden sm:inline">até</span>
                        <input
                            type="date"
                            className="filter-date-input min-h-[44px] sm:min-h-[40px]"
                            onChange={(e) => onDateFilter(`custom_end:${e.target.value}`)}
                            placeholder="Até"
                        />
                    </div>
                )}

                {(searchTerm || selectedStatus !== 'all' || selectedDateRange !== 'all') && (
                    <button className="clear-filters-btn min-h-[44px] sm:min-h-[40px]" onClick={clearFilters}>
                        <X size={16} />
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
