import React, { useState, useEffect, useRef } from 'react';
import { supplierService } from '../../../services/supplierService';
import type { Supplier } from '../../../types';

interface SupplierAutocompleteProps {
    value: number | '';
    onChange: (value: number | '') => void;
}

const SupplierAutocomplete: React.FC<SupplierAutocompleteProps> = ({ value, onChange }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState<Supplier[]>([]);
    const [showList, setShowList] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await supplierService.list();
                setSuppliers(data.data);
            } catch (e) {
                console.error('Erro ao carregar fornecedores', e);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setFiltered([]);
            return;
        }
        const lower = query.toLowerCase();
        const matches = suppliers.filter(s =>
            s.name.toLowerCase().includes(lower) ||
            (s.document && s.document.includes(query))
        );
        setFiltered(matches);
    }, [query, suppliers]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (supplier: Supplier) => {
        onChange(supplier.id);
        setQuery(supplier.name);
        setShowList(false);
    };

    // Keep input value in sync when external value changes (e.g., editing existing product)
    useEffect(() => {
        if (value) {
            const sel = suppliers.find(s => s.id === value);
            if (sel) setQuery(sel.name);
        }
    }, [value, suppliers]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-bg-primary text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                placeholder="Selecione fornecedor..."
                value={query}
                onChange={e => { setQuery(e.target.value); setShowList(true); }}
                onFocus={() => setShowList(true)}
            />
            {showList && filtered.length > 0 && (
                <ul className="absolute top-full left-0 right-0 max-h-[200px] overflow-y-auto bg-bg-primary border border-border border-t-0 z-10 rounded-b-md shadow-lg">
                    {filtered.map(s => (
                        <li key={s.id} onClick={() => handleSelect(s)} className="px-3 py-2 cursor-pointer hover:bg-bg-secondary text-sm text-text-primary transition-colors">
                            {s.name} {s.document && `(${s.document})`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SupplierAutocomplete;
