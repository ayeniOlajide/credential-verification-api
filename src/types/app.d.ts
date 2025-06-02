declare global {
    enum SortOrder {
      ASC = 'asc',
      DESC = 'desc'
    }
  
    interface Pagination {
      from?: number;
      limit?: number;
      sortOrder?: "asc" | "desc";
      orderBy?: string;
      dateFrom?: string;
      dateTo?: string;
      month?: string;
    }
  }
  
  export {};
  