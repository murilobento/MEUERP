import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Calendar, X, ChevronDown } from 'lucide-react';


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
        <div className="relative min-w-[160px] max-md:flex-1" ref={containerRef}>
            <button
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-bg-tertiary border border-transparent rounded-lg text-text-secondary cursor-pointer transition-all text-sm h-[42px] hover:bg-bg-secondary hover:border-border hover:text-text-primary ${isOpen ? 'bg-bg-primary border-primary text-primary shadow-[0_0_0_3px_var(--primary-light)]' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span>{selectedOption.label}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-bg-primary border border-border rounded-lg shadow-lg z-50 p-1 animate-slideDown min-w-[180px]">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`w-full flex items-center px-4 py-2.5 border-none bg-transparent text-text-secondary cursor-pointer rounded-md text-sm text-left transition-all hover:bg-bg-tertiary hover:text-text-primary ${opt.value === value ? 'bg-primary-light text-primary font-medium' : ''}`}
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
        <div className="flex flex-wrap gap-4 p-4 bg-bg-secondary rounded-xl border border-border mb-6 items-center max-md:flex-col max-md:items-stretch">
            <div className="flex-1 min-w-[250px] flex items-center gap-3 px-4 py-2.5 bg-bg-tertiary rounded-lg text-text-secondary border border-transparent transition-all focus-within:border-primary focus-within:text-primary">
                <Search size={18} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border-none bg-transparent w-full text-text-primary text-sm focus:outline-none min-h-[22px]"
                />
            </div>

            <div className="flex gap-3 flex-wrap items-center max-md:justify-between">
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
                    <div className="flex items-center gap-2 bg-bg-tertiary px-2 py-1 rounded-lg border border-transparent h-[42px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light max-md:w-full max-md:justify-center">
                        <input
                            type="date"
                            className="border-none bg-transparent text-text-secondary text-sm p-1 font-inherit cursor-pointer outline-none focus:text-primary"
                            onChange={(e) => onDateFilter?.(`custom_start:${e.target.value}`)}
                            placeholder="De"
                        />
                        <span className="text-text-secondary text-sm font-medium px-1 hidden sm:inline">até</span>
                        <input
                            type="date"
                            className="border-none bg-transparent text-text-secondary text-sm p-1 font-inherit cursor-pointer outline-none focus:text-primary"
                            onChange={(e) => onDateFilter?.(`custom_end:${e.target.value}`)}
                            placeholder="Até"
                        />
                    </div>
                )}

                {(searchTerm || selectedStatus !== 'all' || selectedDateRange !== 'all') && (
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-border rounded-lg text-text-secondary cursor-pointer text-sm transition-all h-[42px] hover:bg-bg-tertiary hover:text-danger hover:border-danger"
                        onClick={clearFilters}
                    >
                        <X size={16} />
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
