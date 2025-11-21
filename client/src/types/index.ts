export interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    status: 'ACTIVE' | 'INACTIVE';
    role: 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
    departments?: Department[];
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
}

export interface Department {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: string;
    departmentId?: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

export interface Customer {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    document?: string;
    status: 'ACTIVE' | 'INACTIVE';
    type: CustomerType;
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFilters {
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    page?: number;
    limit?: number;
}

export type SupplierType = 'INDIVIDUAL' | 'COMPANY';

export interface Supplier {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    document?: string;
    status: 'ACTIVE' | 'INACTIVE';
    type: SupplierType;
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierFilters {
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    page?: number;
    limit?: number;
}


// ==================== KANBAN TYPES ====================

export type CardPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Card {
    id: number;
    title: string;
    description?: string;
    position: number;
    priority: CardPriority;
    dueDate?: string;
    columnId: number;
    assignedToId?: number;
    assignedTo?: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Column {
    id: number;
    title: string;
    position: number;
    color: string;
    boardId: number;
    cards: Card[];
    createdAt: string;
    updatedAt: string;
}

export interface Board {
    id: number;
    title: string;
    description?: string;
    color: string;
    columns: Column[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateBoardData {
    title: string;
    description?: string;
    color?: string;
}

export interface CreateColumnData {
    title: string;
    color?: string;
}

export interface CreateCardData {
    title: string;
    description?: string;
    columnId: number;
    priority?: CardPriority;
    dueDate?: string;
    assignedToId?: number;
}

export interface MoveCardData {
    targetColumnId: number;
    targetPosition: number;
}


// ==================== INVENTORY TYPES ====================

export interface Category {
    id: number;
    name: string;
    description?: string;
    _count?: {
        products: number;
    };
    createdAt: string;
    updatedAt: string;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface Product {
    id: number;
    code?: string;
    barcode?: string;
    name: string;
    description?: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    unit: string;
    status: ProductStatus;
    imageUrl?: string;

    width?: number;
    height?: number;
    length?: number;
    weight?: number;

    categoryId?: number;
    category?: Category;

    supplierId?: number;
    // supplier?: Supplier; // Define Supplier if needed

    createdAt: string;
    updatedAt: string;
}


export interface ProductFilters {
    search?: string;
    status?: ProductStatus;
    categoryId?: number;
}

// ==================== SALES TYPES ====================

export type SaleStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type PaymentMethod = 'DEBIT_CARD' | 'CREDIT_CARD' | 'CASH' | 'PIX' | 'BOLETO';

export interface SaleItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    saleId: number;
    productId: number;
    product: Product;
}

export interface Sale {
    id: number;
    number: string;
    date: string;
    status: SaleStatus;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod?: PaymentMethod;
    notes?: string;
    customerId: number;
    customer: Customer;
    createdById: number;
    createdBy?: User;
    items: SaleItem[];
    createdAt: string;
    updatedAt: string;
}

export interface SaleFilters {
    search?: string;
    status?: SaleStatus;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}
