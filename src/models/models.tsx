export interface ErrorType {
  detail: string;
}

export interface ApiResponse<T> {
  data: ErrorType | T;
  success: boolean;
}

//Product type
export interface Product {
  id?: number;
  name?: string;
  type?: string;
  quantity?: number;
  avgBuyRate?: number;
  usedInTransaction?: number;
  org?: string;
  subtype?: string;
  description?: string;
  metaData?: string;
  active?: number;
}

//Customer type
export interface Customer {
  id?: number;
  name?: string;
  usedInTransaction?: number;
  address?: string;
  phone?: string;
  taxNumber?: string;
  org?: string;
  metaData?: string;
  active?: number;
}

//Transaction Interfaces
export interface TransactionItem {
  productId?: number;
  org?: string;
  name?: string;
  quantity?: number;
  rate?: number;
  productType?: string;
  productSubtype?: string;
  productDescription?: string;
  productMetaData?: string;
}

export interface Transaction {
  id?: number;
  invoiceNumber?: string;
  org?: string;
  date?: string;
  description?: string;
  metaData?: string;
  customerId?: number;
  name?: string;
  totalAmount?: number;
  buyOrSell?: string;
  items?: TransactionItem[];
  customerAddress?: string;
  customerPhone?: string;
  customerTaxNumber?: string;
  customerMetaData?: string;
}

export interface TransactionItemDetails {
  productId?: number;
  org?: string;
  name?: string;
  quantity?: number;
  rate?: number;
  transaction?: Transaction;
}

export interface Portfolio {
  buyAmount?: number;
  sellAmount?: number;
  startDate?: string;
  endDate?: string;
  transactionsList?: Transaction[] | TransactionItemDetails[];
}
