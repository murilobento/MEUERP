import React from 'react';
import type { Product } from '../../../types';
import './ProductDetail.css';
// import { formatCurrency } from '../../../utils/format';

interface ProductDetailProps {
    product: Product;
    onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
    return (
        <div className="product-detail">
            <h2>{product.name}</h2>
            <p><strong>Código:</strong> {product.code || '-'}</p>
            <p><strong>EAN:</strong> {product.barcode || '-'}</p>
            <p><strong>Preço:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>
            <p><strong>Custo:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.cost)}</p>
            <p><strong>Estoque:</strong> {product.stock} {product.unit}</p>
            <p><strong>Status:</strong> {product.status}</p>
            {product.description && <p><strong>Descrição:</strong> {product.description}</p>}
            {product.imageUrl && (
                <div className="image-preview">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
            )}
            <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
    );
};

export default ProductDetail;
