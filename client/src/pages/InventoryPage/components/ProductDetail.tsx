import React from 'react';
import type { Product } from '../../../types';

interface ProductDetailProps {
    product: Product;
    onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
    return (
        <div className="p-6 bg-bg-primary rounded-lg max-w-2xl mx-auto shadow-lg">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">{product.name}</h2>
            <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">Código:</strong> {product.code || '-'}</p>
            <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">EAN:</strong> {product.barcode || '-'}</p>
            <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">Preço:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>
            <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">Custo:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.cost)}</p>
            <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">Estoque:</strong> {product.stock} {product.unit}</p>
            <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">Status:</strong> {product.status}</p>
            {product.description && <p className="my-2 leading-relaxed text-text-primary"><strong className="font-semibold text-text-secondary">Descrição:</strong> {product.description}</p>}
            {product.imageUrl && (
                <div className="mt-4 text-center">
                    <img src={product.imageUrl} alt={product.name} className="max-w-full h-auto rounded border border-border" />
                </div>
            )}
            <button className="mt-6 w-full px-4 py-2 bg-bg-tertiary text-text-primary rounded-md hover:bg-border-hover transition-colors" onClick={onClose}>Fechar</button>
        </div>
    );
};

export default ProductDetail;
